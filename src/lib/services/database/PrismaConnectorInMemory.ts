import { ConnectionType } from '@prisma/client';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { isEqual } from 'lodash';
import { InfrastructureWithRelations } from 'lib/services/database/MappedTypes';

export class PrismaConnectorInMemory implements IPrismaConnector {
    constructor(
        protected aasData: string[],
        protected submodelData: string[],
    ) {}

    getInfrastructures(): Promise<InfrastructureWithRelations[]> {
        throw new Error('Method not implemented.');
    }

    createInfrastructure(_infrastructureData: InfrastructureFormData): Promise<{ id: string; name: string }> {
        throw new Error('Method not implemented.');
    }

    updateInfrastructure(_infrastructureData: InfrastructureFormData): Promise<{ id: string; name: string }> {
        throw new Error('Method not implemented.');
    }

    deleteInfrastructureAction(_infrastructureId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getConnectionDataByTypeAction(type: ConnectionType): Promise<{ infrastructureName: string; url: string }[]> {
        if (isEqual(type, { id: '0', typeName: 'AAS_REPOSITORY' })) {
            return this.aasData.map((url) => ({ infrastructureName: 'AAS_REPOSITORY', url }));
        }
        if (isEqual(type, { id: '2', typeName: 'SUBMODEL_REPOSITORY' })) {
            return this.submodelData.map((url) => ({ infrastructureName: 'SUBMODEL_REPOSITORY', url }));
        }

        throw new Error('Method not implemented.');
    }
}
