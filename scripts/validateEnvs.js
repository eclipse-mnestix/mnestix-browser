const keycloakKeys = ['KEYCLOAK_ISSUER', 'KEYCLOAK_REALM', 'KEYCLOAK_CLIENT_ID', 'NEXTAUTH_SECRET'];
const azureAdKeys = ['AD_SECRET_VALUE', 'AD_TENANT_ID', 'AD_CLIENT_ID', 'APPLICATION_ID_URI'];
/**
 * @param {Record<string, string | undefined>} envs
 */
export function validateEnvs(envs) {
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
    if (envs.USE_BASYX_RBAC === 'true') {
        const requiredFlags = ['AUTHENTICATION_FEATURE_FLAG', 'KEYCLOAK_ENABLED'];
        for (const key of requiredFlags) {
            if (envs[key] !== 'true') {
                throw new Error(`${key} is required when USE_BASYX_RBAC is true`);
            }
        }
        const requiredKeys = ['SEC_SM_API_URL'];
        for (const key of requiredKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when USE_BASYX_RBAC is true`);
            }
        }
    }
    console.log('Configuration valid.');
}

validateEnvs(process.env);
