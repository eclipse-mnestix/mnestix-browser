import { RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import logger, { logInfo } from 'lib/util/Logger';
import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { DiscoveryService } from 'lib/services/discovery-service/DiscoveryService';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasData, AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { getInfrastructures } from 'lib/services/infrastructure-search-service/infrastructureSearchActions';

export type InfrastructureConnection = {
    name: string;
    discoveryUrls: string[];
    aasRegistryUrls: string[];
    aasRepositoryUrls: string[];
};

export class InfrastructureSearchService {
    private constructor(
        readonly repositorySearchService: RepositorySearchService,
        readonly aasRegistrySearchService: AasRegistryService,
        readonly discoveryServiceSearchService: DiscoveryService,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): InfrastructureSearchService {
        const repositorySearchService = RepositorySearchService.create(log);
        const aasRegistrySearchService = AasRegistryService.create();
        const discoveryServiceSearchService = DiscoveryService.create();
        return new InfrastructureSearchService(
            repositorySearchService,
            aasRegistrySearchService,
            discoveryServiceSearchService,
            log,
        );
    }

    public async searchAASInAllInfrastructures(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = await getInfrastructures();
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
            currentInfrastructureName = discoveryResult.result[0]?.infrastructureName || null;
            aasId = discoveryResult.result[0].aasId[0];
            logInfo(this.log, 'AAS_ID', aasId);

            infrastructuresToSearch =
                infrastructures.filter((infra) => infra.name === currentInfrastructureName) ?? infrastructures;
        }
        const aasRegistryResult = await this.aasRegistrySearchService.searchInMultipleAasRegistries(
            aasId,
            infrastructuresToSearch,
        );

        if (aasRegistryResult.isSuccess) {
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
            const data: AasData = {
                submodelDescriptors: undefined,
                aasRepositoryOrigin: aasRepositoryResult.result[0].location,
            };

            // single -> return the AAS search result
            return wrapSuccess(this.createAasResult(aasRepositoryResult.result[0].searchResult, data));
        }

        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'No AAS found for the given ID');
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
