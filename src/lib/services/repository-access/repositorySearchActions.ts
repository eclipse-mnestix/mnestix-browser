'use server';

import { AssetAdministrationShell, Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/repository-access/RepositorySearchService';
import { Reference } from '@aas-core-works/aas-core3.0-typescript/types';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';

const searcher = RepositorySearchService.create();

export async function performSearchAasFromAllRepositories(
    searchInput: string,
): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
    return searcher.getAasFromAllRepos(searchInput);
}

export async function performSearchSubmodelFromAllRepos(searchInput: string): Promise<ApiResponseWrapper<Submodel>> {
    const response = await searcher.getFirstSubmodelFromAllRepos(searchInput);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult);
}

export async function performGetAasThumbnailFromAllRepos(searchInput: string): Promise<ApiResponseWrapper<Blob>> {
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
    const defaultResponsePromise = searcher.getAasThumbnailFromDefaultRepo(aasId);
    const allResponsePromise = searcher.getFirstAasThumbnailFromAllRepos(aasId);

    const defaultResponse = await defaultResponsePromise;
    if (defaultResponse.isSuccess) return wrapFile(defaultResponse.result);

    const allResponse = await allResponsePromise;
    if (allResponse.isSuccess) return wrapFile(allResponse.result.searchResult);

    return wrapErrorCode(allResponse.errorCode, allResponse.message);
}

export async function getSubmodelReferencesFromShell(searchInput: string): Promise<ApiResponseWrapper<Reference[]>> {
    const response = await searcher.getFirstSubmodelReferencesFromShellFromAllRepos(searchInput);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult.result);
}

export async function getSubmodelById(id: string): Promise<ApiResponseWrapper<Submodel>> {
    const response = await searcher.getFirstSubmodelFromAllRepos(id);
    if (!response.isSuccess) return wrapErrorCode(response.errorCode, response.message);
    return wrapSuccess(response.result.searchResult);
}

export async function getAttachmentFromSubmodelElement(
    submodelId: string,
    submodelElementPath: string,
    baseRepositoryUrl?: string,
): Promise<ApiResponseWrapper<ApiFileDto>> {
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
