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
