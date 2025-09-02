'use server';

import { AssetAdministrationShell } from 'lib/api/aas/models';
import { AasRepositoryService, RepoSearchResult } from 'lib/services/aas-repository-service/AasRepositoryService';
import { ApiFileDto, ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { headers } from 'next/headers';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';

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
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<ApiFileDto>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getThumbnailFromShell', 'Requested Thumbnail for AAS', { requestedId: aasId });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.getThumbnailFromShell(aasId, repository);
}

export async function downloadAasFromRepo(
    aasId: string | string[],
    submodelIds: string[],
    repository: RepositoryWithInfrastructure,
    includeConceptDescriptions = true,
): Promise<ApiResponseWrapper<Blob>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'downloadAasFromRepo', 'Requested Download', {
        aasId: aasId,
    });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.downloadAasFromRepo(aasId, submodelIds, repository, includeConceptDescriptions);
}

export async function getAasFromRepository(
    aasId: string,
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getAasFromRepository', 'Requested AAS/AssetID', {
        requestedId: aasId,
        repositoryUrl: repository.url,
    });
    const aasRepoService = AasRepositoryService.create(logger);
    return aasRepoService.getAasFromRepository(aasId, repository);
}
