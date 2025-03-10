import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { performServerFetch } from 'lib/api/serverFetch';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

let cachedToken: { token: string; expires: number } | undefined;

const NETWORK_LATENCY_BUFFER = 1000;

async function getBearerToken() {
    if (cachedToken && cachedToken.expires > Date.now()) {
        return cachedToken.token;
    }

    const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
        client_id: process.env.SEC_SM_KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.SEC_SM_KEYCLOAK_CLIENT_SECRET!,
        grant_type: 'client_credentials',
        scope: 'openid',
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const expires_in: number = data.expires_in;
    const access_token: string = data.access_token;
    cachedToken = { token: access_token, expires: Date.now() + expires_in * 1000 - NETWORK_LATENCY_BUFFER };
    return access_token;
}

const initializeRequestOptions = async (bearerToken: string, init?: RequestInit) => {
    init = init || {};
    init.headers = {
        ...init.headers,
        Authorization: `Bearer ${bearerToken}`,
    };

    return init;
};

function mnestixFetch(): {
    fetch<T>(url: RequestInfo | URL, init?: RequestInit | undefined): Promise<ApiResponseWrapper<T>>;
} {
    return {
        fetch: async (url: RequestInfo, init?: RequestInit) => {
            return await performServerFetch(url, await initializeRequestOptions(await getBearerToken(), init));
        },
    };
}

export function SecuritySmRepoClient(securitySubmodelRepoBaseUrl: string) {
    return SubmodelRepositoryApi.create(securitySubmodelRepoBaseUrl, mnestixFetch());
}
