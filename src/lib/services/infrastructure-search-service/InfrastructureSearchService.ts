import { RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import logger, { logInfo } from 'lib/util/Logger';
import { AasRegistrySearchService } from 'lib/services/registry-service/RegistrySearchService';
import { DiscoverySearchService } from 'lib/services/discovery-service/DiscoverySearchService';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasData, AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';
import { envs } from 'lib/env/MnestixEnv';
import { AssetAdministrationShell } from 'lib/api/aas/models';
import { fetchAllInfrastructureConnectionsFromDb } from 'lib/services/database/connectionServerActions';

export type InfrastructureConnection = {
    name: string;
    discoveryUrls: string[];
    aasRegistryUrls: string[];
    aasRepositoryUrls: string[];
};

export class InfrastructureSearchService {
    private constructor(
        readonly repositorySearchService: RepositorySearchService,
        readonly aasRegistrySearchService: AasRegistrySearchService,
        readonly discoveryServiceSearchService: DiscoverySearchService,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): InfrastructureSearchService {
        const repositorySearchService = RepositorySearchService.create(log);
        const aasRegistrySearchService = AasRegistrySearchService.create();
        const discoveryServiceSearchService = DiscoverySearchService.create();
        return new InfrastructureSearchService(
            repositorySearchService,
            aasRegistrySearchService,
            discoveryServiceSearchService,
            log,
        );
    }

    private async getInfrastructures() {
        // build default infrastructure from envs
        const defaultInfrastructure: InfrastructureConnection = {
            name: 'DefaultInfrastructure',
            discoveryUrls: envs.DISCOVERY_API_URL ? [envs.DISCOVERY_API_URL] : [],
            aasRegistryUrls: envs.REGISTRY_API_URL ? [envs.REGISTRY_API_URL] : [],
            aasRepositoryUrls: envs.AAS_REPO_API_URL ? [envs.AAS_REPO_API_URL] : [],
        };

        // get from database as flat connection list
        const infrastructures = await fetchAllInfrastructureConnectionsFromDb();

        return [defaultInfrastructure, ...infrastructures];
    }

    public async searchAASInAllInfrastructures(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = await this.getInfrastructures();
        logInfo(this.log, 'searchAASInAllInfrastructures', 'Searching AAS in all infrastructures', infrastructures);

        let currentInfrastructureName: string | null = null;

        let infrastructuresToSearch = infrastructures;
        let aasId = searchInput;

        const discoveryResult = await this.discoveryServiceSearchService.searchAASIdInMultipleDiscoveryServices(
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
        const aasRegistryResult = await this.aasRegistrySearchService.searchAASInMultipleRegistries(
            aasId,
            infrastructuresToSearch,
        );

        if (aasRegistryResult.isSuccess) {
            // multiple -> stop search and return list for the user to choose
            if (aasRegistryResult.result.length > 1) {
                return wrapSuccess(this.createMultipleAasIdResult(searchInput));
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
