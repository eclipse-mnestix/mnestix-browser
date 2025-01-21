import {
    DataTypeDefXsd,
    IAbstractLangString,
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { IntlShape } from 'react-intl';
import { idEquals } from './IdValidationUtil';
import { getKeyType } from 'lib/util/KeyTypeUtil';

export function getTranslationTextNext(element: MultiLanguageProperty, locale: string) {
    const value = element.value?.find((el) => el.language == locale)?.text;
    return value || element.value?.at(0)?.text || null;
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

export function findValueByIdShort(elements: ISubmodelElement[] | null, idShort: string | null, locale: string) {
    const element = findSubmodelElementByIdShort(elements, idShort);
    switch (!element || getKeyType(element)) {
        case KeyTypes.MultiLanguageProperty:
            return getTranslationTextNext(element as MultiLanguageProperty, locale);
        case KeyTypes.Property:
            return (element as Property).value;
        default:
            return null;
    }
}

export function getTranslationText(
    input: MultiLanguageProperty | IAbstractLangString[] | undefined,
    intl: IntlShape,
): string {
    const userLang = intl.locale || intl.defaultLocale;
    let langStrings: IAbstractLangString[] | undefined;

    const mLangProp = input as MultiLanguageProperty;
    if (Array.isArray(input)) {
        langStrings = input as IAbstractLangString[];
    } else {
        langStrings = (mLangProp.value as IAbstractLangString[]) ?? [];
    }
    // reduce array to object (e.g. {en: 'some string'} )
    const reducedStrings = langStrings?.reduce((el, obj) => {
        if (obj.language && obj.text) {
            el[obj.language] = obj.text;
        }
        return el;
    }, {});

    return (
        reducedStrings[userLang] ||
        // Fallback to first translation
        reducedStrings[Object.keys(reducedStrings)[0]]
    );
}

export function getArrayFromString(v: string): Array<string> {
    // String should look like this: "(Value1|Value2|Value3)"
    const stripped = v.replace(/[()]/gm, '');
    return stripped.split('|');
}

export function hasSemanticId(el: Submodel | ISubmodelElement, ...semanticIds: string[]) {
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
