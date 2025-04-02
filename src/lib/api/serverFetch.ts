'use server';

import { ApiResponseWrapper, wrapErrorCode, wrapResponse } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { headers } from 'next/headers';
import { createLogger, getCorrelationId } from 'lib/util/Logger';

/**
 * @deprecated use performServerFetch() instead
 */
export async function performServerFetchLegacy(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<string> {
    const response = await fetch(input, init);
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(await response.text());
    } else throw response;
}

export async function performServerFetch<T>(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<ApiResponseWrapper<T>> {
    const correlationId = getCorrelationId(await headers());
    const logger = createLogger(correlationId);
    try {
        const response = await fetch(input, init);
        logger.debug(
            {
                Request_Url: input,
                Http_Status: `${response?.status} (${response?.statusText})`,
            },
            'Initiating server fetch',
        );
        return await wrapResponse<T>(response);
    } catch (e) {
        if (e instanceof Error) {
            logger.warn({ http: e }, `Request: ${input}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, e.message);
        } else {
            logger.error({ http: e }, `Request: ${input}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Unknown error');
        }
    }
}
