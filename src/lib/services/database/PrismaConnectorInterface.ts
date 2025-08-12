import { ConnectionType } from '@prisma/client';
import type {
    MappedInfrastructure,
    InfrastructureWithRelations,
} from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

export interface IPrismaConnector {
    /**
     * Retrieves all infrastructures with their related data
     */
    getInfrastructures(): Promise<InfrastructureWithRelations[]>;

    /**
     * Retrieves connection URLs by connection type
     */
    getConnectionDataByTypeAction(type: ConnectionType): Promise<string[]>;

    /**
     * Creates a new infrastructure
     */
    createInfrastructure(infrastructureData: MappedInfrastructure): Promise<{ id: string; name: string }>;

    /**
     * Updates an existing infrastructure
     */
    updateInfrastructure(infrastructureData: MappedInfrastructure): Promise<{ id: string; name: string }>;

    /**
     * Deletes an infrastructure by ID
     */
    deleteInfrastructureAction(infrastructureId: string): Promise<void>;
}
