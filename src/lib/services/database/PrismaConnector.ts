import { prisma } from 'lib/database/prisma';
import { ConnectionType } from '@prisma/client';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { PrismaConnectorInMemory } from 'lib/services/database/PrismaConnectorInMemory';

export type DataSourceFormData = {
    id: string;
    url: string;
    type: string;
    aasSearcher?: string;
    image?: string;
};

export class PrismaConnector implements IPrismaConnector {
    private constructor() {}

    async getConnectionData() {
        return prisma?.mnestixConnection.findMany({ include: { type: true } });
    }

    async upsertConnectionDataAction(formDataInput: DataSourceFormData[]) {
        const existingData = await prisma?.mnestixConnection.findMany({ include: { type: true } });
        for (const existing of existingData) {
            const formData = formDataInput.find((value) => value.id === existing.id);
            // If an entry exists in the db and the updated data, update the existing db entry
            if (formData) {
                await prisma.mnestixConnection.update({
                    where: { id: existing.id },
                    data: {
                        url: formData.url,
                        aasSearcher: formData.aasSearcher,
                        image: formData.image,
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
                        url: updated.url,
                        typeId: type.id,
                        aasSearcher: updated.aasSearcher,
                        image: updated.image,
                    },
                });
            }
        }
    }

    async getConnectionDataByTypeAction(type: ConnectionType) {
        const basePath = await prisma?.mnestixConnection.findMany({
            where: {
                type: type,
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
