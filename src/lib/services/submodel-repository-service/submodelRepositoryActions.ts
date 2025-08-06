'use server';

import { Reference } from 'lib/api/aas/models';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import {
    SubmodelRepositoryService,
    SubmodelSearchResult,
} from 'lib/services/submodel-repository-service/SubmodelRepositoryService';

export async function performSubmodelFullSearch(
    submodelReference: Reference,
    submodelDescriptor?: SubmodelDescriptor,
): Promise<ApiResponseWrapper<SubmodelSearchResult>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'performSubmodelFullSearch', 'Requested SubmodelReference', {
        referenceId: submodelReference.keys,
    });
    const searcher = SubmodelRepositoryService.create(logger);
    return searcher.performSubmodelFullSearch(submodelReference, submodelDescriptor);
}
