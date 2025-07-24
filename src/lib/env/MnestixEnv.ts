/**
 * This file is for typing the environment variables of Mnestix.
 * Keep in sync with the wiki: /wiki/Mnestix-Configuration-Settings.md
 * Set Defaults in .env.local and compose.yml
 *
 * Please align the naming of env variables with already existing ones
 *  - suffix standalone feature flags with `FEATURE_FLAG`
 *  - group features with a common prefix
 *
 * Provide Validation in /scripts/validateEnvs.sh
 */

// In production builds `process` is not defined on client side
const process_env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {};

const privateEnvs = mapEnvVariables(['MNESTIX_BACKEND_API_KEY', 'BASYX_RBAC_SEC_SM_API_URL'] as const);

const privateAzure = mapEnvVariables([
    'AD_CLIENT_ID',
    'AD_TENANT_ID',
    'AD_SECRET_VALUE',
    'APPLICATION_ID_URI',
] as const);

const keycloak = {
    KEYCLOAK_ENABLED: process_env.KEYCLOAK_ENABLED === 'true',
    KEYCLOAK_ISSUER: process_env.KEYCLOAK_ISSUER,
    KEYCLOAK_LOCAL_URL: process_env.KEYCLOAK_LOCAL_URL,
    KEYCLOAK_REALM: process_env.KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: process_env.KEYCLOAK_CLIENT_ID,
};

const featureFlags = mapEnvVariables(
    [
        'LOCK_TIMESERIES_PERIOD_FEATURE_FLAG',
        'AUTHENTICATION_FEATURE_FLAG',
        'COMPARISON_FEATURE_FLAG',
        'TRANSFER_FEATURE_FLAG',
        'AAS_LIST_FEATURE_FLAG',
        'PRODUCT_VIEW_FEATURE_FLAG',
        'WHITELIST_FEATURE_FLAG',
        'KEYCLOAK_ENABLED',
        'BASYX_RBAC_ENABLED',
    ] as const,
    parseFlag,
);

/**
 * Removes a trailing slash from a URL string, if present.
 * @param url The URL string to sanitize
 * @returns The URL without a trailing slash
 */
function removeTrailingSlash(url: string | undefined): string | undefined {
    if (typeof url === 'string' && url.endsWith('/')) {
        return url.slice(0, -1);
    }
    return url;
}

/**
 * All environment variables in this object (except SUBMODEL_WHITELIST) are URLs and are automatically provided without a trailing slash.
 * This ensures consistent URL formats for API calls and external links.
 */
const otherVariables = {
    ...mapEnvVariables(
        [
            'DISCOVERY_API_URL',
            'REGISTRY_API_URL',
            'SUBMODEL_REGISTRY_API_URL',
            'CONCEPT_DESCRIPTION_REPO_API_URL',
            'AAS_REPO_API_URL',
            'SUBMODEL_REPO_API_URL',
            'MNESTIX_BACKEND_API_URL',
            'IMPRINT_URL',
            'DATA_PRIVACY_URL',
        ] as const,
        removeTrailingSlash,
    ),
    // Strong typing and parsing have been neglected here as this is a temporary feature.
    // Validation is also not implemented.
    SUBMODEL_WHITELIST: process_env.SUBMODEL_WHITELIST,
};

const themingVariables = mapEnvVariables([
    'THEME_PRIMARY_COLOR',
    'THEME_SECONDARY_COLOR',
    'THEME_BASE64_LOGO',
    'THEME_LOGO_URL',
    'THEME_LOGO_MIME_TYPE',
] as const);

const LOG_LEVEL = process_env.LOG_LEVEL || (process_env.NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * Public envs that are sent to the client and can be used with the `useEnv` hook.
 */
export const publicEnvs = { LOG_LEVEL, ...featureFlags, ...otherVariables, ...themingVariables, ...keycloak };

/**
 * Mnestix envs
 *
 * Can be used in the backend. When used in frontend all envs are undefined.
 */
export const envs = { ...publicEnvs, ...privateEnvs, ...privateAzure };

function parseFlag(value: string | undefined) {
    if (value === undefined) {
        return false;
    }
    return value.toLowerCase() === 'true';
}

function mapEnvVariables<T extends readonly string[], M = string | undefined>(
    keys: T,
    mapper: (_: string | undefined) => M = (e) => e as M,
): { [key in T[number]]: M } {
    return keys.reduce(
        (acc, key) => {
            // @ts-expect-error reduce is not able to infer the type of key correctly
            acc[key] = mapper(process_env[key]);
            return acc;
        },
        {} as { [key in T[number]]: M },
    );
}
