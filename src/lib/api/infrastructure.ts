import { performServerFetch, performServerFetchRaw } from 'lib/api/serverFetch';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

// Server-only: these wrappers hand a caller-supplied url straight to `serverFetch`'s unvalidated fetch
// primitive, so a client import must fail the build rather than pull that module into the browser bundle.
import 'server-only';

const initializeRequestOptions = async (init?: RequestInit, securityHeader?: Record<string, string> | null) => {
    init = init || {};
    if (securityHeader) {
        init.headers = {
            ...init.headers,
            ...securityHeader,
        };
    }

    return init;
};

export type MnestixFetch = {
    fetch<T>(url: RequestInfo | URL, init?: RequestInit | undefined): Promise<ApiResponseWrapper<T>>;
};

/**
 * @deprecated use mnestixFetchRaw instead! We don't want to wrap the response in ApiResponseWrapper at this low level anymore.
 */
export function mnestixFetch(securityHeader: Record<string, string> | null): MnestixFetch {
    return {
        fetch: async (url: RequestInfo, init?: RequestInit) => {
            return await performServerFetch(url, await initializeRequestOptions(init, securityHeader));
        },
    };
}

export type MnestixFetchRaw = {
    fetch(url: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;
};

export function mnestixFetchRaw(securityHeader: Record<string, string> | null): MnestixFetchRaw {
    return {
        fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
            return await performServerFetchRaw(url, await initializeRequestOptions(init, securityHeader));
        },
    };
}
