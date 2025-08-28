'use server';

import { AssetAdministrationShell } from 'lib/api/aas/models';
import { AasRepositoryService, RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositoryService';
import { ApiFileDto, ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';

export async function searchAasInAllRepositories(
    searchInput: string,
): Promise<ApiResponseWrapper<RepoSearchResult<AssetAdministrationShell>[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSearchAasFromAllRepositories', 'Requested AAS', { requestedId: searchInput });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.searchInAllAasRepositories(searchInput);
}

export async function getThumbnailFromShell(
    aasId: string,
    baseRepositoryUrl: string,
): Promise<ApiResponseWrapper<ApiFileDto>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getThumbnailFromShell', 'Requested Thumbnail for AAS', { requestedId: aasId });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.getThumbnailFromShell(aasId, baseRepositoryUrl);
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
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.downloadAasFromRepo(aasId, submodelIds, baseRepositoryUrl, includeConceptDescriptions);
}

export async function getAasFromRepository(
    aasId: string,
    repositoryUrl: string,
): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getAasFromRepository', 'Requested AAS/AssetID', {
        requestedId: aasId,
        repositoryUrl: repositoryUrl,
    });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.getAasFromRepository(aasId, repositoryUrl);
}
