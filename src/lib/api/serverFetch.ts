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

// Redirect statuses we refuse to follow. Server-side fetches target BaSyx REST APIs that do not rely on
// redirects; following them would let an attacker-controlled (or compromised) host bounce the request to an
// internal target after the egress guard has already cleared the original URL.
const REDIRECT_STATUSES = [301, 302, 303, 307, 308];

function isRedirectResponse(response: Response): boolean {
    return response.type === 'opaqueredirect' || REDIRECT_STATUSES.includes(response.status);
}

export async function performServerFetch<T>(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<ApiResponseWrapper<T>> {
    const log = await createServerFetchLogger();

    try {
        const response = await fetch(input, { ...init, redirect: 'manual' });
        if (isRedirectResponse(response)) {
            log.warn({ Reason: 'Refusing to follow redirect', Http_Status: response.status }, `Request URL: ${input}`);
            return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Refusing to follow redirect for a server-side fetch.');
        }
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
        const response = await fetch(input, { ...init, redirect: 'manual' });
        if (isRedirectResponse(response)) {
            log.warn(
                { Reason: 'Refusing to follow redirect', Http_Status: response.status },
                `Request URL: ${input}`,
            );
            throw new Error('Refusing to follow redirect for a server-side fetch.');
        }
        logServerFetchDebug(log, input, response, 'Initiating server fetch (raw)');

        return response;
    } catch (e) {
        if (e instanceof Error) {
            log.warn({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request URL: ${input}`);
            throw e;
        }
        log.error({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request: ${input}`);
        throw new Error('Unknown error', { cause: e });
    }
}