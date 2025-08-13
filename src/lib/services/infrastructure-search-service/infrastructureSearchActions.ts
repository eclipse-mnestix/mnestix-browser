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
import { RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositorySearchService';

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
        Infrastructure_Name: infrastructureName,
    });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchSubmodelInInfrastructure(submodelReference, infrastructureName, submodelDescriptor);
}
