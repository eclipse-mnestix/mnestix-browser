/**
 * @param {Record<string, string | undefined>} envs
 */
export function validateEnvs(envs) {
    if (envs.KEYCLOAK_ENABLED === 'true') {
        const requiredKeys = [
            'KEYCLOAK_ISSUER',
            'KEYCLOAK_LOCAL_URL',
            'KEYCLOAK_REALM',
            'KEYCLOAK_CLIENT_ID',
            'NEXTAUTH_SECRET',
        ];
        for (const key of requiredKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when KEYCLOAK_ENABLED is true`);
            }
        }
    }
    if (envs.AUTHENTICATION_FEATURE_FLAG === 'true') {
        if (envs.KEYCLOAK_ENABLED !== 'true') {
            throw new Error('Keycloak must be configured when AUTHENTICATION_FEATURE_FLAG is true');
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

if (process.argv[1] === import.meta.filename) {
    validateEnvs(process.env);
}
