'use server';

import { AssetAdministrationShell } from 'lib/api/aas/models';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';

export async function performSearchAasFromAllRepositories(
    searchInput: string,
): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSearchAasFromAllRepositories', 'Requested AAS', { requestedId: searchInput });
    const searcher = RepositorySearchService.create(logger);
    return searcher.getFromAllRepos(searchInput);
}

export async function getThumbnailFromShell(
    aasId: string,
    baseRepositoryUrl: string,
): Promise<ApiResponseWrapper<ApiFileDto>> {
    const fileSearcher = AssetAdministrationShellRepositoryApi.create(baseRepositoryUrl, mnestixFetch());
    const searchResponse = await fileSearcher.getThumbnailFromShell(aasId);
    if (!searchResponse.isSuccess) return wrapErrorCode(searchResponse.errorCode, searchResponse.message);
    return wrapFile(searchResponse.result);
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

export async function downloadAasFromRepo(
    aasId: string | string[],
    submodelIds: string[],
    baseRepositoryUrl: string,
    includeConceptDescriptions = true,
): Promise<ApiResponseWrapper<Blob>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'downloadAasFromRepo', 'Requested Download', {
        aasId: aasId,
    });
    const fileSearcher = AssetAdministrationShellRepositoryApi.create(baseRepositoryUrl, mnestixFetch());
    const response = await fileSearcher.downloadAAS(aasId, submodelIds, includeConceptDescriptions);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return response;
}
