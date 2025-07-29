import {
    ConceptDescription,
    DataSpecificationIec61360,
    LangStringPreferredNameTypeIec61360,
    SubmodelElementChoice,
} from 'lib/api/aas/models';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { useLocale } from 'next-intl';

/**
 * The Standardized way to get the best label for a submodel element as defined by the IDTA.
 * The order of preference is: submodelElement.displayName, conceptDescription.preferredName, conceptDescription.shortName, submodelElement.idShort.
 */
export const useBestLabelForSmElement = (
    submodelElement: SubmodelElementChoice,
    conceptDescription?: ConceptDescription,
) => {
    const locale = useLocale();

    if (submodelElement.displayName) {
        const langString = submodelElement.displayName;
        return getTranslationText(langString, locale);
    }

    if (conceptDescription?.embeddedDataSpecifications?.[0].dataSpecificationContent) {
        const iec61360Content = getDataSpecContentFromConceptDescription(conceptDescription);
        let langString: Array<LangStringPreferredNameTypeIec61360> = [];

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
        return conceptDescription.embeddedDataSpecifications[0].dataSpecificationContent;
    }
    return null;
};

/**
 * Determine which unit from the concept description should be displayed.
 * @param conceptDescription
 */
export const getUnitFromConceptDescription = (conceptDescription: ConceptDescription) => {
    const dataSpecContent = getDataSpecContentFromConceptDescription(conceptDescription);
    if (dataSpecContent) {
        if (dataSpecContent.symbol) {
            return dataSpecContent.symbol;
        }
        if (dataSpecContent.unit) {
            return dataSpecContent.unit;
        }
    }
    return '';
};
