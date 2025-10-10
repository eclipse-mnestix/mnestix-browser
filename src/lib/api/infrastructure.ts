import { performServerFetch, performServerFetchExternal } from 'lib/api/serverFetch';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

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

export function mnestixFetch(securityHeader: Record<string, string> | null): MnestixFetch {
    return {
        fetch: async (url: RequestInfo, init?: RequestInit) => {
            return await performServerFetch(url, await initializeRequestOptions(init, securityHeader));
        },
    };
}

export type MnestixFetchExternal = {
    fetch(url: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;
};

export function mnestixFetchExternal(securityHeader: Record<string, string> | null): MnestixFetchExternal {
    return {
        fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
            return await performServerFetchExternal(url, await initializeRequestOptions(init, securityHeader));
        },
    };
}

export const sessionLogOut = async (keycloakEnabled: boolean) => {
    if (!keycloakEnabled) return;
    try {
        await fetch('/api/auth/logout', { method: 'GET' });
    } catch (err) {
        console.error(err);
    }
};
