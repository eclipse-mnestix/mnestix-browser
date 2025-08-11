import { ConnectionType } from '@prisma/client';
import { DataSourceFormData } from 'lib/services/database/PrismaConnector';
import type { MappedInfrastructure } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

export interface IPrismaConnector {
    getConnectionData(): unknown;

    getInfrastructures(): unknown;

    upsertConnectionDataAction(formDataInput: DataSourceFormData[]): Promise<void>;

    upsertInfrastructureDataAction(infrastructureData: MappedInfrastructure): Promise<void>;

    getConnectionDataByTypeAction(type: ConnectionType): Promise<string[]>;

    deleteInfrastructureAction(infrastructureId: string): Promise<void>;
}
