'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { Submodel } from 'lib/api/aas/models';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AasSearchResult } from '../infrastructure-search-service/InfrastructureSearchService';

export async function searchAASInAllAasRegistries(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'searchAASInAllAasRegistries', 'Requested AssetId', { requestedId: searchInput });
    const searcher = AasRegistryService.create(logger);

    return searcher.searchInAllAasRegistries(searchInput);
}
// TODO move to submodel registry service
export async function getSubmodelFromSubmodelDescriptor(url: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: url });
    const localFetch = mnestixFetch();
    return localFetch.fetch<Submodel>(url, {
        method: 'GET',
    });
}
