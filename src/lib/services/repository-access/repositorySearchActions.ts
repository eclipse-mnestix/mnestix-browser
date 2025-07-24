'use server';

import { AssetAdministrationShell, Submodel, Reference } from 'lib/api/aas/models';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
    wrapSuccess,
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
    return searcher.getAasFromAllRepos(searchInput);
}

export async function performSearchSubmodelFromAllRepos(searchInput: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, performSearchSubmodelFromAllRepos.name, 'Requested Submodel', { requestedId: searchInput });
    const searcher = RepositorySearchService.create(logger);
    const response = await searcher.getFirstSubmodelFromAllRepos(searchInput);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult);
}

export async function performGetAasThumbnailFromAllRepos(searchInput: string): Promise<ApiResponseWrapper<Blob>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, performGetAasThumbnailFromAllRepos.name, 'Requested AAS Thumbnail', { requestedId: searchInput });
    const searcher = RepositorySearchService.create(logger);
    const response = await searcher.getFirstAasThumbnailFromAllRepos(searchInput);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult);
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

// Thumbnail function if explicit endpoint is not known; maybe use for new List else YAGNI
export async function getThumbnailFromShellFromAllRepos(aasId: string): Promise<ApiResponseWrapper<ApiFileDto>> {
    const logger = createRequestLogger(await headers());
    const searcher = RepositorySearchService.create(logger);
    logInfo(logger, getThumbnailFromShellFromAllRepos.name, 'Requested AAS Thumbnail', { requestedId: aasId });
    const defaultResponsePromise = searcher.getAasThumbnailFromDefaultRepo(aasId);
    const allResponsePromise = searcher.getFirstAasThumbnailFromAllRepos(aasId);

    const defaultResponse = await defaultResponsePromise;
    if (defaultResponse.isSuccess) return wrapFile(defaultResponse.result);

    const allResponse = await allResponsePromise;
    if (allResponse.isSuccess) return wrapFile(allResponse.result.searchResult);

    return wrapErrorCode(allResponse.errorCode, allResponse.message);
}

export async function getSubmodelReferencesFromShell(searchInput: string): Promise<ApiResponseWrapper<Reference[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getSubmodelReferencesFromShell.name, 'Requested Submodel References', { requestedId: searchInput });
    const searcher = RepositorySearchService.create(logger);
    const response = await searcher.getFirstSubmodelReferencesFromShellFromAllRepos(searchInput);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult.result);
}

export async function getSubmodelById(id: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getSubmodelById.name, 'Requested Submodel', { requestedId: id });
    const searcher = RepositorySearchService.create(logger);
    const response = await searcher.getFirstSubmodelFromAllRepos(id);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult);
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
