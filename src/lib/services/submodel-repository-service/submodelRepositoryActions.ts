'use server';

import { Reference } from 'lib/api/aas/models';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import {
    SubmodelRepositoryService,
    SubmodelSearchResult,
} from 'lib/services/submodel-repository-service/SubmodelRepositoryService';
import { RepositorySearchService } from 'lib/services/aas-repository-service/RepositorySearchService';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';

export async function performSubmodelFullSearch(
    submodelReference: Reference,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<SubmodelSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSubmodelFullSearch', 'Requested SubmodelReference', {
        referenceId: submodelReference.keys,
    });
    const searcher = SubmodelRepositoryService.create(logger);
    return searcher.performSubmodelFullSearch(submodelReference, submodelDescriptor);
}

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
