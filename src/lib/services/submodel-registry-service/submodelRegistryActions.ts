'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Submodel } from 'lib/api/aas/models';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { mnestixFetch } from 'lib/api/infrastructure';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { getInfrastructureByName } from '../database/infrastructureDatabaseActions';

export async function getSubmodelFromSubmodelDescriptor(
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: repository.url });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);

    const localFetch = mnestixFetch(securityHeader);
    return localFetch.fetch<Submodel>(repository.url, {
        method: 'GET',
    });
}
