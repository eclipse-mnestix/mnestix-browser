'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import {
    AasSearchResult,
    InfrastructureSearchService,
} from 'lib/services/infrastructure-search-service/InfrastructureSearchService';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { Reference, Submodel } from 'lib/api/aas/models';
import { RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositoryService';

/**
 * Performs a full search for an Asset Administration Shell or AssetId across all infrastructures.
 * @param searchInput AasId or AssetId to search for
 */
export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performFullAasSearch', 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchAASInAllInfrastructures(searchInput);
}

/**
 * Performs a search for an Asset Administration Shell or AssetId in a specific infrastructure.
 * @param searchInput
 * @param infrastructureName
 */
export async function searchAasInInfrastructure(
    searchInput: string,
    infrastructureName: string,
): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'searchAasInInfrastructure', 'Initiating AAS/AssetId search', {
        Requested_ID: searchInput,
        Infrastructure_Name: infrastructureName,
    });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchAasInInfrastructure(searchInput, infrastructureName);
}

/**
 * Performs a search for a Submodel in a specific infrastructure.
 * @param submodelReference
 * @param infrastructureName
 * @param submodelDescriptor
 */
export async function performSubmodelSearch(
    submodelReference: Reference,
    infrastructureName: string,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<RepoSearchResult<Submodel>>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSubmodelSearch', 'Initiating Submodel search', {
        Requested_Submodel_Reference: submodelReference,
        Infrastructure_Name: infrastructureName,
    });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchSubmodelInInfrastructure(submodelReference, infrastructureName, submodelDescriptor);
}
