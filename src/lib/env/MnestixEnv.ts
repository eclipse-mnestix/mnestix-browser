/**
 * This file is for typing the environment variables of Mnestix.
 * Keep in sync with the wiki: /wiki/Mnestix-Configuration-Settings.md
 * Set Defaults in .env.local and compose.yml
 */

// In production builds `process` is not defined on client side
const process_env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {};

const privateEnvs = mapEnvVariables(['MNESTIX_BACKEND_API_KEY', 'SEC_SM_API_URL'] as const);

const privateAzure = mapEnvVariables([
    'AD_CLIENT_ID',
    'AD_TENANT_ID',
    'AD_SECRET_VALUE',
    'APPLICATION_ID_URI',
] as const);

const privateKeycloak =
    process_env.KEYCLOAK_ENABLED === 'true'
        ? {
              KEYCLOAK_ENABLED: true as const,
              KEYCLOAK_ISSUER: process_env.KEYCLOAK_ISSUER!,
              KEYCLOAK_LOCAL_URL: process_env.KEYCLOAK_LOCAL_URL!,
              KEYCLOAK_REALM: process_env.KEYCLOAK_REALM!,
              KEYCLOAK_CLIENT_ID: process_env.KEYCLOAK_CLIENT_ID!,
          }
        : {
              KEYCLOAK_ENABLED: false as const,
          };

const featureFlags = mapEnvVariables(
    [
        'LOCK_TIMESERIES_PERIOD_FEATURE_FLAG',
        'AUTHENTICATION_FEATURE_FLAG',
        'COMPARISON_FEATURE_FLAG',
        'TRANSFER_FEATURE_FLAG',
        'AAS_LIST_FEATURE_FLAG',
        'WHITELIST_FEATURE_FLAG',
        'USE_BASYX_RBAC',
        'KEYCLOAK_ENABLED',
    ] as const,
    parseFlag,
);

const otherVariables = mapEnvVariables([
    'DISCOVERY_API_URL',
    'REGISTRY_API_URL',
    'SUBMODEL_REGISTRY_API_URL',
    'AAS_REPO_API_URL',
    'SUBMODEL_REPO_API_URL',
    'MNESTIX_BACKEND_API_URL',
    'IMPRINT_URL',
    'DATA_PRIVACY_URL',
    'SUBMODEL_WHITELIST',
] as const);

const themingVariables = mapEnvVariables([
    'THEME_PRIMARY_COLOR',
    'THEME_SECONDARY_COLOR',
    'THEME_BASE64_LOGO',
    'THEME_LOGO_URL',
    'THEME_LOGO_MIME_TYPE',
] as const);

/**
 * Public envs that are sent to the client and can be used with the `useEnv` hook.
 */
export const publicEnvs = { ...featureFlags, ...otherVariables, ...themingVariables };

/**
 * Mnestix envs
 *
 * Can be used in the backend. When used in frontend all envs are undefined.
 */
export const envs = { ...publicEnvs, ...privateEnvs, ...privateKeycloak, ...privateAzure };

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
