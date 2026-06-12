/**
 * Maps company endpoints from the Company Lookup API to Mnestix infrastructure format
 */

import { Company, CompanyEndpoint } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

/**
 * Maps an endpoint interface type to Mnestix connection type
 * Skips unsupported interface types
 */
export function mapEndpointInterfaceToConnectionType(interfaceType: string): string | null {
    const interfacePrefix = interfaceType.split('-')[0];

    switch (interfacePrefix) {
        case 'AAS':
            const aasType = interfaceType.split('-')[1];
            switch (aasType) {
                case 'DISCOVERY':
                    return 'DISCOVERY_SERVICE';
                case 'REGISTRY':
                    return 'AAS_REGISTRY';
                case 'REPOSITORY':
                    return 'AAS_REPOSITORY';
                default:
                    return null;
            }
        case 'SUBMODEL':
            const smType = interfaceType.split('-')[1];
            switch (smType) {
                case 'REGISTRY':
                    return 'SUBMODEL_REGISTRY';
                case 'REPOSITORY':
                    return 'SUBMODEL_REPOSITORY';
                default:
                    return null;
            }
        // Skip unsupported types
        case 'AASX':
        case 'SECURE':
        case 'MQTT':
        case 'STS':
            return null;
        default:
            return null;
    }
}

/**
 * Groups endpoints by their connection type
 */
function groupEndpointsByType(endpoints: CompanyEndpoint[]): Map<string, string[]> {
    const grouped = new Map<string, string[]>();

    endpoints.forEach((endpoint) => {
        const connectionType = mapEndpointInterfaceToConnectionType(endpoint.interface);
        if (connectionType) {
            if (!grouped.has(connectionType)) {
                grouped.set(connectionType, []);
            }
            grouped.get(connectionType)!.push(endpoint.protocolInformation.href);
        }
    });

    return grouped;
}

/**
 * Converts a company from the lookup API to an infrastructure form entry
 * Each endpoint becomes a separate connection entry
 */
export function mapCompanyToInfrastructureFormData(company: Company): InfrastructureFormData {
    const grouped = groupEndpointsByType(company.endpoints);

    // Create a connection entry for each endpoint with its supported types
    const connections = Array.from(grouped.entries()).map(([connectionType, urls]) => ({
        id: '',
        url: urls[0], // Use the first URL for the connection
        types: [connectionType],
    }));

    return {
        id: '',
        name: company.name,
        logo: undefined,
        securityType: 'NONE',
        connections:
            connections.length > 0
                ? connections
                : [
                      {
                          id: '',
                          url: '',
                          types: [],
                      },
                  ],
    };
}

/**
 * Converts a company to infrastructure form data, filtering by selected endpoints
 */
export function mapCompanyToInfrastructureFormDataWithSelected(
    company: Company,
    selectedEndpoints: string[],
): InfrastructureFormData {
    const selectedEndpointSet = new Set(selectedEndpoints);
    const filteredEndpoints = company.endpoints.filter((ep) => selectedEndpointSet.has(ep.protocolInformation.href));

    const grouped = groupEndpointsByType(filteredEndpoints);

    const connections = Array.from(grouped.entries()).map(([connectionType, urls]) => ({
        id: '',
        url: urls[0],
        types: [connectionType],
    }));

    return {
        id: '',
        name: company.name,
        logo: undefined,
        securityType: 'NONE',
        connections:
            connections.length > 0
                ? connections
                : [
                      {
                          id: '',
                          url: '',
                          types: [],
                      },
                  ],
    };
}

/**
 * Gets a summary of supported endpoints from a company
 * Returns a map of connection type to count
 */
export function getSupportedEndpointsSummary(company: Company): Map<string, number> {
    const summary = new Map<string, number>();

    company.endpoints.forEach((endpoint) => {
        const connectionType = mapEndpointInterfaceToConnectionType(endpoint.interface);
        if (connectionType) {
            summary.set(connectionType, (summary.get(connectionType) || 0) + 1);
        }
    });

    return summary;
}
