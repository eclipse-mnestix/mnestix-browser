'use server';

import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { ConceptDescription } from 'lib/api/aas/models';
import { ConceptDescriptionApi } from 'lib/api/concept-description-api/conceptDescriptionApi';
import { getInfrastructureByName, getInfrastructuresIncludingDefault } from './database/connectionServerActions';
import { InfrastructureConnection } from './database/MappedTypes';
import logger, { logInfo, logResponseDebug } from 'lib/util/Logger';

/**
 * Retrieves a Concept Description by its identifier from one or more Concept Description repositories.
 *
 * Search behavior:
 * - If an infrastructure name is provided, queries only that infrastructure's Concept Description repositories.
 * - If omitted, discovers all infrastructures (including the default) and queries each repository in order until a match is found.
 *
 * Each repository lookup is attempted in sequence; failures for individual repositories are ignored and the search continues with the next repository. The first successful response is returned immediately.
 *
 * @param conceptDescriptionId - The identifier of the Concept Description to fetch.
 * @param infrastructureName - Optional infrastructure name to limit the search. When undefined, all known infrastructures are searched.
 * @returns A promise resolving to an ApiResponseWrapper<ConceptDescription>. On success, the wrapper has isSuccess=true and contains the Concept Description. If not found in any repository, resolves to an error wrapper with status ApiResultStatus.NOT_FOUND and a message listing the repositories checked.
 * @throws May throw if infrastructure discovery/lookup fails before repository queries can be attempted (e.g., failing to load infrastructures or an unknown infrastructure name).
 * @example
 * // Search across all infrastructures
 * const res = await getConceptDescriptionById("conceptDescriptionId");
 * if (res.isSuccess) {
 *   console.log(res.value);
 * }
 *
 * @example
 * // Search within a specific infrastructure
 * const res2 = await getConceptDescriptionById("conceptDescriptionId", "prod-infra");
 */
export async function getConceptDescriptionById(conceptDescriptionId: string, infrastructureName: string | undefined = undefined): Promise<ApiResponseWrapper<ConceptDescription>> {

    const conceptRepositoryUrls: Set<string> = new Set();
    if (infrastructureName === undefined) {
        const infrastructures: InfrastructureConnection[] = await getInfrastructuresIncludingDefault();
        for (const infra of infrastructures) {
            for (const url of infra.conceptDescriptionRepositoryUrls) {
                conceptRepositoryUrls.add(url);
            }
        }
    } else {
        const infrastructure = await getInfrastructureByName(infrastructureName);
        for (const url of infrastructure.conceptDescriptionRepositoryUrls) {
            conceptRepositoryUrls.add(url);
        }
    }

    if (conceptRepositoryUrls.size === 0) {
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, `No Concept Description repositories found for ${infrastructureName}`);
    }

    for (const url of conceptRepositoryUrls) {
        const conceptDescriptionApi = ConceptDescriptionApi.create(url, mnestixFetch());
        try {
            const response = await conceptDescriptionApi.getConceptDescriptionById(conceptDescriptionId); 
                if (response.isSuccess) {
                    return response;
                } else {
                    logResponseDebug(logger, 'getConceptDescriptionById', `Couldn't find Concept Description ${conceptDescriptionId} in ${url}`, response);
                }
        } catch (error) {
            logInfo(logger, 'getConceptDescriptionById', `Failed to fetch Concept Description from ${url}`, error);
        } 
    }
    return wrapErrorCode(ApiResultStatus.NOT_FOUND, `Couldn't find Concept Description in provided infrastructures: ${[...conceptRepositoryUrls].join(', ')}`);
}
