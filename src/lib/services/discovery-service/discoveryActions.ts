import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { DiscoverySearchResult, DiscoverySearchService } from 'lib/services/discovery-service/DiscoverySearchService';

export async function searchInAllDiscoveries(
    searchInput: string,
): Promise<ApiResponseWrapper<DiscoverySearchResult[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performDiscoveryAasSearch', 'Requested AssetId', { requestedId: searchInput });
    const searcher = DiscoverySearchService.create(logger);

    return searcher.searchAASInAllDiscoveries(searchInput);
}
