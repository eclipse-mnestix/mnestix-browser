import {
    DataTypeDefXsd,
    IAbstractLangString,
    IDataElement,
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { idEquals } from './IdValidationUtil';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticId } from 'lib/enums/SubmodelSemanticId.enum';
import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';

/**
 * Gets the translated text from either a MultiLanguageProperty or LangStringTextType array
 * @param element - The element containing translations (MultiLanguageProperty or LangStringTextType[])
 * @param locale - The locale to get the translation for
 * @returns The translated text for the given locale, falling back to the first available translation, or null
 */
export function getTranslationText(
    element: MultiLanguageProperty | IAbstractLangString[] | undefined,
    locale: string
): string {
    const langStrings = Array.isArray(element) ? element : element?.value;
    
    if (!langStrings?.length) {
        return '';
    }

    return langStrings.find(el => el.language === locale)?.text || langStrings[0]?.text;
}

export function getTranslationValue(element: IDataElement, locale: string): string | null {
    switch (getKeyType(element)) {
        case KeyTypes.MultiLanguageProperty:
            return getTranslationText(element as MultiLanguageProperty, locale);
        case KeyTypes.Property:
            return (element as Property).value ?? null;
        default:
            return null;
    }
}

export function findSubmodelElementByIdShort(
    elements: ISubmodelElement[] | null,
    idShort: string | null,
): ISubmodelElement | null {
    if (!elements) return null;
    for (const el of elements) {
        if (el.idShort == idShort) {
            return el;
        } else if (getKeyType(el) == KeyTypes.SubmodelElementCollection) {
            const innerElements = (el as SubmodelElementCollection).value;
            const foundElement = findSubmodelElementByIdShort(innerElements, idShort);
            if (foundElement) {
                return foundElement;
            }
        }
    }
    return null;
}

export function findValueByIdShort(
    elements: ISubmodelElement[] | null,
    idShort: string | null,
    locale: string,
): string | null {
    const element = findSubmodelElementByIdShort(elements, idShort);
    if (!element) return null;
    switch (getKeyType(element)) {
        case KeyTypes.MultiLanguageProperty:
            return getTranslationText(element as MultiLanguageProperty, locale);
        case KeyTypes.Property:
            return (element as Property).value ?? null;
        default:
            return null;
    }
}

export function getArrayFromString(v: string): Array<string> {
    // String should look like this: "(Value1|Value2|Value3)"
    const stripped = v.replace(/[()]/gm, '');
    return stripped.split('|');
}

export function hasSemanticId(el: Submodel | ISubmodelElement, ...semanticIds: string[]): boolean {
    for (const id of semanticIds) {
        if (el.semanticId?.keys?.some((key) => idEquals(key.value.trim(), id.trim()))) return true;
    }
    return false;
}

export function getValueType(submodelElement: ISubmodelElement): DataTypeDefXsd {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueType = (submodelElement as any).valueType;
    switch (valueType) {
        case 'xs:boolean':
            return DataTypeDefXsd.Boolean;
        case 'xs:date':
            return DataTypeDefXsd.Date;
        case 'xs:decimal':
            return DataTypeDefXsd.Decimal;
        case 'xs:long':
            return DataTypeDefXsd.Long;
        default:
            return DataTypeDefXsd.String;
    }
}

export function buildSubmodelElementPath(
    submodelElementPath: string | null | undefined,
    submodelElementIdShort: string | null,
): string {
    let newSubmodelElementPath = '';

    if (submodelElementPath) {
        newSubmodelElementPath = newSubmodelElementPath.concat(submodelElementPath, '.');
    }

    newSubmodelElementPath = newSubmodelElementPath.concat(submodelElementIdShort ?? '');
    return newSubmodelElementPath;
}

/**
 * Finds a specific type within a given `Submodel` based on the provided semantic ID or idShort.
 *
 * @param element - The `Submodel` object containing the submodel elements to search through.
 * @param semanticId - (Optional) The semantic ID to match against the `semanticId` of the submodel elements.
 * @param idShort - (Optional) The idShort to match against the `idShort` of the submodel elements.
 * @returns The first `SubmodelElementCollection` that matches the given semantic ID or idShort, or `null` if no match is found.
 */
export function findSubmodelElement<T>(element: Submodel, semanticId?: SubmodelElementSemanticId, idShort?: string): T {
    return (element.submodelElements?.find(
        (element) =>
            element.semanticId?.keys[0].value === semanticId ||
            element.idShort === idShort
    ) as T);
}

/**
 * Finds a submodel element of a specific type within a `SubmodelElementCollection` based on the provided semantic ID or idShort.
 *
 * @param element - The `SubmodelElementCollection` object containing the submodel elements to search through.
 * @param semanticId - (Optional) The semantic ID to match against the `semanticId` of the submodel elements.
 * @param idShort - (Optional) The idShort to match against the `idShort` of the submodel elements.
 * @returns The first submodel element of the specified type that matches the given semantic ID or idShort, or `null` if no match is found.
 */
export function findSubmodelProperty<T>(element: SubmodelElementCollection, semanticId?: SubmodelElementSemanticId, idShort?: string): T {
    return (element.value?.find(
        (element) =>
            element.semanticId?.keys[0].value === semanticId ||
            element.idShort === idShort
    ) as T);
}

/**
 * Finds a `Submodel` within a list of submodels based on the provided semantic ID or idShort.
 *
 * @param submodels - The array of `SubmodelOrIdReference` objects to search through.
 * @param semanticId - (Optional) The semantic ID to match against the `semanticId` of the submodels.
 * @param idShort - (Optional) The idShort to match against the `idShort` of the submodels.
 * @returns The first `Submodel` that matches the given semantic ID or idShort, or `null` if no match is found.
 */
export function findSubmodelByIdOrSemanticId(submodels: SubmodelOrIdReference[], semanticId?: SubmodelSemanticId, idShort?: string): Submodel | null {
    return submodels.find(
        (sm) =>
            sm.submodel?.semanticId?.keys[0].value === semanticId ||
            sm.submodel?.idShort === idShort
    )?.submodel ?? null;
}