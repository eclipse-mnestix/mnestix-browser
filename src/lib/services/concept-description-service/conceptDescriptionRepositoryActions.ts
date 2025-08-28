'use server';

import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ConceptDescription } from 'lib/api/aas/models';
import { ConceptDescriptionRepositoryService } from './ConceptDescriptionRepositoryService';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export async function getConceptDescriptionById(
    conceptDescriptionId: string,
    infrastructureName: string | undefined = undefined,
): Promise<ApiResponseWrapper<ConceptDescription>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getConceptDescriptionById.name, 'Requested Concept Description', {
        conceptDescriptionId: conceptDescriptionId,
        infrastructureName: infrastructureName,
    });
    if (infrastructureName == undefined) {
        return wrapErrorCode(
            ApiResultStatus.BAD_REQUEST,
            `No infrastructure name provided to catch ${conceptDescriptionId} from.`,
        );
    }
    const service = ConceptDescriptionRepositoryService.create();
    return service.getConceptDescriptionByIdFromInfrastructure(conceptDescriptionId, infrastructureName);
}
