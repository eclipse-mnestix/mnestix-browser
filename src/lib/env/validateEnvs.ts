import { envs as MnestixEnvs } from './MnestixEnv';

export function validateEnvs(envs: typeof MnestixEnvs) {
    const requiredKeys = ['AAS_REPO_API_URL', 'SUBMODEL_REPO_API_URL', 'DISCOVERY_API_URL'] as const;
    for (const key of requiredKeys) {
        if (!envs[key]) {
            throw new Error(`${key} is required`);
        }
    }

    if (envs.KEYCLOAK_ENABLED) {
        const requiredKeys = ['KEYCLOAK_ISSUER', 'KEYCLOAK_LOCAL_URL', 'KEYCLOAK_REALM', 'KEYCLOAK_CLIENT_ID'] as const;
        for (const key of requiredKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when KEYCLOAK_ENABLED is true`);
            }
        }
    }
    if (envs.AUTHENTICATION_FEATURE_FLAG) {
        if (!envs.KEYCLOAK_ENABLED) {
            throw new Error('Keycloak must be configured when AUTHENTICATION_FEATURE_FLAG is true');
        }
    }
    if (envs.USE_BASYX_RBAC) {
        const requiredKeys = ['AUTHENTICATION_FEATURE_FLAG', 'KEYCLOAK_ENABLED', 'SEC_SM_API_URL'] as const;
        for (const key of requiredKeys) {
            if (!envs[key]) {
                throw new Error(`${key} is required when BASYX_RBAC is true`);
            }
        }
    }
}
