'use server';

import { ApiResponseWrapper, wrapErrorCode, wrapResponse } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { headers } from 'next/headers';
import { createRequestLogger } from 'lib/util/Logger';
import pino from 'pino';

async function createServerFetchLogger(): Promise<pino.Logger<never, boolean>> {
    try {
        return createRequestLogger(await headers());
    } catch {
        return createRequestLogger();
    }
}

function logServerFetchDebug(
    log: pino.Logger<never, boolean>,
    input: string | Request | URL,
    response: Response,
    context: string,
): void {
    log.debug(
        {
            Request_Url: input,
            Http_Status: response?.status,
            Http_Message: response?.statusText,
        },
        context,
    );
}

export async function performServerFetch<T>(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<ApiResponseWrapper<T>> {
    const log = await createServerFetchLogger();

    try {
        const response = await fetch(input, init);
        logServerFetchDebug(log, input, response, 'Initiating server fetch');

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
    const log = await createServerFetchLogger();

    try {
        const response = await fetch(input, init);
        logServerFetchDebug(log, input, response, 'Initiating server fetch (raw)');

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