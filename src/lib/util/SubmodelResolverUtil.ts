import {
    DataTypeDefXsd,
    IAbstractLangString,
    ISubmodelElement,
    Submodel,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
    KeyTypes,
    IDataElement,
    Reference,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { idEquals } from './IdValidationUtil';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { MultiLanguageProperty as MultiLanguagePropertyAAS } from 'lib/api/aas/models';

/**
 * Gets the translated text from either a MultiLanguageProperty or LangStringTextType array
 * @param element - The element containing translations (MultiLanguageProperty or LangStringTextType[])
 * @param locale - The locale to get the translation for
 * @returns The translated text for the given locale, falling back to the first available translation, or null
 */
export function getTranslationText(
    element: MultiLanguageProperty | IAbstractLangString[] | undefined | MultiLanguagePropertyAAS,
    locale: string,
): string {
    const langStrings = Array.isArray(element) ? element : element?.value;
    if (!langStrings?.length) {
        return '';
    }

    return langStrings.find((el) => el.language === locale)?.text || langStrings[0]?.text;
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
    semanticId: string | null,
): ISubmodelElement | null {
    if (!elements) return null;
    for (const el of elements) {
        if (el.idShort == idShort || (el.semanticId?.keys[0] && el.semanticId?.keys[0].value) == semanticId) {
            return el;
        } else if (getKeyType(el) == KeyTypes.SubmodelElementCollection) {
            const innerElements = (el as SubmodelElementCollection).value;
            const foundElement = findSubmodelElementByIdShort(innerElements, idShort, semanticId);
            if (foundElement) {
                return foundElement;
            }
        }
    }
    return null;
}

export function findSubmodelElementBySemanticIdsOrIdShort(
    elements: ISubmodelElement[] | null,
    idShort: string | null,
    semanticIds: string[] | null,
): ISubmodelElement | null {
    if (!elements) return null;
    
    for (const el of elements) {
        const idShortMatches = idShort && el.idShort && 
            el.idShort.toLowerCase() === idShort.toLowerCase();
        const semanticIdMatches = semanticIds?.some((semId) => 
            idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim())
        );
        
        if (idShortMatches || semanticIdMatches) {
            return el;
        }
        
        if (getKeyType(el) == KeyTypes.SubmodelElementCollection) {
            const foundInCollection = findSubmodelElementBySemanticIdsOrIdShort(
                (el as SubmodelElementCollection).value,
                idShort,
                semanticIds,
            );
            if (foundInCollection) {
                return foundInCollection;
            }
        }
    }
    
    return null;
}

export function findAllSubmodelElementsBySemanticIdsOrIdShort(
    elements: ISubmodelElement[] | null,
    idShort: string | null,
    semanticIds: string[] | null,
): ISubmodelElement[] | null {
    if (!elements) return null;
    
    const matchingElements: ISubmodelElement[] = [];
    
    for (const el of elements) {
        const matchesIdShort = idShort && el.idShort && 
            el.idShort.toLowerCase() === idShort.toLowerCase();
        const matchesSemanticId = semanticIds?.some((semId) => 
            idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim())
        );
        
        if (matchesIdShort || matchesSemanticId) {
            matchingElements.push(el);
        }
        
        if (getKeyType(el) === KeyTypes.SubmodelElementCollection) {
            const nestedMatches = findAllSubmodelElementsBySemanticIdsOrIdShort(
                (el as SubmodelElementCollection).value,
                idShort,
                semanticIds,
            );
            if (nestedMatches) {
                matchingElements.push(...nestedMatches);
            }
        }
    }
    
    return matchingElements.length > 0 ? matchingElements : null;
}

/**
 * Finds all submodel elements by semantic IDs or idShort prefix
 * @param elements - The elements to search through
 * @param idShortPrefix - A prefix to match against idShort (case-insensitive)
 * @param semanticIds - Array of semantic IDs to match
 * @returns Array of matching submodel elements or null
 */
