'use server';

import dedent from 'dedent';
import { ApiResponseWrapper, wrapErrorCode, wrapResponse } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

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
    try {
        const response = await fetch(input, init);
        if (response.status >= 500) {
            console.warn(dedent`
                Server error encountered:
                Request URL: ${input}
                Status: ${response.status} (${response.statusText})
                Request Options: ${JSON.stringify(init?.body /* only logging body to limit data */, null, 2)}
            `);
        }
        return await wrapResponse<T>(response);
    } catch (e) {
        const message = 'this could be a network error';
        console.warn(message, '\nException message:', e.message);
        return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, message);
    }
}
