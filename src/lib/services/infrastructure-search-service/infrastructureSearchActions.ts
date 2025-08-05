'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AasSearchResult } from 'lib/services/search-actions/AasSearcher';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { InfrastructureSearchService } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';

export async function performFullAasSearch(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performFullAasSearch', 'Initiating AAS/AssetId request', { Requested_ID: searchInput });
    const searcher = InfrastructureSearchService.create(logger);
    return searcher.searchAASInAllInfrastructures(searchInput);
}
