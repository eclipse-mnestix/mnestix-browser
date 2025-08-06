'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import {
    InfrastructureConnection,
    InfrastructureSearchService,
} from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { envs } from 'lib/env/MnestixEnv';
import { fetchAllInfrastructureConnectionsFromDb } from 'lib/services/database/connectionServerActions';

export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performFullAasSearch', 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchAASInAllInfrastructures(searchInput);
}

// TODO find better place for this function
export async function getInfrastructures() {
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
