import { Prisma } from '@prisma/client';

// TODO move this file to database/service folder
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

export type MappedInfrastructure = {
    id: string;
    name: string;
    logo?: string;
    securityType: string;
    connections: Array<{
        id: string;
        url: string;
        types: string[];
    }>;
    securityHeader?: {
        name: string;
        value: string;
    };
    securityProxy?: {
        value: string;
    };
};
