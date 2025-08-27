'use server';

import { ConnectionType } from '@prisma/client';
import logger from 'lib/util/Logger';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { envs } from 'lib/env/MnestixEnv';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import {
    InfrastructureConnection,
    InfrastructureWithRelations,
    RepositoryWithInfrastructure,
} from 'lib/services/database/InfrastructureMappedTypes';

export async function getInfrastructuresAction() {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getInfrastructures();
}

export async function getConnectionDataByTypeAction(type: ConnectionType): Promise<RepositoryWithInfrastructure[]> {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getConnectionDataByTypeAction(type);
}

export async function getInfrastructureByUrl(url: string) {
    const prismaConnector = PrismaConnector.create();
    const infrastructure = await prismaConnector.getInfrastructureByUrl(url);

    if (!infrastructure) return null;

    return infrastructureMapper(infrastructure);
}

export async function fetchAllInfrastructureConnectionsFromDb(): Promise<InfrastructureConnection[]> {
    const connector = PrismaConnector.create();
    const infrastructures = await connector.getInfrastructures();

    if (!infrastructures) return [];

    return infrastructures.map((infra) => infrastructureMapper(infra));
}

export async function getDefaultInfrastructure(): Promise<InfrastructureConnection> {
    return {
        name: 'Default Infrastructure',
        discoveryUrls: envs.DISCOVERY_API_URL ? [envs.DISCOVERY_API_URL] : [],
        aasRegistryUrls: envs.REGISTRY_API_URL ? [envs.REGISTRY_API_URL] : [],
        aasRepositoryUrls: envs.AAS_REPO_API_URL ? [envs.AAS_REPO_API_URL] : [],
        submodelRepositoryUrls: envs.SUBMODEL_REPO_API_URL ? [envs.SUBMODEL_REPO_API_URL] : [],
        submodelRegistryUrls: envs.SUBMODEL_REGISTRY_API_URL ? [envs.SUBMODEL_REGISTRY_API_URL] : [],
        conceptDescriptionRepositoryUrls: envs.CONCEPT_DESCRIPTION_REPO_API_URL
            ? [envs.CONCEPT_DESCRIPTION_REPO_API_URL]
            : [],
        isDefault: true,
    };
}

export async function getInfrastructuresIncludingDefault() {
    // build default infrastructure from envs
    const defaultInfrastructure = await getDefaultInfrastructure();

    // get from database as flat connection list
    const infrastructures = await fetchAllInfrastructureConnectionsFromDb();

    return [defaultInfrastructure, ...infrastructures];
}

export async function getInfrastructureByName(name: string): Promise<InfrastructureConnection | undefined> {
    const infrastructures = await getInfrastructuresIncludingDefault();
    const found_infrastructure = infrastructures.find((infra) => infra.name === name);
    if (!found_infrastructure) {
        return undefined;
    }
    return found_infrastructure;
}

export async function getAasRepositoriesIncludingDefault() {
    const defaultAasRepository = {
        id: 'default',
        url: envs.AAS_REPO_API_URL || '',
        infrastructureName: (await getDefaultInfrastructure()).name,
    };
    try {
        const aasRepositoriesDb = await getConnectionDataByTypeAction(getTypeAction(ConnectionTypeEnum.AAS_REPOSITORY));

        return [defaultAasRepository, ...aasRepositoriesDb];
    } catch (error) {
        logger.error('Failed to fetch AAS repositories', error);
        return [];
    }
}

export async function getSubmodelRepositoriesIncludingDefault() {
    const submodelRepositoriesDb = await getConnectionDataByTypeAction(
        getTypeAction(ConnectionTypeEnum.SUBMODEL_REPOSITORY),
    );
    const defaultSubmodelRepository = {
        id: 'default',
        url: envs.SUBMODEL_REGISTRY_API_URL || '',
        infrastructureName: (await getDefaultInfrastructure()).name,
    };

    return [defaultSubmodelRepository, ...submodelRepositoriesDb];
}

export async function createInfrastructureAction(infrastructureData: InfrastructureFormData) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.createInfrastructure(infrastructureData);
}

export async function updateInfrastructureAction(infrastructureData: InfrastructureFormData) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.updateInfrastructure(infrastructureData);
}

export async function deleteInfrastructureAction(infrastructureId: string): Promise<void> {
    const connector = PrismaConnector.create();
    await connector.deleteInfrastructureAction(infrastructureId);
}

function infrastructureMapper(infra: InfrastructureWithRelations): InfrastructureConnection {
    return {
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
        submodelRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'SUBMODEL_REPOSITORY').map(() => conn.url),
        ),
        submodelRegistryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'SUBMODEL_REGISTRY').map(() => conn.url),
        ),
        conceptDescriptionRepositoryUrls: infra.connections.flatMap((conn) =>
            conn.types.filter((t) => t.type.typeName === 'CONCEPT_DESCRIPTION').map(() => conn.url),
        ),
        isDefault: false,
        infrastructureSecurity: {
            securityType: infra.securityType?.typeName,
            securityHeader: {
                name: infra.securitySettingsHeaders?.headerName,
                value: infra.securitySettingsHeaders?.headerValue,
                iv: infra.securitySettingsHeaders?.iv,
                authTag: infra.securitySettingsHeaders?.authTag,
            },
            securityProxy: {
                value: infra.securitySettingsProxies?.headerValue,
                iv: infra.securitySettingsProxies?.iv,
                authTag: infra.securitySettingsProxies?.authTag,
            },
        },
    };
}
