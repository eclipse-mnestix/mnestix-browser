'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ConceptDescription } from 'lib/api/aas/models';
import { ConceptDescriptionRepositoryService } from './ConceptDescriptionRepositoryService';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';


export async function getConceptDescriptionById(conceptDescriptionId: string, infrastructureName: string | undefined = undefined): Promise<ApiResponseWrapper<ConceptDescription>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, getConceptDescriptionById.name, 'Requested Concept Description', {
        conceptDescriptionId: conceptDescriptionId,
        infrastructureName: infrastructureName,
    });
    const service = ConceptDescriptionRepositoryService.create();
    return service.getConceptDescriptionByIdFromRepositories(conceptDescriptionId, infrastructureName);
}
