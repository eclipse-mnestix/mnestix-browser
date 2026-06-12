/**
 * Type definitions for the Company Lookup API
 * Based on leo-discovery.admin-shell-io.com API specification
 */

export type CompanyEndpointProtocolInformation = {
    href: string;
    endpointProtocol: string;
    endpointProtocolVersion?: string[];
};

export type CompanyEndpoint = {
    protocolInformation: CompanyEndpointProtocolInformation;
    interface: string; // e.g., "AAS-REGISTRY-3.1", "AAS-DISCOVERY-3.0", "SUBMODEL-REPOSITORY-3.1"
};

export type Company = {
    name: string;
    domain: string;
    endpoints: CompanyEndpoint[];
};

export type CompanyLookupResponse = {
    result: Company[];
    paging_metadata: Record<string, unknown>;
};
