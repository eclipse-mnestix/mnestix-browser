import { AssetAdministrationShellDescriptor, Endpoint, SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { IDiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApiInterface';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { RegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApi';
import { DiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApi';
import { encodeBase64 } from 'lib/util/Base64Util';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasRegistryEndpointEntryInMemory } from 'lib/api/registry-service-api/registryServiceApiInMemory';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import * as process from 'node:process';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import Logger from 'lib/util/Logger';

export type AasData = {
    submodelDescriptors: SubmodelDescriptor[] | undefined;
    aasRepositoryOrigin: string;
};

export type AasSearchResult = {
    redirectUrl: string;
    aas: AssetAdministrationShell | null;
    aasData: AasData | null;
};

export type RegistrySearchResult = {
    endpoints: URL[];
    submodelDescriptors: SubmodelDescriptor[];
};

export type AasSearcherNullParams = {
    aasInRepositories?: RepoSearchResult<AssetAdministrationShell>[];
    submodelsInRepositories?: RepoSearchResult<Submodel>[];
    discoveryEntries?: { aasId: string; assetId: string }[];
    aasRegistryDescriptors?: AssetAdministrationShellDescriptor[];
    aasRegistryEndpoints?: AasRegistryEndpointEntryInMemory[];
    logger: typeof Logger;
};

export class AasSearcher {
    private constructor(
        readonly multipleDataSource: RepositorySearchService,
        readonly discoveryServiceClient: IDiscoveryServiceApi | null,
        readonly registryService: IRegistryServiceApi | null,
        private readonly logger?: typeof Logger,
    ) {}

    static create(logger?: typeof Logger): AasSearcher {
        const multipleDataSource = RepositorySearchService.create(logger);
        const registryServiceClient = process.env.REGISTRY_API_URL
            ? RegistryServiceApi.create(process.env.REGISTRY_API_URL, mnestixFetch())
            : null;
        const discoveryServiceClient = process.env.DISCOVERY_API_URL
            ? DiscoveryServiceApi.create(process.env.DISCOVERY_API_URL, mnestixFetch(), logger)
            : null;
        const searcherLogger = logger?.child({ service: AasSearcher.name });
        return new AasSearcher(multipleDataSource, discoveryServiceClient, registryServiceClient, searcherLogger);
    }

    static createNull({
        aasInRepositories = [],
        submodelsInRepositories = [],
        discoveryEntries = [],
        aasRegistryDescriptors = [],
        aasRegistryEndpoints = [],
    }: AasSearcherNullParams): AasSearcher {
        return new AasSearcher(
            RepositorySearchService.createNull(aasInRepositories, submodelsInRepositories),
            DiscoveryServiceApi.createNull('https://testdiscovery.com', discoveryEntries),
            RegistryServiceApi.createNull('https://testregistry.com', aasRegistryDescriptors, aasRegistryEndpoints),
        );
    }

    async performFullSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        const aasIds = await this.performAasDiscoverySearch(searchInput);
        const foundMultipleDiscoveryResults = aasIds.isSuccess && aasIds.result.length > 1;
        const foundOneDiscoveryResult = aasIds.isSuccess && aasIds.result.length === 1;

        if (foundMultipleDiscoveryResults) {
            return wrapSuccess(this.createDiscoveryRedirectResult(searchInput));
        }

        const aasId = foundOneDiscoveryResult ? aasIds.result[0] : searchInput;
        const aasIdEncoded = encodeBase64(aasId);

        const aasRegistryResult = await this.performRegistrySearch(aasId);
        if (aasRegistryResult.isSuccess) {
            return wrapSuccess(aasRegistryResult.result);
        }

        if (process.env.AAS_REPO_API_URL) {
            const defaultResult = await this.getAasFromDefaultRepository(aasIdEncoded);
            if (defaultResult.isSuccess) {
                const data = {
                    submodelDescriptors: undefined,
                    aasRepositoryOrigin: process.env.AAS_REPO_API_URL,
                };
                return wrapSuccess(this.createAasResult(defaultResult.result, data));
            }
        }

        const potentiallyMultipleAas = await this.getAasFromAllRepositories(aasIdEncoded);
        if (potentiallyMultipleAas.isSuccess) {
            if (potentiallyMultipleAas.result!.length === 1) {
                const data = {
                    submodelDescriptors: undefined,
                    aasRepositoryOrigin: potentiallyMultipleAas.result[0].location,
                };
                return wrapSuccess(this.createAasResult(potentiallyMultipleAas.result[0].searchResult, data));
            }
            if (potentiallyMultipleAas.result!.length > 1) {
                return wrapSuccess(this.createDiscoveryRedirectResult(searchInput));
            }
        }
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'No AAS found for the given ID');
    }

    // TODO: handle multiple endpoints as result
    public async performRegistrySearch(searchAasId: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        const registrySearchResult = await this.performAasRegistrySearch(searchAasId);
        if (!registrySearchResult.isSuccess) {
            return wrapErrorCode(registrySearchResult.errorCode, registrySearchResult.message);
        }
        const endpoint = registrySearchResult.result.endpoints[0];

        const aasSearchResult = await this.getAasFromEndpoint(endpoint);
        if (!aasSearchResult.isSuccess) {
            return wrapErrorCode(aasSearchResult.errorCode, aasSearchResult.message);
        }

        /**
         * Extracts the base URL(aasRepositoryOrigin) of the AAS repository, considering that the endpoint URL
         * may contain a path after the repository root. We take the substring up to '/shells'
         * to isolate the base URL.
         */
        const data = {
            submodelDescriptors: registrySearchResult.result.submodelDescriptors,
            aasRepositoryOrigin:
                endpoint.origin + endpoint.pathname.substring(0, endpoint.pathname.lastIndexOf('/shells')),
        };
        return wrapSuccess(this.createAasResult(aasSearchResult.result, data));
    }

    public async performAasDiscoverySearch(searchAssetId: string): Promise<ApiResponseWrapper<string[]>> {
        if (!this.discoveryServiceClient)
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Discovery service is not defined');
        const response = await this.discoveryServiceClient.getAasIdsByAssetId(searchAssetId);
        if (response.isSuccess) {
            return wrapSuccess(response.result);
        }
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `Could not find the asset '${searchAssetId}' in the discovery service`,
        );
    }

    private createAasResult(aas: AssetAdministrationShell, data: AasData): AasSearchResult {
        return {
            redirectUrl: `/viewer/${encodeBase64(aas.id)}`,
            aas: aas,
            aasData: data,
        };
    }

    private createDiscoveryRedirectResult(searchInput: string): AasSearchResult {
        return {
            redirectUrl: `/viewer/discovery?assetId=${searchInput}`,
            aas: null,
            aasData: null,
        };
    }

    private async performAasRegistrySearch(searchAasId: string): Promise<ApiResponseWrapper<RegistrySearchResult>> {
        if (!this.registryService)
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'AAS Registry service is not defined');
        const shellDescription = await this.registryService.getAssetAdministrationShellDescriptorById(searchAasId);
        this.logger?.info(
            {
                aasId: searchAasId,
            },
            `Registry search: ${this.registryService.getBaseUrl()}`,
        );
        if (!shellDescription.isSuccess) {
            this.logger?.info(
                {
                    aasId: searchAasId,
                    response: shellDescription.errorCode,
                },
                `Registry search: ${this.registryService.getBaseUrl()}`,
            );
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `Could not find the AAS '${searchAasId}' in the registry service`,
            );
        }
        const endpoints = shellDescription.result.endpoints as Endpoint[];
        const submodelDescriptors = shellDescription.result.submodelDescriptors as SubmodelDescriptor[];
        const endpointUrls = endpoints.map((endpoint) => new URL(endpoint.protocolInformation.href));
        return wrapSuccess<RegistrySearchResult>({
            endpoints: endpointUrls,
            submodelDescriptors: submodelDescriptors,
        });
    }

    private async getAasFromEndpoint(endpoint: URL): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        if (!this.registryService)
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'AAS Registry service is not defined');
        this.logger?.info(
            {
                endpoint: endpoint,
            },
            `Registery search: ${this.registryService.getBaseUrl()}`,
        );
        const response = await this.registryService.getAssetAdministrationShellFromEndpoint(endpoint);
        if (!response.isSuccess) this.logger?.warn(response.message);
        return response;
    }

    private async getAasFromDefaultRepository(aasId: string): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const response = await this.multipleDataSource.getAasFromDefaultRepo(aasId);
        if (!response.isSuccess) this.logger?.info(response.message);
        return response;
    }

    private async getAasFromAllRepositories(
        aasId: string,
    ): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
        const response = await this.multipleDataSource.getAasFromAllRepos(aasId);
        if (!response.isSuccess)
            this.logger?.warn(`${this.getAasFromAllRepositories.name} failed with ${response.message}`);
        return response;
    }
}
