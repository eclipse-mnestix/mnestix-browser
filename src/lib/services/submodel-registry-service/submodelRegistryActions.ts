'use server';

import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { Submodel } from 'lib/api/aas/models';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { mnestixFetch } from 'lib/api/infrastructure';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { getInfrastructureByName } from '../database/infrastructureDatabaseActions';

export async function getSubmodelFromSubmodelDescriptor(
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: repository.url });

    try {
        await assertEgressAllowed(repository.url, repository.infrastructureName);
    } catch (error) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, (error as Error).message);
    }

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await securityHeadersForUrl(repository.url, infrastructure);

    const localFetch = mnestixFetch(securityHeader);
    return localFetch.fetch<Submodel>(repository.url, {
        method: 'GET',
    });
}
