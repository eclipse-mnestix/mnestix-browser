/**
 * Types and Enums for handling database entities.
 */

export type RepositoryWithInfrastructure = {
    id: string;
    infrastructureName: string;
    url: string;
};
export type InfrastructureConnection = {
    name: string;
    discoveryUrls: string[];
    aasRegistryUrls: string[];
    aasRepositoryUrls: string[];
    submodelRepositoryUrls: string[];
    submodelRegistryUrls: string[];
    infrastructureSecurity?: InfrastructureSecurity;
};

export type InfrastructureSecurity = {
    securityType?: string;
    securityHeader?: {
        name: string;
        value: string;
    };
    securityProxy?: {
        value: string;
    };
};
