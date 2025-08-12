import { ConnectionType } from '@prisma/client';
import type { MappedInfrastructure } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

export interface IPrismaConnector {
    getInfrastructures(): unknown;

    getConnectionDataByTypeAction(type: ConnectionType): Promise<string[]>;

    createInfrastructure(infrastructureData: MappedInfrastructure): Promise<unknown>;

    updateInfrastructure(infrastructureData: MappedInfrastructure): Promise<unknown>;

    deleteInfrastructureAction(infrastructureId: string): Promise<void>;
}
