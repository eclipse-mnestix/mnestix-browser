'use server';

import { Submodel } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import {
    ApiResponseWrapper,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

const DEFAULT_HEADERS: HeadersInit = {
    Accept: 'application/json',
};

function getSubmodelTemplatesEndpoint(): string {
    return envs.SUBMODEL_TEMPLATES_API_URL ?? 'https://smt-repo.admin-shell-io.com/api/v3.0/submodels';
}

/**
 * Fetches templates from the submodel templates repository.
 *
 * @returns {Promise<ApiResponseWrapper<Submodel[]>>} Wrapped API response with fetched templates.
 */
export async function fetchSubmodelTemplates(): Promise<ApiResponseWrapper<Submodel[]>> {
    const endpoint = getSubmodelTemplatesEndpoint();

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: DEFAULT_HEADERS,
            cache: 'no-store',
        });

        if (!response.ok) {
            return wrapErrorCode<Submodel[]>(
                ApiResultStatus.UNKNOWN_ERROR,
                'Failed to fetch submodel templates from the repository.',
                response.status,
            );
        }

        const payload = (await response.json()) as { result?: Submodel[] };

        if (!Array.isArray(payload.result)) {
            console.error('Submodel templates response missing result array:', payload);
            return wrapErrorCode<Submodel[]>(
                ApiResultStatus.UNKNOWN_ERROR,
                'Unexpected response format from submodel templates endpoint.',
                response.status,
            );
        }

        return wrapSuccess<Submodel[]>(payload.result, response.status, ApiResultStatus.SUCCESS);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error while fetching submodel templates.';
        console.error('Submodel templates request failed:', message);
        return wrapErrorCode<Submodel[]>(ApiResultStatus.INTERNAL_SERVER_ERROR, message);
    }
}
