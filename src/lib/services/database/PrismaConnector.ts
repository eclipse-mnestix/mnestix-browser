import { prisma } from 'lib/database/prisma';
import { ConnectionType, Prisma } from '@prisma/client';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { PrismaConnectorInMemory } from 'lib/services/database/PrismaConnectorInMemory';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import { validateHeaderKey, validateHeaderValue } from 'lib/util/securityHelpers/ValidateSecurityInput';
import { encryptSecret } from 'lib/util/securityHelpers/Encryption';

export type DataSourceFormData = {
    id: string;
    url: string;
    type: string;
};

type PrismaTransaction = Prisma.TransactionClient;

export class PrismaConnector implements IPrismaConnector {
    private constructor() {}

    async getInfrastructures() {
        return prisma.mnestixInfrastructure.findMany({
            include: {
                connections: {
                    include: {
                        types: {
                            include: {
                                type: true,
                            },
                        },
                    },
                },
                securityType: true,
                securitySettingsHeaders: true,
                securitySettingsProxies: true,
            },
        });
    }

    async getInfrastructureByUrl(url: string) {
        return await prisma.mnestixInfrastructure.findFirst({
            where: {
                connections: {
                    some: {
                        url: url,
                    },
                },
            },
            include: {
                connections: {
                    include: {
                        types: {
                            include: {
                                type: true,
                            },
                        },
                    },
                },
                securityType: true,
                securitySettingsHeaders: true,
                securitySettingsProxies: true,
            },
        });
    }

    async createInfrastructure(infrastructureData: InfrastructureFormData) {
        return await prisma.$transaction(async (tx) => {
            const securityType = await this.findSecurityType(tx, infrastructureData.securityType);

            const infrastructure = await tx.mnestixInfrastructure.create({
                data: {
                    name: infrastructureData.name,
                    logo: infrastructureData.logo,
                    securityTypeId: securityType.id,
                },
            });

            await this.createConnections(tx, infrastructure.id, infrastructureData.connections);
            await this.createSecuritySettings(tx, infrastructure.id, infrastructureData);

            return infrastructure;
        });
    }

    async updateInfrastructure(infrastructureData: InfrastructureFormData) {
        if (!infrastructureData.id) {
            throw new Error('Infrastructure ID is required for update');
        }

        return await prisma.$transaction(async (tx) => {
            const securityType = await this.findSecurityType(tx, infrastructureData.securityType);

            const infrastructure = await tx.mnestixInfrastructure.update({
                where: { id: infrastructureData.id },
                data: {
                    name: infrastructureData.name,
                    logo: infrastructureData.logo,
                    securityTypeId: securityType.id,
                },
            });

            await this.deleteExistingConnections(tx, infrastructure.id);
            await this.deleteExistingSecuritySettings(tx, infrastructure.id);
            await this.createConnections(tx, infrastructure.id, infrastructureData.connections);
            await this.createSecuritySettings(tx, infrastructure.id, infrastructureData);

            return infrastructure;
        });
    }

    async deleteInfrastructureAction(infrastructureId: string) {
        return await prisma.$transaction(async (tx) => {
            await this.deleteExistingConnections(tx, infrastructureId);
            await this.deleteExistingSecuritySettings(tx, infrastructureId);

            await tx.mnestixInfrastructure.delete({
                where: { id: infrastructureId },
            });
        });
    }

    async getConnectionDataByTypeAction(type: ConnectionType): Promise<RepositoryWithInfrastructure[]> {
        const connections = await prisma.mnestixConnection.findMany({
            where: {
                types: {
                    some: {
                        typeId: type.id,
                    },
                },
            },
            include: {
                infrastructure: true,
            },
        });

        return connections.map((item) => ({
            id: item.id,
            infrastructureName: item.infrastructure?.name ?? '',
            url: item.url,
        }));
    }

    static create() {
        return new PrismaConnector();
    }

