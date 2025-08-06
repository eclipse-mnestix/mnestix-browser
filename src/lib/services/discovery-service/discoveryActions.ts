import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { DiscoverySearchResult, DiscoveryService } from 'lib/services/discovery-service/DiscoveryService';

export async function searchInAllDiscoveries(
    searchInput: string,
): Promise<ApiResponseWrapper<DiscoverySearchResult[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performDiscoveryAasSearch', 'Requested AssetId', { requestedId: searchInput });
    const searcher = DiscoveryService.create(logger);

    return searcher.searchAASInAllDiscoveries(searchInput);
}
