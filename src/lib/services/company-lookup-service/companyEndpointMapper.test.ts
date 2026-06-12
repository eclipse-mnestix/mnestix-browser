/**
 * Unit tests for companyEndpointMapper
 */

import {
    mapCompanyToInfrastructureFormData,
    mapCompanyToInfrastructureFormDataWithSelected,
    getSupportedEndpointsSummary,
    mapEndpointInterfaceToConnectionType,
} from 'lib/services/company-lookup-service/companyEndpointMapper';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';

describe('companyEndpointMapper', () => {
    const mockCompany: Company = {
        name: 'Example Company',
        domain: 'example.com',
        endpoints: [
            {
                protocolInformation: {
                    href: 'https://discovery.example.com/api/v3.0/lookup/shells',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'AAS-DISCOVERY-3.1',
            },
            {
                protocolInformation: {
                    href: 'https://registry.example.com/api/v3.0/shell-descriptors',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'AAS-REGISTRY-3.1',
            },
            {
                protocolInformation: {
                    href: 'https://repository.example.com/api/v3.0/shells',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'AAS-REPOSITORY-3.1',
            },
            {
                protocolInformation: {
                    href: 'https://sm-registry.example.com/api/v3.0/submodel-descriptors',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'SUBMODEL-REGISTRY-3.1',
            },
            {
                protocolInformation: {
                    href: 'https://sm-repo.example.com/api/v3.0/submodels',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'SUBMODEL-REPOSITORY-3.1',
            },
            {
                protocolInformation: {
                    href: 'https://aasx.example.com/packages',
                    endpointProtocol: 'HTTPS',
                },
                interface: 'AASX-FILE-3.0',
            },
            {
                protocolInformation: {
                    href: 'wss://mqtt.example.com:8883',
                    endpointProtocol: 'WSS',
                },
                interface: 'MQTT-BROKER-3.1.1',
            },
        ],
    };

    describe('mapCompanyToInfrastructureFormData', () => {
        it('should map company to infrastructure form data', () => {
            const result = mapCompanyToInfrastructureFormData(mockCompany);

            expect(result.name).toBe('Example Company');
            expect(result.securityType).toBe('NONE');
            expect(result.connections).toBeDefined();
            expect(result.connections.length).toBeGreaterThan(0);
        });

        it('should create one connection per unique endpoint type', () => {
            const result = mapCompanyToInfrastructureFormData(mockCompany);

            // Should have 5 connections: DISCOVERY_SERVICE, AAS_REGISTRY, AAS_REPOSITORY, SUBMODEL_REGISTRY, SUBMODEL_REPOSITORY
            expect(result.connections.length).toBe(5);
        });

        it('should filter out unsupported endpoint types', () => {
            const result = mapCompanyToInfrastructureFormData(mockCompany);

            // AASX-FILE and MQTT-BROKER should be excluded
            const connectionTypes = result.connections.map((c) => c.types[0]);
            expect(connectionTypes).not.toContain('AASX-FILE');
            expect(connectionTypes).not.toContain('MQTT-BROKER');
        });

        it('should map discovery endpoints correctly', () => {
            const result = mapCompanyToInfrastructureFormData(mockCompany);
            const discoveryConnection = result.connections.find((c) => c.types.includes('DISCOVERY_SERVICE'));

            expect(discoveryConnection).toBeDefined();
            expect(discoveryConnection?.url).toBe('https://discovery.example.com/api/v3.0/lookup/shells');
        });

        it('should map registry endpoints correctly', () => {
            const result = mapCompanyToInfrastructureFormData(mockCompany);
            const registryConnection = result.connections.find((c) => c.types.includes('AAS_REGISTRY'));

            expect(registryConnection).toBeDefined();
            expect(registryConnection?.url).toBe('https://registry.example.com/api/v3.0/shell-descriptors');
        });

        it('should handle companies with no endpoints', () => {
            const emptyCompany: Company = {
                name: 'Empty Company',
                domain: 'empty.com',
                endpoints: [],
            };

            const result = mapCompanyToInfrastructureFormData(emptyCompany);

            expect(result.name).toBe('Empty Company');
            expect(result.connections).toHaveLength(1);
            expect(result.connections[0].url).toBe('');
        });
    });

    describe('getSupportedEndpointsSummary', () => {
        it('should return summary of supported endpoints by type', () => {
            const summary = getSupportedEndpointsSummary(mockCompany);

            expect(summary.get('DISCOVERY_SERVICE')).toBe(1);
            expect(summary.get('AAS_REGISTRY')).toBe(1);
            expect(summary.get('AAS_REPOSITORY')).toBe(1);
            expect(summary.get('SUBMODEL_REGISTRY')).toBe(1);
            expect(summary.get('SUBMODEL_REPOSITORY')).toBe(1);
        });

        it('should not include unsupported endpoint types in summary', () => {
            const summary = getSupportedEndpointsSummary(mockCompany);

            expect(summary.has('AASX-FILE')).toBe(false);
            expect(summary.has('MQTT-BROKER')).toBe(false);
        });

        it('should handle duplicate endpoint types', () => {
            const companyWithDuplicates: Company = {
                name: 'Test',
                domain: 'test.com',
                endpoints: [
                    {
                        protocolInformation: {
                            href: 'https://registry1.test.com',
                            endpointProtocol: 'HTTPS',
                        },
                        interface: 'AAS-REGISTRY-3.1',
                    },
                    {
                        protocolInformation: {
                            href: 'https://registry2.test.com',
                            endpointProtocol: 'HTTPS',
                        },
                        interface: 'AAS-REGISTRY-3.0',
                    },
                ],
            };

            const summary = getSupportedEndpointsSummary(companyWithDuplicates);

            expect(summary.get('AAS_REGISTRY')).toBe(2);
        });

        it('should return empty summary for company with no endpoints', () => {
            const emptyCompany: Company = {
                name: 'Empty',
                domain: 'empty.com',
                endpoints: [],
            };

            const summary = getSupportedEndpointsSummary(emptyCompany);

            expect(summary.size).toBe(0);
        });
    });

    describe('mapEndpointInterfaceToConnectionType', () => {
        it('should map AAS-DISCOVERY to DISCOVERY_SERVICE', () => {
            expect(mapEndpointInterfaceToConnectionType('AAS-DISCOVERY-3.1')).toBe('DISCOVERY_SERVICE');
        });

        it('should map AAS-REGISTRY to AAS_REGISTRY', () => {
            expect(mapEndpointInterfaceToConnectionType('AAS-REGISTRY-3.1')).toBe('AAS_REGISTRY');
        });

        it('should map AAS-REPOSITORY to AAS_REPOSITORY', () => {
            expect(mapEndpointInterfaceToConnectionType('AAS-REPOSITORY-3.1')).toBe('AAS_REPOSITORY');
        });

        it('should map SUBMODEL-REGISTRY to SUBMODEL_REGISTRY', () => {
            expect(mapEndpointInterfaceToConnectionType('SUBMODEL-REGISTRY-3.1')).toBe('SUBMODEL_REGISTRY');
        });

        it('should map SUBMODEL-REPOSITORY to SUBMODEL_REPOSITORY', () => {
            expect(mapEndpointInterfaceToConnectionType('SUBMODEL-REPOSITORY-3.1')).toBe('SUBMODEL_REPOSITORY');
        });

        it('should return null for unsupported AASX-FILE', () => {
            expect(mapEndpointInterfaceToConnectionType('AASX-FILE-3.0')).toBeNull();
        });

        it('should return null for unsupported MQTT-BROKER', () => {
            expect(mapEndpointInterfaceToConnectionType('MQTT-BROKER-3.1.1')).toBeNull();
        });
    });

    describe('mapCompanyToInfrastructureFormDataWithSelected', () => {
        it('should only include selected endpoints', () => {
            const selectedEndpoints = [
                'https://discovery.example.com/api/v3.0/lookup/shells',
                'https://registry.example.com/api/v3.0/shell-descriptors',
            ];
            const result = mapCompanyToInfrastructureFormDataWithSelected(mockCompany, selectedEndpoints);

            expect(result.connections).toHaveLength(2);
            expect(result.connections.map((c) => c.types[0])).toContain('DISCOVERY_SERVICE');
            expect(result.connections.map((c) => c.types[0])).toContain('AAS_REGISTRY');
        });

        it('should not include unselected endpoints', () => {
            const selectedEndpoints = ['https://discovery.example.com/api/v3.0/lookup/shells'];
            const result = mapCompanyToInfrastructureFormDataWithSelected(mockCompany, selectedEndpoints);

            expect(result.connections).toHaveLength(1);
            expect(result.connections[0].types[0]).toBe('DISCOVERY_SERVICE');
        });

        it('should return empty connection if no valid endpoints selected', () => {
            const selectedEndpoints = ['https://non-existent.example.com'];
            const result = mapCompanyToInfrastructureFormDataWithSelected(mockCompany, selectedEndpoints);

            expect(result.connections).toHaveLength(1);
            expect(result.connections[0].url).toBe('');
        });

        it('should filter out unsupported types even from selected endpoints', () => {
            const selectedEndpoints = [
                'https://discovery.example.com/api/v3.0/lookup/shells',
                'https://aasx.example.com/packages',
            ];
            const result = mapCompanyToInfrastructureFormDataWithSelected(mockCompany, selectedEndpoints);

            // Only discovery should be included (AASX is unsupported)
            expect(result.connections).toHaveLength(1);
            expect(result.connections[0].types[0]).toBe('DISCOVERY_SERVICE');
        });

        it('should handle empty selected endpoints', () => {
            const result = mapCompanyToInfrastructureFormDataWithSelected(mockCompany, []);

            expect(result.connections).toHaveLength(1);
            expect(result.connections[0].url).toBe('');
        });
    });
});
