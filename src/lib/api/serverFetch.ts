'use server';

import { ApiResponseWrapper, wrapErrorCode, wrapResponse } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { headers } from 'next/headers';
import { createRequestLogger } from 'lib/util/Logger';
import pino from 'pino';

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
                Http_Message: response?.statusText,
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

export async function performServerFetchRaw(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<Response> {
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
                Http_Message: response?.statusText,
            },
            'Initiating server fetch (raw)',
        );
        return response;
    } catch (e) {
        if (e instanceof Error) {
            log.warn({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request URL: ${input}`);
            throw e;
        }
        log.error({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request: ${input}`);
        throw new Error('Unknown error');
    }
}