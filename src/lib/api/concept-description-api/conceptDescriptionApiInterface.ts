import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';

export interface IConceptDescriptionApi {
    getBasePath(): string;

    /**
     * Fetch a single concept description by its id.
     * @param conceptDescriptionId
     */
    getConceptDescriptionById(conceptDescriptionId: string): Promise<ApiResponseWrapper<ConceptDescription>>;
}
