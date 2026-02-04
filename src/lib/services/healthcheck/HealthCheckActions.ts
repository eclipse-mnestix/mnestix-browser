'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { envs } from 'lib/env/MnestixEnv';
import { HealthCheckResponse } from 'lib/types/HealthCheckTypes';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logResponseDebug } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { getDefaultInfrastructure } from 'lib/services/database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

/**
 * Performs a health check on the AAS backend
 * @returns The health status and version of the backend, or null if unreachable
 */
export async function performHealthCheck(): Promise<ApiResponseWrapper<HealthCheckResponse>> {
    const logger = createRequestLogger(await headers());
    const defaultInfrastructure = await getDefaultInfrastructure();
    const securityHeader = await createSecurityHeaders(defaultInfrastructure);
    const localFetch = mnestixFetch(securityHeader);

    const response = await localFetch.fetch<HealthCheckResponse>(`${envs.MNESTIX_AAS_GENERATOR_API_URL}/api/health`, {
        method: 'GET',
        cache: 'no-store',
    });

    logResponseDebug(logger, 'performHealthCheck', 'Health check completed', response);

    return response;
}
