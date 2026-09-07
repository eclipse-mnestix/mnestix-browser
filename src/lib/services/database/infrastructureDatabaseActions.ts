'use server';

import { ConnectionType } from '../../../../prisma/generated/client';
import logger from 'lib/util/Logger';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import { requireAdmin } from 'lib/util/securityHelpers/authGuard';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { envs } from 'lib/env/MnestixEnv';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { InfrastructureConnection, RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import {
    buildDefaultInfrastructure,
    DEFAULT_INFRASTRUCTURE_NAME,
    getInfrastructuresIncludingDefault,
} from 'lib/services/database/infrastructureData';

export async function getDefaultInfrastructureName() {
    return DEFAULT_INFRASTRUCTURE_NAME;
}

export async function getInfrastructuresAction() {
    await requireAdmin();
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getInfrastructures();
}

export async function getConnectionDataByTypeAction(type: ConnectionType): Promise<RepositoryWithInfrastructure[]> {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getConnectionDataByTypeAction(type);
}

export async function getDefaultInfrastructure(): Promise<InfrastructureConnection> {
    // Env-derived only; carries no database security secrets, so it is safe to expose as an action.
    return buildDefaultInfrastructure();
}

/**
 * UI-facing action returning only infrastructure names. Deliberately does NOT
 * return the full `InfrastructureConnection` shape, which includes encrypted
 * security configuration. Use this from client components instead of the
 * server-internal `getInfrastructuresIncludingDefault`.
 */
export async function getInfrastructureNamesAction(): Promise<string[]> {
    const infrastructures = await getInfrastructuresIncludingDefault();
    return infrastructures.map((infra) => infra.name);
}

export async function getAasRepositoriesIncludingDefault() {
    const defaultAasRepository = {
        id: 'default',
        url: envs.AAS_REPO_API_URL || '',
        infrastructureName: (await getDefaultInfrastructure()).name,
        isDefault: true,
    };
    try {
        const aasRepositoriesDb = await getConnectionDataByTypeAction(getTypeAction(ConnectionTypeEnum.AAS_REPOSITORY));

        return [defaultAasRepository, ...aasRepositoriesDb];
    } catch (error) {
        logger.error('Failed to fetch AAS repositories', error);
        return [];
    }
}

export async function getAasRegistriesIncludingDefault() {
    const defaultAasRegistry = {
        id: 'default',
        url: envs.REGISTRY_API_URL || '',
        infrastructureName: (await getDefaultInfrastructure()).name,
        isDefault: true,
    };
    try {
        const aasRegistriesDb = await getConnectionDataByTypeAction(getTypeAction(ConnectionTypeEnum.AAS_REGISTRY));

        return [defaultAasRegistry, ...aasRegistriesDb];
    } catch (error) {
        logger.error('Failed to fetch AAS registries', error);
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
    await requireAdmin();
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.createInfrastructure(infrastructureData);
}

export async function updateInfrastructureAction(infrastructureData: InfrastructureFormData) {
    await requireAdmin();
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.updateInfrastructure(infrastructureData);
}

export async function deleteInfrastructureAction(infrastructureId: string): Promise<void> {
    await requireAdmin();
    const connector = PrismaConnector.create();
    await connector.deleteInfrastructureAction(infrastructureId);
}
