'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import {
    AasSearchResult,
    InfrastructureConnection,
    InfrastructureSearchService,
} from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { envs } from 'lib/env/MnestixEnv';
import { fetchAllInfrastructureConnectionsFromDb } from 'lib/services/database/connectionServerActions';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { Reference, Submodel } from 'lib/api/aas/models';
import { RepoSearchResult } from 'lib/services/aas-repository-service/RepositorySearchService';

export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performFullAasSearch', 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchAASInAllInfrastructures(searchInput);
}

export async function performSubmodelSearch(
    submodelReference: Reference,
    infrastructureName: string,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSubmodelSearch', 'Initiating Submodel search', {
        Requested_Submodel_Reference: submodelReference,
    });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchSubmodelInInfrastructure(submodelReference, infrastructureName, submodelDescriptor);
}

export async function getInfrastructures() {
    // build default infrastructure from envs
    const defaultInfrastructure: InfrastructureConnection = {
        name: 'DefaultInfrastructure',
        discoveryUrls: envs.DISCOVERY_API_URL ? [envs.DISCOVERY_API_URL] : [],
        aasRegistryUrls: envs.REGISTRY_API_URL ? [envs.REGISTRY_API_URL] : [],
        aasRepositoryUrls: envs.AAS_REPO_API_URL ? [envs.AAS_REPO_API_URL] : [],
        submodelRepositoryUrls: envs.SUBMODEL_REPO_API_URL ? [envs.SUBMODEL_REPO_API_URL] : [],
        submodelRegistryUrls: envs.SUBMODEL_REGISTRY_API_URL ? [envs.SUBMODEL_REGISTRY_API_URL] : [],
    };

    // get from database as flat connection list
    const infrastructures = await fetchAllInfrastructureConnectionsFromDb();

    return [defaultInfrastructure, ...infrastructures];
}
