'use server';

import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { RepositorySearchService } from 'lib/services/aas-repository-service/RepositorySearchService';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';

export async function getAttachmentFromSubmodelElement(
    submodelId: string,
    submodelElementPath: string,
    baseRepositoryUrl?: string,
): Promise<ApiResponseWrapper<ApiFileDto>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getAttachmentFromSubmodelElement.name, 'Requested Attachment', {
        submodelId: submodelId,
        submodelElementPath: submodelElementPath,
    });
    const searcher = RepositorySearchService.create(logger);
    if (baseRepositoryUrl) {
        const fileSearcher = SubmodelRepositoryApi.create(baseRepositoryUrl, mnestixFetch());
        const searchResponse = await fileSearcher.getAttachmentFromSubmodelElement(submodelId, submodelElementPath);
        if (!searchResponse.isSuccess) return wrapErrorCode(searchResponse.errorCode, searchResponse.message);
        return wrapFile(searchResponse.result);
    }

    const response = await searcher.getFirstAttachmentFromSubmodelElementFromAllRepos(submodelId, submodelElementPath);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapFile(response.result.searchResult);
}