    static createNull(aasUrls: string[], submodelUrls: string[]) {
        return new PrismaConnectorInMemory(aasUrls, submodelUrls);
    }

    /**
     * Helper functions
     */
    private async findSecurityType(tx: PrismaTransaction, typeName: string) {
        const securityType = await tx.securityType.findFirst({
            where: { typeName },
        });

        if (!securityType) {
            throw new Error(`Security type ${typeName} not found`);
        }

        return securityType;
    }

    private async createConnections(
        tx: PrismaTransaction,
        infrastructureId: string,
        connections: InfrastructureFormData['connections'],
    ) {
        for (const connection of connections) {
            if (connection.url) {
                const createdConnection = await tx.mnestixConnection.create({
                    data: {
                        url: connection.url,
                        infrastructureId,
                    },
                });

                await this.linkConnectionTypes(tx, createdConnection.id, connection.types);
            }
        }
    }

    private async linkConnectionTypes(tx: PrismaTransaction, connectionId: string, typeNames: string[]) {
        for (const typeName of typeNames) {
            const connectionType = await tx.connectionType.findFirst({
                where: { typeName },
            });

            if (connectionType) {
                await tx.mnestixConnectionTypeRelation.create({
                    data: {
                        connectionId,
                        typeId: connectionType.id,
                    },
                });
            }
        }
    }

    private async createSecuritySettings(
        tx: PrismaTransaction,
        infrastructureId: string,
        infrastructureData: InfrastructureFormData,
    ) {
        if (infrastructureData.securityHeader) {
            // validate Header Key and Value on the server side.
            const keyValidation = validateHeaderKey(infrastructureData.securityHeader.name);
            if (!keyValidation.isValid) {
                throw new Error(`Invalid header key: ${keyValidation.errorKey}`);
            }

            const valueValidation = validateHeaderValue(infrastructureData.securityHeader.value);
            if (!valueValidation.isValid) {
                throw new Error(`Invalid header value: ${valueValidation.errorKey}`);
            }

            const encryptedSecret = encryptSecret(infrastructureData.securityHeader.value);

            await tx.securitySettingsHeader.create({
                data: {
                    headerName: infrastructureData.securityHeader.name,
                    headerValue: encryptedSecret.cipherTextB64,
                    iv: encryptedSecret.ivB64,
                    authTag: encryptedSecret.authTagB64,
                    infrastructureId,
                },
            });
        }

        if (infrastructureData.securityProxy) {
            // validate Header Value on the server side.
            const proxyValueValidation = validateHeaderValue(infrastructureData.securityProxy.value);
            if (!proxyValueValidation.isValid) {
                throw new Error(`Invalid proxy header value: ${proxyValueValidation.errorKey}`);
            }

            const encryptedSecret = encryptSecret(infrastructureData.securityProxy.value);

            await tx.securitySettingsProxy.create({
                data: {
                    headerValue: encryptedSecret.cipherTextB64,
                    iv: encryptedSecret.ivB64,
                    authTag: encryptedSecret.authTagB64,
                    infrastructureId,
                },
            });
        }
    }

    private async deleteExistingConnections(tx: PrismaTransaction, infrastructureId: string) {
        const existingConnections = await tx.mnestixConnection.findMany({
            where: { infrastructureId },
            select: { id: true },
        });

        if (existingConnections.length > 0) {
            const connectionIds = existingConnections.map((conn) => conn.id);

            await tx.mnestixConnectionTypeRelation.deleteMany({
                where: { connectionId: { in: connectionIds } },
            });

            await tx.mnestixConnection.deleteMany({
                where: { infrastructureId },
            });
        }
    }

    private async deleteExistingSecuritySettings(tx: PrismaTransaction, infrastructureId: string) {
        await tx.securitySettingsHeader.deleteMany({
            where: { infrastructureId },
        });

        await tx.securitySettingsProxy.deleteMany({
            where: { infrastructureId },
        });
    }
}
