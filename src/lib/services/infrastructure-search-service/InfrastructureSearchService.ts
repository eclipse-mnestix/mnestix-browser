import logger, { logInfo } from 'lib/util/Logger';
import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { DiscoveryService } from 'lib/services/discovery-service/DiscoveryService';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';
import { AssetAdministrationShell, Reference, Submodel } from 'lib/api/aas/models';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/connectionServerActions';
import { AssetAdministrationShellDescriptor, SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import {
    AasRepositorySearchService,
    RepoSearchResult,
} from 'lib/services/aas-repository-service/AasRepositorySearchService';
import { AasRegistryEndpointEntryInMemory } from 'lib/api/registry-service-api/registryServiceApiInMemory';
import { SubmodelRepositoryService } from 'lib/services/submodel-repository-service/SubmodelRepositoryService';
import { SubmodelRegistryService } from 'lib/services/submodel-registry-service/SubmodelRegistryService';

export type AasSearchResult = {
    redirectUrl: string;
    aas: AssetAdministrationShell | null;
    aasData: AasData | null;
};

export type AasData = {
    submodelDescriptors: SubmodelDescriptor[] | undefined;
    aasRepositoryOrigin: string | undefined;
    infrastructureName: string | null;
};

export type AasSearcherNullParams = {
    aasInRepositories?: RepoSearchResult<AssetAdministrationShell>[];
    submodelsInRepositories?: RepoSearchResult<Submodel>[];
    discoveryEntries?: { aasId: string; assetId: string }[];
    aasRegistryDescriptors?: AssetAdministrationShellDescriptor[];
    aasRegistryEndpoints?: AasRegistryEndpointEntryInMemory[];
    submodelRegistryDescriptors?: SubmodelDescriptor[];
    logger?: typeof logger;
};
export class InfrastructureSearchService {
    private constructor(
        readonly repositorySearchService: AasRepositorySearchService,
        readonly aasRegistrySearchService: AasRegistryService,
        readonly discoveryServiceSearchService: DiscoveryService,
        readonly submodelRepositorySearchService: SubmodelRepositoryService,
        readonly submodelRegistrySearchService: SubmodelRegistryService,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): InfrastructureSearchService {
        const repositorySearchService = AasRepositorySearchService.create(log);
        const aasRegistrySearchService = AasRegistryService.create();
        const discoveryServiceSearchService = DiscoveryService.create();
        const submodelRepositorySearchService = SubmodelRepositoryService.create(log);
        const submodelRegistrySearchService = SubmodelRegistryService.create(log);
        return new InfrastructureSearchService(
            repositorySearchService,
            aasRegistrySearchService,
            discoveryServiceSearchService,
            submodelRepositorySearchService,
            submodelRegistrySearchService,
            log,
        );
    }

    static createNull({
        aasInRepositories = [],
        submodelsInRepositories = [],
        submodelRegistryDescriptors = [],
        discoveryEntries = [],
        aasRegistryDescriptors = [],
        aasRegistryEndpoints = [],
    }: AasSearcherNullParams): InfrastructureSearchService {
        return new InfrastructureSearchService(
            AasRepositorySearchService.createNull(aasInRepositories),
            AasRegistryService.createNull(aasRegistryDescriptors, aasRegistryEndpoints),
            DiscoveryService.createNull(discoveryEntries),
            SubmodelRepositoryService.createNull(submodelsInRepositories),
            SubmodelRegistryService.createNull(submodelRegistryDescriptors),
        );
    }

    public async searchAASInAllInfrastructures(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = await getInfrastructuresIncludingDefault();
        logInfo(this.log, 'searchAASInAllInfrastructures', 'Searching AAS in all infrastructures', infrastructures);

        let currentInfrastructureName: string | null = null;

        let infrastructuresToSearch = infrastructures;
        let aasId = searchInput;

        const discoveryResult = await this.discoveryServiceSearchService.searchAasIdInMultipleDiscoveries(
            searchInput,
            infrastructures,
        );

        if (discoveryResult.isSuccess) {
            // multiple -> stop search and return list for the user to choose
            if (discoveryResult.result.length > 1) {
                return wrapSuccess(this.createMultipleAssetIdResult(searchInput));
            }
            // single -> search in the AAS registries of the current infrastructure
            if (discoveryResult.result.length === 1) {
                currentInfrastructureName = discoveryResult.result[0].infrastructureName || null;
                aasId = discoveryResult.result[0].aasId;

                infrastructuresToSearch =
                    infrastructures.filter((infra) => infra.name === currentInfrastructureName) ?? infrastructures;
            }
        }
        const aasRegistryResult = await this.aasRegistrySearchService.searchInMultipleAasRegistries(
            aasId,
            infrastructuresToSearch,
        );

        if (aasRegistryResult.isSuccess && aasRegistryResult.result.length > 0) {
            // multiple -> stop search and return list for the user to choose
            // TODO think about a better solution to know if the result is a redirect or not
            if (aasRegistryResult.result[0].redirectUrl) {
                return wrapSuccess(aasRegistryResult.result[0]);
            }
            // single -> return the AAS search result
            return wrapSuccess(aasRegistryResult.result[0]);
        }

        const encodedAasId = encodeBase64(aasId);
        const aasRepositoryResult = await this.repositorySearchService.searchAASInMultipleRepositories(
            encodedAasId,
            infrastructuresToSearch,
        );

        if (aasRepositoryResult.isSuccess) {
            // multiple -> stop search and return list for the user to choose
            if (aasRepositoryResult.result.length > 1) {
                logInfo(this.log, 'searchAASInAllInfrastructures', 'Multiple AAS found', aasRepositoryResult.result);
                return wrapSuccess(this.createMultipleAasIdResult(searchInput));
            }
            // single -> return the AAS search result
            if (aasRepositoryResult.result.length === 1) {
                const data: AasData = {
                    submodelDescriptors: undefined,
                    aasRepositoryOrigin: aasRepositoryResult.result[0].location,
                    infrastructureName: aasRepositoryResult.result[0].infrastructureName || null,
                };

                return wrapSuccess(this.createAasResult(aasRepositoryResult.result[0].searchResult, data));
            }
        }

        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'No AAS found for the given ID');
    }

    public async searchSubmodelInInfrastructure(
        reference: Reference,
        infrastructureName: string,
        smDescriptor?: SubmodelDescriptor,
    ): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
        logInfo(this.log, 'searchSubmodelInInfrastructure', 'Searching Submodel in infrastructure', {
            reference,
            infrastructureName,
        });

        // Get Infrastructure
        const infrastructures = await getInfrastructuresIncludingDefault();
        const filteredInfrastructure = infrastructures.find((infra) => infra.name === infrastructureName);

        if (!filteredInfrastructure) {
            logInfo(this.log, 'searchSubmodelInInfrastructure', 'Infrastructure not found', { infrastructureName });
            return wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `Infrastructure with name '${infrastructureName}' not found`,
            );
        }

        // Check if we already have a smDescriptor
        if (smDescriptor && smDescriptor.endpoints.length > 0 && smDescriptor.endpoints[0].protocolInformation.href) {
            const endpoint = smDescriptor.endpoints[0].protocolInformation.href;
            if (endpoint) {
                const submodelSearchResult = await this.submodelRegistrySearchService.getSubmodelFromEndpoint(endpoint);
                if (!submodelSearchResult.isSuccess) {
                    return wrapErrorCode(submodelSearchResult.errorCode, submodelSearchResult.message);
                }
                return wrapSuccess({ searchResult: submodelSearchResult.result, location: endpoint });
            }
        }

        // Search in Submodel Registries, take first submodel descriptor
        const submodelId = reference.keys[0].value;
        const descriptorById = await this.submodelRegistrySearchService.searchInMultipleSubmodelRegistries(
            submodelId,
            filteredInfrastructure,
        );

        // If we have a descriptor, we can get the submodel from the endpoint
        if (descriptorById && descriptorById.result?.endpoints && descriptorById.result.endpoints.length > 0) {
            const endpoint = descriptorById.result.endpoints[0].protocolInformation.href;

            const submodelSearchResult = await this.submodelRegistrySearchService.getSubmodelFromEndpoint(endpoint);
            if (!submodelSearchResult.isSuccess) {
                return wrapErrorCode(submodelSearchResult.errorCode, submodelSearchResult.message);
            } else {
                return wrapSuccess({ searchResult: submodelSearchResult.result, location: endpoint });
            }
        }

        // If we don't have a descriptor, we search in all Submodel Repositories
        const submodelSearchResult = await this.submodelRepositorySearchService.getFirstSubmodelFromAllRepos(
            submodelId,
            filteredInfrastructure,
        );

        // Search in Submodel Repositories, take first submodel

        if (submodelSearchResult.isSuccess) {
            return wrapSuccess(submodelSearchResult.result);
        }

        return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Submodel with ID '${submodelId}' not found`);
    }

    private createAasResult(aas: AssetAdministrationShell, data: AasData): AasSearchResult {
        return {
            redirectUrl: `/viewer/${encodeBase64(aas.id)}`,
            aas: aas,
            aasData: data,
        };
    }
    private createMultipleAssetIdResult(searchInput: string): AasSearchResult {
        return {
            redirectUrl: `/viewer/discovery?assetId=${searchInput}`,
            aas: null,
            aasData: null,
        };
    }
    private createMultipleAasIdResult(searchInput: string): AasSearchResult {
        return {
            redirectUrl: `/viewer/registry?aasId=${searchInput}`,
            aas: null,
            aasData: null,
        };
    }
}
