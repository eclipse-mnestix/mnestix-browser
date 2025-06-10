import { IPrismaConnector } from 'lib/services/database/PrismaConnectorInterface';
import { DataSourceFormData } from 'lib/services/database/PrismaConnector';
import { isEqual } from 'lodash';
import { MnestixConnection } from '@prisma/client';

export class PrismaConnectorInMemory implements IPrismaConnector {
    constructor(
        protected aasData: string[],
        protected submodelData: string[],
    ) {}
    getRepositoryConfigurationGroupByName(_name: string): Promise<MnestixConnection | null> {
        throw new Error('Method not implemented.');
    }

    getRepositoryConfigurationGroups(): Promise<MnestixConnection[]> {
        throw new Error('Method not implemented.');
    }

    getConnectionData(): Promise<
        { type: { id: string; typeName: string } } & {
            id: string;
            url: string;
            typeId: string;
        }
    > {
        throw new Error('Method not implemented.');
    }

    upsertConnectionDataAction(_formDataInput: DataSourceFormData[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getConnectionDataByTypeAction(type: { id: string; typeName: string }): Promise<string[]> {
        if (isEqual(type, { id: '0', typeName: 'AAS_REPOSITORY' })) return this.aasData;
        if (isEqual(type, { id: '2', typeName: 'SUBMODEL_REPOSITORY' })) return this.submodelData;

        throw new Error('Method not implemented.');
    }
}
