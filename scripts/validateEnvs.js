import { Buffer } from 'buffer';
const keycloakKeys = ['KEYCLOAK_ISSUER', 'KEYCLOAK_REALM', 'KEYCLOAK_CLIENT_ID', 'NEXTAUTH_SECRET'];
const azureAdKeys = ['AD_SECRET_VALUE', 'AD_TENANT_ID', 'AD_CLIENT_ID', 'APPLICATION_ID_URI'];

/**
 * Validates that the encryption key is a base64-encoded 32-byte key
 * @param {string | undefined} key - The encryption key to validate
 * @throws {Error} If key is invalid
 */
function validateEncryptionKey(key) {
    if (!key) {
        throw new Error('SECRET_ENC_KEY is required');
    }

    try {
        const keyBuffer = Buffer.from(key, 'base64');
        if (keyBuffer.length !== 32) {
            throw new Error('SECRET_ENC_KEY must be a base64-encoded 32-byte key (44 characters)');
        }
    } catch (error) {
        if (error.message.includes('SECRET_ENC_KEY')) {
            throw error;
        }
        throw new Error('SECRET_ENC_KEY must be a valid base64-encoded string');
    }
}

/**
 * @param {Record<string, string | undefined>} envs
 */
export function validateEnvs(envs) {
    validateEncryptionKey(envs.SECRET_ENC_KEY);

    if (envs.KEYCLOAK_ENABLED === 'true') {
        for (const key of keycloakKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when KEYCLOAK_ENABLED is true`);
            }
        }
    }

    if (azureAdKeys.find((key) => envs[key])) {
        for (const key of azureAdKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required for Azure AD configuration`);
            }
        }
    }

    const azureAdConfigured = azureAdKeys.find((key) => envs[key]);

    if (envs.AUTHENTICATION_FEATURE_FLAG === 'true') {
        if (envs.KEYCLOAK_ENABLED !== 'true' && !azureAdConfigured) {
            throw new Error('Keycloak/Azure AD must be configured when AUTHENTICATION_FEATURE_FLAG is true');
        }
    }
    if (envs.BASYX_RBAC_ENABLED === 'true') {
        const requiredFlags = ['AUTHENTICATION_FEATURE_FLAG', 'KEYCLOAK_ENABLED'];
        for (const key of requiredFlags) {
            if (envs[key] !== 'true') {
                throw new Error(`${key} is required when BASYX_RBAC_ENABLED is true`);
            }
        }
        const requiredKeys = ['BASYX_RBAC_SEC_SM_API_URL'];
        for (const key of requiredKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when BASYX_RBAC_ENABLED is true`);
            }
        }
    }
    console.log('Configuration valid.');
}

validateEnvs(process.env);