export function findAllSubmodelElementsBySemanticIdsOrIdShortPrefix(
    elements: ISubmodelElement[] | null,
    idShortPrefix: string | null,
    semanticIds: string[] | null,
): ISubmodelElement[] | null {
    if (!elements) return null;
    
    const matchingElements: ISubmodelElement[] = [];
    
    for (const el of elements) {
        const matchesIdShortPrefix = idShortPrefix && el.idShort && el.idShort.toLowerCase().startsWith(idShortPrefix.toLowerCase());
        const matchesSemanticId = semanticIds?.some((semId) => idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim()));
        
        if (matchesIdShortPrefix || matchesSemanticId) {
            matchingElements.push(el);
        }
        
        if (getKeyType(el) === KeyTypes.SubmodelElementCollection) {
            const nestedMatches = findAllSubmodelElementsBySemanticIdsOrIdShortPrefix(
                (el as SubmodelElementCollection).value,
                idShortPrefix,
                semanticIds,
            );
            if (nestedMatches) {
                matchingElements.push(...nestedMatches);
            }
        }
    }
    
    return matchingElements.length > 0 ? matchingElements : null;
}


export function findValueByIdShort(
    elements: ISubmodelElement[] | null,
    idShort: string | null,
    semanticId: string | null = null,
    locale: string,
): string | null {
    const element = findSubmodelElementByIdShort(elements, idShort, semanticId);
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
    submodelElementIdShort: string | null | undefined,
): string {
    let newSubmodelElementPath = '';

    if (submodelElementPath) {
        newSubmodelElementPath = newSubmodelElementPath.concat(submodelElementPath, '.');
    }

    newSubmodelElementPath = newSubmodelElementPath.concat(submodelElementIdShort ?? '');
    return newSubmodelElementPath;
}

/**
 * Finds a `Submodel` within a list of submodels based on the provided semantic ID or idShort.
 *
 * @param submodels - The array of `SubmodelOrIdReference` objects to search through.
 * @param semanticId - (Optional) The semantic ID to match against the `semanticId` of the submodels.
 * @param idShort - (Optional) The idShort to match against the `idShort` of the submodels.
 * @returns The first `Submodel` that matches the given semantic ID or idShort
 */
export function findSubmodelByIdOrSemanticId(
    submodels: SubmodelOrIdReference[],
    semanticId?: SubmodelSemanticIdEnum,
    idShort?: string,
): Submodel | undefined {
    return submodels.find(
        (sm) =>
            (sm.submodel?.semanticId?.keys?.length && sm.submodel?.semanticId?.keys[0].value === semanticId) ||
            sm.submodel?.idShort === idShort,
    )?.submodel;
}

export function checkIfSubmodelHasIdShortOrSemanticId(
    submodel: SubmodelOrIdReference,
    semanticId?: SubmodelSemanticIdEnum,
    idShort?: string,
): boolean {
    return (
        (submodel.submodel?.semanticId?.keys?.length && submodel.submodel?.semanticId?.keys[0].value === semanticId) ||
        submodel.submodel?.idShort === idShort
    );
}

/**
 * Finds the first semantic ID key in the given submodel semanticId that matches a key in the [visualization] map.
 *
 * @param semanticId - The reference object containing semantic ID keys to search.
 * @param map - The semanticIds map to check against the possible semanticIds
 *
 * @returns The string of the matching semanticId key as a key of `submodelCustomVisualizationMap`, or `undefined` if no match is found.
 */
export function findSemanticIdInMap<T extends Record<string, string | ((...args: unknown[]) => unknown)>>(
    semanticId: Reference | null | undefined,
    map: T,
): keyof T | undefined {
    // We have to use the idEquals function here to correctly handle IRDIs
    return Object.keys(map).find((mapKey) => semanticId?.keys?.some((id) => idEquals(id.value, mapKey))) as
        | keyof T
        | undefined;
}
