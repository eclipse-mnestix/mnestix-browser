import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logInfo, logResponseDebug } from 'lib/util/Logger';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { encodeBase64 } from 'lib/util/Base64Util';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { RegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import {
    AasData,
    AasSearchResult,
    InfrastructureConnection,
} from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { getInfrastructures } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';
import { fetchFromMultipleEndpoints } from 'lib/services/shared/parallelFetch';
import { AssetAdministrationShellDescriptor, SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import {
    AasRegistryEndpointEntryInMemory,
    RegistryServiceApiInMemory,
} from 'lib/api/registry-service-api/registryServiceApiInMemory';

export type RegistrySearchResult = {
    endpoints: URL[];
    submodelDescriptors: SubmodelDescriptor[];
    infrastructureName?: string | null;
    location: string; // The base URL of the AAS registry
};

export class AasRegistryService {
    private constructor(
        protected readonly getRegistryApiClient: (basePath: string) => IRegistryServiceApi | null,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): AasRegistryService {
        const registryLogger = log?.child({ Service: 'AasRegistryService' });
        return new AasRegistryService(
            (baseUrl) => RegistryServiceApi.create(baseUrl, mnestixFetch(), log),
            registryLogger,
        );
    }

    static createNull(
        aasRegistryDescriptors: AssetAdministrationShellDescriptor[] = [],
        aasRegistryEndpoints: AasRegistryEndpointEntryInMemory[] = [],
    ): AasRegistryService {
        return new AasRegistryService(
            () => new RegistryServiceApiInMemory('', aasRegistryDescriptors, aasRegistryEndpoints),
            logger,
        );
    }
    public async searchInAllAasRegistries(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult[]>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = await getInfrastructures();
        logInfo(this.log, 'searchAASInAllAasRegistries', 'Searching AAS in all infrastructures', infrastructures);

        return this.searchInMultipleAasRegistries(searchInput, infrastructures);
    }

    public async searchInMultipleAasRegistries(
        searchAasId: string,
        infrastructureConnection: InfrastructureConnection[],
    ): Promise<ApiResponseWrapper<AasSearchResult[]>> {
        const registrySearchResult = await this.getFromMultipleRegistries(
            infrastructureConnection,
            (basePath) => this.searchInSingleAasRegistry(searchAasId, basePath),
            `Could not find the AAS '${searchAasId}' in any AAS Registry`,
        );
        if (!registrySearchResult.isSuccess) {
            return wrapErrorCode(registrySearchResult.errorCode, registrySearchResult.message);
        }

        if (registrySearchResult.result.length === 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `No AAS found for ID '${searchAasId}' in any registry`);
        } else if (registrySearchResult.result.length > 1) {
            logInfo(
                this.log,
                'searchInMultipleAasRegistries',
                `Multiple AAS found for ID '${searchAasId}' in multiple registries: ${registrySearchResult.result
                    .map((result) => result.infrastructureName)
                    .join(', ')}`,
            );
            return wrapSuccess([
                {
                    redirectUrl: `/viewer/registry?aasId=${searchAasId}`,
                    aas: null,
                    aasData: null,
                },
            ]);
        }

        const firstResult = registrySearchResult.result[0];
        if (!firstResult.endpoints || !Array.isArray(firstResult.endpoints) || firstResult.endpoints.length === 0) {
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, `No endpoints found for AAS '${searchAasId}'`);
        }

        const endpoint = firstResult.endpoints[0];
        const aasSearchResult = await this.getAasFromEndpoint(endpoint, firstResult.location);

        if (!aasSearchResult.isSuccess) {
            return wrapErrorCode(aasSearchResult.errorCode, aasSearchResult.message);
        }

        /**
         * Extracts the base URL(aasRepositoryOrigin) of the AAS repository, considering that the endpoint URL
         * may contain a path after the repository root. We take the substring up to '/shells'
         * to isolate the base URL.
         */
        const data = {
            submodelDescriptors: registrySearchResult.result[0].submodelDescriptors,
            aasRepositoryOrigin:
                endpoint.origin + endpoint.pathname.substring(0, endpoint.pathname.lastIndexOf('/shells')),
        };
        return wrapSuccess([this.createAasResult(aasSearchResult.result, data)]);
    }

    private async searchInSingleAasRegistry(
        searchAasId: string,
        url: string,
    ): Promise<ApiResponseWrapper<RegistrySearchResult>> {
        const client = this.getRegistryApiClient(url);
        const shellDescription = await client?.getAssetAdministrationShellDescriptorById(searchAasId);
        if (!shellDescription) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'AAS Registry service client is not defined');
        }

        if (!shellDescription.isSuccess) {
            logResponseDebug(this.log, 'performAasRegistrySearch', 'Registry lookup unsuccessful', shellDescription, {
                Requested_ID: searchAasId,
            });
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `Could not find the AAS '${searchAasId}' in the registry service`,
            );
        }
        const endpoints = shellDescription.result.endpoints ?? [];
        const submodelDescriptors = shellDescription.result.submodelDescriptors ?? [];
        const endpointUrls = endpoints.map((endpoint) => new URL(endpoint.protocolInformation.href));
        logResponseDebug(this.log, 'performAasRegistrySearch', 'Registry search successful', shellDescription, {
            Requested_ID: searchAasId,
        });
        return wrapSuccess<RegistrySearchResult>({
            endpoints: endpointUrls,
            submodelDescriptors: submodelDescriptors,
            location: url,
        });
    }

    private async getAasFromEndpoint(
        endpoint: URL,
        registryUrl: string,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        const client = this.getRegistryApiClient(registryUrl);
        if (!client) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'AAS Registry service client is not defined');
        }

        const response = await client?.getAssetAdministrationShellFromEndpoint(endpoint);
        if (!response.isSuccess) {
            logResponseDebug(this.log, 'getAasFromEndpoint', 'Registry lookup unsuccessful', response, {
                endpoint: endpoint.toString(),
            });
        }
        logResponseDebug(this.log, 'getAasFromEndpoint', 'Registry search successful', response, {
            endpoint: endpoint.toString(),
        });
        return response;
    }

    private createAasResult(aas: AssetAdministrationShell, data: AasData): AasSearchResult {
        return {
            redirectUrl: `/viewer/${encodeBase64(aas.id)}`,
            aas: aas,
            aasData: data,
        };
    }

    async getFromMultipleRegistries(
        infrastructures: InfrastructureConnection[],
        kernel: (url: string) => Promise<ApiResponseWrapper<RegistrySearchResult>>,
        errorMsg: string,
    ): Promise<ApiResponseWrapper<RegistrySearchResult[]>> {
        const requests = infrastructures.flatMap((infra) =>
            infra.aasRegistryUrls.map((url) => ({
                url,
                infrastructureName: infra.name,
            })),
        );

        return fetchFromMultipleEndpoints(requests, kernel, errorMsg, (result, url, infrastructureName) => ({
            ...result.result,
            location: url,
            infrastructureName: infrastructureName,
        }));
    }
}
