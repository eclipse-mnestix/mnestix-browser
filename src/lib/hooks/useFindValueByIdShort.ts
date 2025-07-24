import { SubmodelElementChoice } from 'lib/api/aas/models';
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
            elements: SubmodelElementChoice[] | null,
            idShort: string | null,
            semanticId: SubmodelSemanticIdEnum | SubmodelElementSemanticIdEnum | null = null,
        ): string | null => {
            return findValueByIdShort(elements, idShort, semanticId, locale);
        },
        [locale],
    );
}
