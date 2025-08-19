import { MappedInfrastructure } from "../InfrastructureTypes";

export const mockMappedInfrastructures: MappedInfrastructure[] = [
    {
        id: 'infra-1',
        name: 'Test Infrastructure 1',
        logo: 'https://example.com/logo1.png',
        securityType: 'NONE',
        connections: [
            {
                id: 'conn-1',
                url: 'https://api.example.com',
                types: [
                    'AAS_REPOSITORY',
                    'AAS_REGISTRY',
                    'SUBMODEL_REPOSITORY',
                    'SUBMODEL_REGISTRY',
                    'DISCOVERY_SERVICE',
                    'CONCEPT_DESCRIPTION',
                ],
            },
        ],
    },
    {
        id: 'infra-2',
        name: 'Test Infrastructure 2',
        logo: undefined,
        securityType: 'HEADER',
        connections: [
            {
                id: 'conn-2',
                url: 'https://api2.example.com',
                types: [
                    'AAS_REGISTRY',
                    'SUBMODEL_REPOSITORY',
                    'SUBMODEL_REGISTRY',
                    'DISCOVERY_SERVICE',
                    'CONCEPT_DESCRIPTION',
                ],
            },
        ],
        securityHeader: {
                name: "HEADER",
                value: "value",
            },
    },
    {
        id: 'infra-3',
        name: 'Test Infrastructure 3',
        logo: undefined,
        securityType: 'PROXY',
        connections: [
            {
                id: 'conn-3',
                url: 'https://api2.example.com',
                types: ['AAS_REGISTRY'],
            },
        ],
            securityProxy: {
                value: "proxy",
            },
    }
];
export const mockInfrastructures = [
    {
        id: 'infra-1',
        name: 'Test Infrastructure 1',
        logo: 'https://example.com/logo1.png',
        securityType: {
            id: 'sec-1',
            typeName: 'NONE',
        },
        connections: [
            {
                id: 'conn-1',
                url: 'https://api.example.com',
                types: [
                    {
                        type: {
                            id: 'type-1',
                            typeName: 'AAS_REPOSITORY',
                        },
                    },
                ],
            },
        ],
        securitySettingsHeaders: [],
        securitySettingsProxies: [],
    },
    {
        id: 'infra-2',
        name: 'Test Infrastructure 2',
        logo: null,
        securityType: {
            id: 'sec-2',
            typeName: 'HEADER',
        },
        connections: [
            {
                id: 'conn-2',
                url: 'https://api2.example.com',
                types: [
                    {
                        type: {
                            id: 'type-2',
                            typeName: 'AAS_REGISTRY',
                        },
                    },
                ],
            },
        ],
        securitySettingsHeaders: [
            {
                id: 'header-1',
                headerName: 'Authorization',
                headerValue: 'Bearer token',
            },
        ],
        securitySettingsProxies: [],
    },
];

export const emptyMappedInfrastructure: MappedInfrastructure = {
    id: '',
    name: '',
    securityType: 'NONE',
    connections: []
};

export const faultyMappedInfrastructure: MappedInfrastructure =
    {
        id: 'faulty-1',
        name: 'Faulty Infrastructure',
        logo: undefined,
        securityType:  'NONE',
        connections: [
            {
                id: 'conn-2',
                url: 'https://api2.example.com',
                types: [],
            },
        ],
    }