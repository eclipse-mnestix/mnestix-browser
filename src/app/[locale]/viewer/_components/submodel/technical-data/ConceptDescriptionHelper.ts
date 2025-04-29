import { ConceptDescription, DataSpecificationIec61360 } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import {
    IAbstractLangString,
    ISubmodelElement,
    MultiLanguageProperty,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { useLocale } from 'next-intl';

/**
 * The Standardized way to get the best label for a submodel element as defined by the IDTA.
 * The order of preference is: submodelElement.displayName, conceptDescription.preferredName, conceptDescription.shortName, submodelElement.idShort.
 */
export const useBestLabelForSmElement = (
    submodelElement: ISubmodelElement,
    conceptDescription?: ConceptDescription,
) => {
    const locale = useLocale();

    if (submodelElement.displayName) {
        const langString = submodelElement.displayName;
        return getTranslationText(langString, locale);
    }

    if (conceptDescription?.embeddedDataSpecifications?.[0].dataSpecificationContent) {
        const iec61360Content = getDataSpecContentFromConceptDescription(conceptDescription);
        let langString: MultiLanguageProperty | IAbstractLangString[] | undefined = [];

        if (iec61360Content && iec61360Content.preferredName) {
            langString = iec61360Content.preferredName;
        } else if (iec61360Content && iec61360Content.shortName) {
            langString = iec61360Content.shortName;
        }
        const translatedString = getTranslationText(langString, locale);
        if (translatedString.trim()) {
            return translatedString;
        }
    }

    if (submodelElement.idShort) {
        return submodelElement.idShort;
    }
    return 'Not available';
};

export const getDataSpecContentFromConceptDescription = (
    conceptDescription: ConceptDescription,
): DataSpecificationIec61360 | null => {
    if (conceptDescription?.embeddedDataSpecifications?.[0]?.dataSpecificationContent) {
        const dataSpecContent = conceptDescription.embeddedDataSpecifications[0].dataSpecificationContent;
        if (isDataSpecificationIec61360(dataSpecContent)) {
            return dataSpecContent;
        }
    }
    return null;
};

/**
 * Type guard to check if the content is a DataSpecificationIec61360.
 */
const isDataSpecificationIec61360 = (content: unknown): content is DataSpecificationIec61360 => {
    return (
        typeof content === 'object' &&
        content !== null &&
        ('preferredName' in content || 'shortName' in content || 'unit' in content)
    );
};

export const getUnitFromConceptDecription = (conceptDescription: ConceptDescription) => {
    const dataSpecContent = getDataSpecContentFromConceptDescription(conceptDescription);
    if (dataSpecContent) {
        return dataSpecContent.unit;
    }
    return '';
};
