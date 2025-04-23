'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { envs } from 'lib/env/MnestixEnv';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { ConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApi';

const conceptDescriptionApi = ConceptDescriptionApi.create(
    envs.AAS_REPO_API_URL ?? '',
    mnestixFetch(),
);

export async function getConceptDescriptionById(submodelId: string): Promise<ApiResponseWrapper<ConceptDescription>> {
    if (envs.AAS_REPO_API_URL === undefined) {
        return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Concept Description API URL is not defined');
    }

    return conceptDescriptionApi.getConceptDescriptionById(submodelId);
}
