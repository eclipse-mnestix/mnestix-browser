'use server';
import { mnestixFetch } from 'lib/api/infrastructure';
import { getInfrastructureByName } from './database/infrastructureData';
import { securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { egressBlockedError } from 'lib/util/securityHelpers/egressBlockedError';
import { RepositoryWithInfrastructure } from './database/InfrastructureMappedTypes';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

export async function fetchFileServerSide(
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Blob>> {
    const blocked = await egressBlockedError(repository.url, repository.infrastructureName);
    if (blocked) return blocked;

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await securityHeadersForUrl(repository.url, infrastructure ?? undefined);
    const { fetch } = mnestixFetch(securityHeader);
    return await fetch<Blob>(repository.url);
}
