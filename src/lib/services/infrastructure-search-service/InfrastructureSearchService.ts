// Search All Discovery Services in all Infrastructures
// Search All Discovery Services in specific Infrastructure (later needed to choose a specific one)
// Search All AAS Registries in all Infrastructures
// Search All AAS Registries in current Infrastructures
// Search All AAS Repositories in all Infrastructures
// Search All AAS Repositories in current Infrastructures

import { RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import logger from 'lib/util/Logger';
import { AasRegistrySearchService } from 'lib/services/infrastructure-search-service/RegistrySearchService';
import { DiscoverySearchService } from 'lib/services/infrastructure-search-service/DiscoverySearchService';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { encodeBase64 } from 'lib/util/Base64Util';

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

    private getInfrastructures() {
        // build default infrastructure from envs
        // get from database as flat connection list
        const infrastructures = [
            {
                name: 'DefaultInfrastructure',
                discoveryUrls: ['https://default-discovery-url.com'],
                aasRegistryUrls: [],
                aasRepositoryUrls: [],
            },
            {
                name: 'Infrastructure1',
                discoveryUrls: ['https://discovery1-url.com'],
                aasRegistryUrls: ['https://aas-registry1-url.com'],
                aasRepositoryUrls: ['https://aas-repository1-url.com'],
            },
            {
                name: 'Infrastructure2',
                discoveryUrls: ['https://discovery2-url.com'],
                aasRegistryUrls: ['https://aas-registry2-url.com'],
                aasRepositoryUrls: ['https://aas-repository2-url.com'],
            },
        ];

        return infrastructures;
    }

    public async searchAASInAllInfrastructures(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
        // Search in all discovery services in all infrastructures
        const infrastructures = this.getInfrastructures();
        let currentInfrastructureName: string | null = null;

        const discoveryResult = await this.discoveryServiceSearchService.searchAASIdInAllDiscoveryServices(
            searchInput,
            infrastructures,
        );

        let infrastructuresToSearch = infrastructures;
        let aasId = searchInput;

        if (discoveryResult.isSuccess) {
            // if multiple -> stop search and return list for the user to choose

            // if single -> search in the AAS registries of the current infrastructure
            currentInfrastructureName = discoveryResult.result[0]?.infrastructureName || null;
            aasId = encodeBase64(discoveryResult.result[0].aasId!);
            infrastructuresToSearch =
                infrastructures.filter((infra) => infra.name === currentInfrastructureName) ?? infrastructures;
        }
        const aasRegistryResult = await this.aasRegistrySearchService.searchAASInAllRegistries(
            aasId,
            infrastructuresToSearch,
        );

        if (aasRegistryResult.isSuccess) {
            // if multiple -> stop search and return list for the user to choose

            // if single -> search in the AAS repositories of the current infrastructure
            if (aasRegistryResult.result.length > 1) {
                return wrapErrorCode(
                    ApiResultStatus.INTERNAL_SERVER_ERROR,
                    'Multiple AAS found, please refine your search',
                );
            }
        }

        // handle results from repository search:

        return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'No AAS found for the given ID');
    }
}
