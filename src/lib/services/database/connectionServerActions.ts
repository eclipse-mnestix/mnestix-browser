'use server';

import { ConnectionType } from '@prisma/client';
import { DataSourceFormData, PrismaConnector } from 'lib/services/database/PrismaConnector';
import type { MappedInfrastructure } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { InfrastructureConnection } from 'lib/services/infrastructure-search-service/InfrastructureSearchService';

export async function getInfrastructuresAction() {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getInfrastructures();
}

export async function upsertConnectionDataAction(formDataInput: DataSourceFormData[]) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.upsertConnectionDataAction(formDataInput);
}

export async function upsertInfrastructureDataAction(infrastructureData: MappedInfrastructure) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.upsertInfrastructureDataAction(infrastructureData);
}

export async function getConnectionDataByTypeAction(type: ConnectionType) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getConnectionDataByTypeAction(type);
}

export async function deleteInfrastructureAction(infrastructureId: string): Promise<void> {
    const connector = PrismaConnector.create();
    await connector.deleteInfrastructureAction(infrastructureId);
}

export async function fetchAllInfrastructureConnectionsFromDb(): Promise<InfrastructureConnection[]> {
    const connector = PrismaConnector.create();
    const infrastructures = await connector.getInfrastructureData();

    if (!infrastructures) return [];

    return infrastructures.map((infra) => ({
        name: infra.name,
        discoveryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'DISCOVERY_SERVICE').map(() => conn.url),
        ),
        aasRegistryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'AAS_REGISTRY').map(() => conn.url),
        ),
        aasRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'AAS_REPOSITORY').map(() => conn.url),
        ),
    }));
}
