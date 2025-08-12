import { prisma } from 'lib/database/prisma';
import { ConnectionType } from '@prisma/client';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { PrismaConnectorInMemory } from 'lib/services/database/PrismaConnectorInMemory';
import type { MappedInfrastructure } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

export type DataSourceFormData = {
    id: string;
    url: string;
    type: string;
};

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

    async getInfrastructureData() {
        return prisma?.mnestixInfrastructure.findMany({
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
            },
        });
    }

    async upsertConnectionDataAction(formDataInput: DataSourceFormData[]) {
        const existingData = await prisma.mnestixConnection.findMany({
            include: {
                types: {
                    include: { type: true },
                },
            },
        });

        for (const existing of existingData) {
            const formData = formDataInput.find((value) => value.id === existing.id);
            // If an entry exists in the db and the updated data, update the existing db entry
            if (formData) {
                const type = await prisma.connectionType.findFirst({ where: { typeName: formData.type } });
                if (!type) continue;

                await prisma.mnestixConnection.update({
                    where: { id: existing.id },
                    data: {
                        url: formData.url,
                        types: {
                            deleteMany: {},
                            create: [{ typeId: type.id }],
                        },
                    },
                });
                // If an entry exists in the db but NOT in the updated data, delete it from the db
            } else {
                await prisma.mnestixConnection.delete({ where: { id: existing.id } });
            }
        }
        // If an entry doesn't exist in the db but in the updated data, create it in the db
        for (const updated of formDataInput) {
            const formData = existingData.find((value) => value.id === updated.id);
            const type = await prisma.connectionType.findFirst({ where: { typeName: updated.type } });
            if (!formData && type) {
                await prisma.mnestixConnection.create({
                    data: {
                        id: updated.id,
                        url: updated.url,
                        infrastructureId: 'infrastructure1', // TODO MNES-273 replace with actual infrastructureId
                        types: {
                            create: [{ typeId: type.id }],
                        },
                    },
                });
            }
        }
    }

    async upsertInfrastructureDataAction(infrastructureData: MappedInfrastructure) {
        return await prisma.$transaction(async (tx) => {
            // Security Type finden oder erstellen
            const securityType = await tx.securityType.findFirst({
                where: { typeName: infrastructureData.securityType },
            });

            if (!securityType) {
                throw new Error(`Security type ${infrastructureData.securityType} not found`);
            }

            let infrastructure;

            // Unterscheide zwischen Create (leere ID) und Update (vorhandene ID)
            if (!infrastructureData.id || infrastructureData.id === '') {
                // Neue Infrastructure erstellen - Prisma generiert ID automatisch
                infrastructure = await tx.mnestixInfrastructure.create({
                    data: {
                        name: infrastructureData.name,
                        logo: infrastructureData.logo,
                        securityTypeId: securityType.id,
                    },
                });
            } else {
                // Bestehende Infrastructure aktualisieren
                infrastructure = await tx.mnestixInfrastructure.update({
                    where: { id: infrastructureData.id },
                    data: {
                        name: infrastructureData.name,
                        logo: infrastructureData.logo,
                        securityTypeId: securityType.id,
                    },
                });
            }

            // Bestehende Connections löschen (nur bei Update)
            if (infrastructureData.id && infrastructureData.id !== '') {
                const existingConnections = await tx.mnestixConnection.findMany({
                    where: { infrastructureId: infrastructure.id },
                    select: { id: true },
                });

                if (existingConnections.length > 0) {
                    const connectionIds = existingConnections.map((conn) => conn.id);

                    await tx.mnestixConnectionTypeRelation.deleteMany({
                        where: { connectionId: { in: connectionIds } },
                    });

                    await tx.mnestixConnection.deleteMany({
                        where: { infrastructureId: infrastructure.id },
                    });
                }
            }

            // Neue Connections erstellen
            for (const connection of infrastructureData.connections) {
                if (connection.url) {
                    // Nur Connections mit URL erstellen
                    const createdConnection = await tx.mnestixConnection.create({
                        data: {
                            // ID weglassen - Prisma generiert automatisch
                            url: connection.url,
                            infrastructureId: infrastructure.id,
                        },
                    });

                    for (const typeName of connection.types) {
                        const connectionType = await tx.connectionType.findFirst({
                            where: { typeName },
                        });

                        if (connectionType) {
                            await tx.mnestixConnectionTypeRelation.create({
                                data: {
                                    connectionId: createdConnection.id,
                                    typeId: connectionType.id,
                                },
                            });
                        }
                    }
                }
            }

            // Security Settings aktualisieren - bestehende löschen
            await tx.securitySettingsHeader.deleteMany({
                where: { infrastructureId: infrastructure.id },
            });

            await tx.securitySettingsProxy.deleteMany({
                where: { infrastructureId: infrastructure.id },
            });

            // Neue Security Settings erstellen
            if (infrastructureData.securityHeader) {
                await tx.securitySettingsHeader.create({
                    data: {
                        headerName: infrastructureData.securityHeader.name,
                        headerValue: infrastructureData.securityHeader.value,
                        infrastructureId: infrastructure.id,
                    },
                });
            }

            if (infrastructureData.securityProxy) {
                await tx.securitySettingsProxy.create({
                    data: {
                        headerValue: infrastructureData.securityProxy.value,
                        infrastructureId: infrastructure.id,
                    },
                });
            }
        });
    }

    async deleteInfrastructureAction(infrastructureId: string) {
        return await prisma.$transaction(async (tx) => {
            // Delete all connections and their type relations first
            const connections = await tx.mnestixConnection.findMany({
                where: { infrastructureId },
                select: { id: true },
            });

            for (const connection of connections) {
                await tx.mnestixConnectionTypeRelation.deleteMany({
                    where: { connectionId: connection.id },
                });
            }

            await tx.mnestixConnection.deleteMany({
                where: { infrastructureId },
            });

            // Delete security settings
            await tx.securitySettingsHeader.deleteMany({
                where: { infrastructureId },
            });

            await tx.securitySettingsProxy.deleteMany({
                where: { infrastructureId },
            });

            // Finally delete the infrastructure
            await tx.mnestixInfrastructure.delete({
                where: { id: infrastructureId },
            });
        });
    }

    async getConnectionDataByTypeAction(type: ConnectionType) {
        const basePath = await prisma.mnestixConnection.findMany({
            where: {
                types: {
                    some: {
                        typeId: type.id,
                    },
                },
            },
        });

        return basePath.map((item) => item.url);
    }

    static create() {
        return new PrismaConnector();
    }

    static createNull(aasUrls: string[], submodelUrls: string[]) {
        return new PrismaConnectorInMemory(aasUrls, submodelUrls);
    }
}
