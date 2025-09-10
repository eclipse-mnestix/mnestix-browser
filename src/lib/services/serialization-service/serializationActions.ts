'use server';

import { SerializationResult, SerializationService } from 'lib/services/serialization-service/SerializationService';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';

/**
 * Server action to serialize an AAS using a specific infrastructure's serialization endpoints
 */
export async function serializeAasFromInfrastructure(
    aasId: string | string[],
    submodelIds: string[],
    infrastructureName: string,
    includeConceptDescriptions = true,
    outputFormat: 'xml' | 'json' | 'aasx' = 'aasx',
): Promise<ApiResponseWrapper<SerializationResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'serializeAasFromInfrastructure', 'Requested AAS serialization from infrastructure', {
        aasId: aasId,
        infrastructureName,
        outputFormat,
    });

    const serializationService = SerializationService.create(logger);
    return serializationService.serializeAasFromInfrastructure(
        aasId,
        submodelIds,
        infrastructureName,
        includeConceptDescriptions,
        outputFormat,
    );
}
