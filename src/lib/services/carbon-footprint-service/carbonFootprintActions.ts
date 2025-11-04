'use server';

import { headers } from 'next/headers';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import { getInfrastructureByName } from 'lib/services/database/infrastructureDatabaseActions';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { Property } from 'lib/api/aas/models';

export type CarbonFootprintCO2Update = {
    stage: string;
    value: number;
    idShortPath: string;
    existingProperty: Property; // Die komplette bestehende Property
};

/**
 * Updates CO2 values for Carbon Footprint lifecycle stages in a submodel.
 * @param submodelId The unique identifier of the submodel
 * @param updates Array of updates with stage, value, idShortPath and existing property
 * @param repository Repository with infrastructure information
 */
export async function updateCarbonFootprintCO2Values(
    submodelId: string,
    updates: CarbonFootprintCO2Update[],
    repository: RepositoryWithInfrastructure,
): Promise<ApiResponseWrapper<{ success: boolean; updatedStages: string[] }>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, updateCarbonFootprintCO2Values.name, 'Updating Carbon Footprint CO2 values', {
        submodelId: submodelId,
        stages: updates.map((u) => u.stage),
    });

    const infrastructure = await getInfrastructureByName(repository.infrastructureName);
    const securityHeader = await createSecurityHeaders(infrastructure);
    const submodelApi = SubmodelRepositoryApi.create(repository.url, mnestixFetch(securityHeader));

    try {
        const updatedStages: string[] = [];
        const errors: string[] = [];

        for (const update of updates) {
            // Take the existing property and only update the value
            const updatedProperty: Property = {
                ...update.existingProperty,
                value: update.value.toString(),
            };

            // Use PUT to update the property
            const updateResult = await submodelApi.putSubmodelElementByPath(
                submodelId,
                update.idShortPath,
                updatedProperty,
            );

            if (!updateResult.isSuccess) {
                errors.push(`Failed to update stage ${update.stage}: ${updateResult.message}`);
            } else {
                updatedStages.push(update.stage);
            }
        }

        if (errors.length > 0 && updatedStages.length === 0) {
            return wrapErrorCode('UNKNOWN_ERROR' as any, errors.join('; '));
        }

        return wrapSuccess({
            success: true,
            updatedStages,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logInfo(logger, updateCarbonFootprintCO2Values.name, 'Error updating Carbon Footprint', {
            error: errorMessage,
        });
        return wrapErrorCode('UNKNOWN_ERROR' as any, `Error updating Carbon Footprint: ${errorMessage}`);
    }
}
