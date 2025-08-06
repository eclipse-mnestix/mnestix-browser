import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { AasSearchResult } from 'lib/services/search-actions/AasSearcher';

export async function searchAASInAllAasRegistries(searchInput: string): Promise<ApiResponseWrapper<AasSearchResult[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'searchAASInAllAasRegistries', 'Requested AssetId', { requestedId: searchInput });
    const searcher = AasRegistryService.create(logger);

    return searcher.searchInAllAasRegistries(searchInput);
}
