'use server';

/**
 * Low-level server-side fetch primitive. Every outbound HTTP request the server makes funnels through here,
 * reached only via the `mnestixFetch` / `mnestixFetchRaw` wrappers in `infrastructure.ts` — never called
 * directly from feature code.
 *
 * SECURITY CONTRACT — read before adding a caller:
 *
 * 1. This module does NOT perform SSRF/egress validation. Its only network-safety behaviour is refusing to
 *    follow redirects (see below). Any request whose URL is client-supplied or data-derived (e.g. a registry
 *    descriptor's `href`) MUST be cleared with `assertEgressAllowed(url, infrastructureName)` from
 *    `securityHelpers/repositoryFetchGuard` BEFORE it reaches here. The guard is applied per-action at the
 *    call site (decision D1: guard on the client-supplied base URL, not centrally in `mnestixFetch`), so a new
 *    fetch path that skips it is an unguarded SSRF hole. Operator-configured URLs (infrastructure DB / env
 *    vars) are trusted by definition and are exempt.
 *
 * 2. These exports are Next.js Server Actions (this file carries the top-level `'use server'` directive).
 *    Do NOT import or reference them from a Client Component: that ships their action ID to the browser and
 *    turns an unguarded, arbitrary-URL server fetch into a client-invocable SSRF/credential-relay endpoint.
 *    They are internal helpers — keep them reachable only through the server-side wrappers above.
 */

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

function sanitizeForLog(value: string): string {
    return value.replace(/[\r\n\u2028\u2029]/g, '');
}

function formatFetchInputForLog(input: string | Request | URL): string {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    return sanitizeForLog(raw);
}

function logServerFetchDebug(
    log: pino.Logger<never, boolean>,
    input: string | Request | URL,
    response: Response,
    context: string,
): void {
    log.debug(
        {
            Request_Url: formatFetchInputForLog(input),
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

/**
 * Performs a server-side fetch and wraps the result in an {@link ApiResponseWrapper}. The caller owns egress
 * validation: guard any untrusted `input` with `assertEgressAllowed` first (see the file-level contract).
 */
export async function performServerFetch<T>(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<ApiResponseWrapper<T>> {
    const log = await createServerFetchLogger();
    const safeInput = formatFetchInputForLog(input);

    try {
        const response = await fetch(input, { ...init, redirect: 'manual' });
        if (isRedirectResponse(response)) {
            log.warn({ Reason: 'Refusing to follow redirect', Http_Status: response.status }, `Request URL: ${safeInput}`);
            return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Refusing to follow redirect for a server-side fetch.');
        }
        logServerFetchDebug(log, input, response, 'Initiating server fetch');

        return await wrapResponse<T>(response);
    } catch (e) {
        if (e instanceof Error) {
            log.warn({ Reason: 'An unexpected error occurred during server fetch' }, `Request URL: ${safeInput}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, e.message);
        } else {
            log.error({ Reason: 'An unexpected error occurred during server fetch' }, `Request: ${safeInput}`);
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Unknown error');
        }
    }
}

/**
 * Like {@link performServerFetch} but returns the raw {@link Response} and throws on redirect/error instead of
 * wrapping. Same egress contract: the caller must guard untrusted `input` with `assertEgressAllowed` first.
 */
export async function performServerFetchRaw(
    input: string | Request | URL,
    init?: RequestInit | undefined,
): Promise<Response> {
    const log = await createServerFetchLogger();
    const safeInput = formatFetchInputForLog(input);

    try {
        const response = await fetch(input, { ...init, redirect: 'manual' });
        if (isRedirectResponse(response)) {
            log.warn(
                { Reason: 'Refusing to follow redirect', Http_Status: response.status },
                `Request URL: ${safeInput}`,
            );
            throw new Error('Refusing to follow redirect for a server-side fetch.');
        }
        logServerFetchDebug(log, input, response, 'Initiating server fetch (raw)');

        return response;
    } catch (e) {
        if (e instanceof Error) {
            log.warn({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request URL: ${safeInput}`);
            throw e;
        }
        log.error({ Reason: 'An unexpected error occurred during server fetch (raw)' }, `Request: ${safeInput}`);
        throw new Error('Unknown error', { cause: e });
    }
}