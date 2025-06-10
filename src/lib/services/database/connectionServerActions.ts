'use server';

import { ConnectionType } from '@prisma/client';
import { DataSourceFormData, PrismaConnector } from 'lib/services/database/PrismaConnector';

export async function getConnectionDataAction() {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getConnectionData();
}

export async function upsertConnectionDataAction(formDataInput: DataSourceFormData[]) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.upsertConnectionDataAction(formDataInput);
}

export async function getConnectionDataByTypeAction(type: ConnectionType) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getConnectionDataByTypeAction(type);
}

export async function getRepositoryConfigurationGroupsAction() {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getRepositoryConfigurationGroups();
}

export async function getRepositoryConfigurationGroupByName(name: string) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getRepositoryConfigurationGroupByName(name);
}

export async function getRepositoryConfigurationByRepositoryUrlAction(repositoryUrl: string) {
    const prismaConnector = PrismaConnector.create();
    return prismaConnector.getRepositoryConfigurationByRepositoryUrl(repositoryUrl);
}