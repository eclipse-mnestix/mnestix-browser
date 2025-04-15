'use server';

import { ApiResponseWrapper, wrapErrorCode, wrapResponse } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { headers } from 'next/headers';
import { createRequestLogger } from 'lib/util/Logger';
import pino from 'pino';

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
    let log: pino.Logger<never, boolean>;

    try {
        log = createRequestLogger(await headers());
    } catch {
        log = createRequestLogger();
    }

    try {
        const response = await fetch(input, init);
        log.debug(
            {
                Request_Url: input,
                Http_Status: response?.status,
                Http_Message: response?.statusText
            },
            'Initiating server fetch',
        );
        return await wrapResponse<T>(response);
    } catch (e) {
        if (e instanceof Error) {
            log.warn({ Reason: 'An unexpected error occurred during server fetch' }, `Request URL: ${input}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, e.message);
        } else {
            log.error({ Reason: 'An unexpected error occurred during server fetch' }, `Request: ${input}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Unknown error');
        }
    }
}
