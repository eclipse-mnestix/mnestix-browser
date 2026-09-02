'use server';
import { mnestixFetch } from 'lib/api/infrastructure';
import { getInfrastructureByName } from './database/infrastructureDatabaseActions';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { RepositoryWithInfrastructure } from './database/InfrastructureMappedTypes';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export async function fetchFileServerSide(
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Blob>> {
    try {
        await assertEgressAllowed(repository.url, repository.infrastructureName);
    } catch (error) {
        return wrapErrorCode<Blob>(ApiResultStatus.FORBIDDEN, (error as Error).message);
    }

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await securityHeadersForUrl(repository.url, infrastructure ?? undefined);
    const { fetch } = mnestixFetch(securityHeader);
    return await fetch<Blob>(repository.url);
}
