import { ConnectionType } from '@prisma/client';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';
import { InfrastructureWithRelations } from 'lib/services/database/MappedTypes';

export interface IPrismaConnector {
    /**
     * Retrieves all infrastructures with their related data
     */
    getInfrastructures(): Promise<InfrastructureWithRelations[]>;

    /**
     * Retrieves connection URLs by connection type
     */
    getConnectionDataByTypeAction(type: ConnectionType): Promise<{ infrastructureName: string; url: string }[]>;

    /**
     * Creates a new infrastructure
     */
    createInfrastructure(infrastructureData: InfrastructureFormData): Promise<{ id: string; name: string }>;

    /**
     * Updates an existing infrastructure
     */
    updateInfrastructure(infrastructureData: InfrastructureFormData): Promise<{ id: string; name: string }>;

    /**
     * Deletes an infrastructure by ID
     */
    deleteInfrastructureAction(infrastructureId: string): Promise<void>;
}
