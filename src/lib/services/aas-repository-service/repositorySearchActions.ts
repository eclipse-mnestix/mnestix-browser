'use server';

import { AssetAdministrationShell } from 'lib/api/aas/models';
import { RepoSearchResult, RepositorySearchService } from 'lib/services/aas-repository-service/RepositorySearchService';
import {
    ApiFileDto,
    ApiResponseWrapper,
    wrapErrorCode,
    wrapFile,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';

export async function performSearchAasFromAllRepositories(
    searchInput: string,
): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSearchAasFromAllRepositories', 'Requested AAS', { requestedId: searchInput });
    const searcher = RepositorySearchService.create(logger);
    return searcher.searchInAllAasRepositories(searchInput);
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

// no longer working -> we need the infrstructure name to get submodels
export async function getAasFromRepository(
    aasId: string,
    repositoryUrl: string,
): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getAasFromRepository', 'Requested AAS/AssetID', {
        requestedId: aasId,
        repositoryUrl: repositoryUrl,
    });
    const api = AssetAdministrationShellRepositoryApi.create(repositoryUrl, mnestixFetch());
    return api.getAssetAdministrationShellById(aasId);
}
