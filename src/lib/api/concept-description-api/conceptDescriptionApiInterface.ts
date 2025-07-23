import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ConceptDescription } from 'lib/api/aas/models';

export interface IConceptDescriptionApi {
    getBasePath(): string;

    /**
     * Fetch a single concept description by its id.
     * @param conceptDescriptionId
     */
    getConceptDescriptionById(conceptDescriptionId: string): Promise<ApiResponseWrapper<ConceptDescription>>;
}
