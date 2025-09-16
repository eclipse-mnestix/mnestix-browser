import { useEnv } from 'app/EnvProvider';

export const SECURITY_TYPES = {
    NONE: 'NONE',
    HEADER_SECURITY: 'HEADER',
    MNESTIX_PROXY: 'PROXY',
} as const;

export const CONNECTION_TYPES = [
    { id: 'AAS_REPOSITORY', label: 'AAS Repository Interface' },
    { id: 'AAS_REGISTRY', label: 'AAS Registry Interface' },
    { id: 'SUBMODEL_REPOSITORY', label: 'Submodel Repository Interface' },
    { id: 'SUBMODEL_REGISTRY', label: 'Submodel Registry Interface' },
    { id: 'DISCOVERY_SERVICE', label: 'Discovery Interface' },
    { id: 'CONCEPT_DESCRIPTION', label: 'Concept Description Repository Interface' },
    { id: 'SERIALIZATION_ENDPOINT', label: 'Serialization Interface' },
] as const;

export const ENV_KEY_BY_CONNECTION_ID: Record<string, keyof ReturnType<typeof useEnv>> = {
    AAS_REPOSITORY: 'AAS_REPO_API_URL',
    AAS_REGISTRY: 'REGISTRY_API_URL',
    SUBMODEL_REPOSITORY: 'SUBMODEL_REPO_API_URL',
    SUBMODEL_REGISTRY: 'SUBMODEL_REGISTRY_API_URL',
    DISCOVERY_SERVICE: 'DISCOVERY_API_URL',
    CONCEPT_DESCRIPTION: 'CONCEPT_DESCRIPTION_REPO_API_URL',
    SERIALIZATION_ENDPOINT: 'SERIALIZATION_API_URL',
};
