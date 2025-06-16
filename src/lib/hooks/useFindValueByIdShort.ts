import { ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { findValueByIdShort } from 'lib/util/SubmodelResolverUtil';

/**
 * A hook that returns a function to find values in submodel elements by idShort
 * with the current locale automatically applied.
 * 
 * @returns A function to find values by idShort that includes the current locale
 */
export function useFindValueByIdShort() {
    const locale = useLocale();
    
    return useCallback(
        (
            elements: ISubmodelElement[] | null,
            idShort: string | null,
            semanticId: SubmodelSemanticIdEnum | SubmodelElementSemanticIdEnum | SubmodelSemanticIdEnum[] | SubmodelElementSemanticIdEnum[] | null = null,
        ): string | null => {
            if (semanticId && !Array.isArray(semanticId)) {
                return findValueByIdShort(elements, idShort, semanticId, locale);
            }
            else if (Array.isArray(semanticId)) {
                return semanticId.reduce((acc, id) => {
                    const value = findValueByIdShort(elements, idShort, id, locale);
                    return acc || value;
                }, null);
            }
            return findValueByIdShort(elements, idShort, null, locale);
        },
        [locale]
    );
}
