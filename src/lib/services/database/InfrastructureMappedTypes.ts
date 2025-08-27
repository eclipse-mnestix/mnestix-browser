/**
 * Types and Enums for handling database entities.
 */
import { Prisma } from '@prisma/client';

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
    conceptDescriptionRepositoryUrls: string[];
    isDefault: boolean;
    infrastructureSecurity?: InfrastructureSecurity;
};

export type InfrastructureSecurity = {
    securityType?: string;
    securityHeader?: {
        name?: string;
        value?: string;
        iv?: string;
        authTag?: string;
    };
    securityProxy?: {
        value?: string;
        iv?: string;
        authTag?: string;
    };
};

export type InfrastructureWithRelations = Prisma.MnestixInfrastructureGetPayload<{
    include: {
        connections: {
            include: {
                types: {
                    include: {
                        type: true;
                    };
                };
            };
        };
        securityType: true;
        securitySettingsHeaders: true;
        securitySettingsProxies: true;
    };
}>;
