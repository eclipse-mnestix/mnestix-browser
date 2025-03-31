import * as path from 'node:path';
import * as fs from 'node:fs';

const process_env: Record<string, string | undefined> = process.env;

const privateEnvs = mapEnvVariables(['MNESTIX_BACKEND_API_KEY', 'SEC_SM_API_URL'] as const);

const privateAzure = mapEnvVariables([
    'APPLICATION_ID',
    'AD_CLIENT_ID',
    'AD_TENANT_ID',
    'AD_SECRET_VALUE',
    'APPLICATION_ID_URI',
] as const);

const privatKeycloak =
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
] as const);

// Load the image from the public folder and provide it to the theming as base64 image with mime type
// possible TODO automatically parse mimetype but not based on file path but on file content
if (
    !process_env.THEME_BASE64_LOGO &&
    process_env.THEME_LOGO_MIME_TYPE &&
    process_env.THEME_LOGO_MIME_TYPE.startsWith('image/')
) {
    try {
        const imagePath = path.resolve('./public/logo');
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString('base64');
        themingVariables.THEME_BASE64_LOGO = `data:${process_env.THEME_LOGO_MIME_TYPE};base64,${imageBase64}`;
    } catch {
        console.error('Could not load Logo, using default...');
    }
}

export const publicEnvs = { ...featureFlags, ...otherVariables, ...themingVariables };

export const envs = { ...publicEnvs, ...privateEnvs, ...privatKeycloak, ...privateAzure };

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
