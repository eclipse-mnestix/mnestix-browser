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
] as const;
