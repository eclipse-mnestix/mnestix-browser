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
            // if multiple -> stop search and return list for the user to choose
            if (discoveryResult.result.length > 1) {
                return wrapSuccess(this.createMultipleAssetIdResult(searchInput));
            }
            // if single -> search in the AAS registries of the current infrastructure
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
            // if multiple -> stop search and return list for the user to choose
            if (aasRegistryResult.result.length > 1) {
                return wrapErrorCode(
                    ApiResultStatus.INTERNAL_SERVER_ERROR,
                    'Multiple AAS found, please refine your search',
                );
            }

            // TODO if single -> redirect to AAS Endpoint
        }

        const encodedAasId = encodeBase64(aasId);
        logInfo(this.log, 'AAS_ID', aasId);
        logInfo(this.log, 'AAS_ID_BASE64', encodedAasId);
        const aasRepositoryResult = await this.repositorySearchService.searchAASInMultipleRepositories(
            encodedAasId,
            infrastructuresToSearch,
        );

        if (aasRepositoryResult.isSuccess) {
            // TODO if multiple -> stop search and return list for the user to choose copy from AasSearcher.ts for now...
            if (aasRepositoryResult.result.length > 1) {
                this.log.error(
                    'searchAASInAllInfrastructures',
                    'Multiple AAS found, please refine your search',
                    aasRepositoryResult.result,
                );
                return wrapErrorCode(
                    ApiResultStatus.INTERNAL_SERVER_ERROR,
                    'Multiple AAS found, please refine your search',
                );
            }
            const data: AasData = {
                submodelDescriptors: undefined,
                aasRepositoryOrigin: aasRepositoryResult.result[0].location,
            };

            // if single -> return the AAS search result
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
}
