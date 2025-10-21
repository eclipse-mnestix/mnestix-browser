import {
    DataTypeDefXsd,
    AbstractLangString,
    SubmodelElementChoice,
    Submodel,
    MultiLanguageProperty,
    KeyTypes,
    DataElementChoice,
    Reference,
    Key,
} from 'lib/api/aas/models';
import { idEquals } from './IdValidationUtil';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';

/**
 * Gets the translated text from either a MultiLanguageProperty or LangStringTextType array
 * @param element - The element containing translations (MultiLanguageProperty or LangStringTextType[])
 * @param locale - The locale to get the translation for
 * @returns The translated text for the given locale, falling back to the first available translation, or null
 */
export function getTranslationText(
    element: MultiLanguageProperty | AbstractLangString[] | undefined | null,
    locale: string,
): string {
    const langStrings = Array.isArray(element) ? element : element?.value;
    if (!langStrings?.length) {
        return '';
    }

    return langStrings.find((el) => el.language === locale)?.text || langStrings[0]?.text;
}

export function getTranslationValue(element: DataElementChoice, locale: string): string | null {
    switch (element.modelType) {
        case KeyTypes.MultiLanguageProperty:
            return getTranslationText(element, locale);
        case KeyTypes.Property:
            return element.value ?? null;
        default:
            return null;
    }
}

export function findSubmodelElementByIdShort(
    elements: SubmodelElementChoice[] | undefined | null,
    idShort: string | null,
    semanticId: string | null,
): SubmodelElementChoice | null {
    if (!elements) return null;
    for (const el of elements) {
        if (el.idShort == idShort || (el.semanticId?.keys[0] && el.semanticId?.keys[0].value) == semanticId) {
            return el;
        } else if (el.modelType == KeyTypes.SubmodelElementCollection) {
            const foundElement = findSubmodelElementByIdShort(el.value ?? null, idShort, semanticId);
            if (foundElement) {
                return foundElement;
            }
        }
    }
    return null;
}

export function findSubmodelElementBySemanticIdsOrIdShort(
    elements: SubmodelElementChoice[] | null | undefined,
    idShort: string | null,
    semanticIds: string[] | null,
): SubmodelElementChoice | null {
    if (!elements) return null;

    for (const el of elements) {
        const idShortMatches = idShort && el.idShort && el.idShort.toLowerCase() === idShort.toLowerCase();
        const semanticIdMatches = semanticIds?.some((semId) =>
            idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim()),
        );

        if (idShortMatches || semanticIdMatches) {
            return el;
        }

        if (el.modelType == KeyTypes.SubmodelElementCollection) {
            const foundInCollection = findSubmodelElementBySemanticIdsOrIdShort(el.value ?? null, idShort, semanticIds);
            if (foundInCollection) {
                return foundInCollection;
            }
        }
    }

    return null;
}

export function findAllSubmodelElementsBySemanticIdsOrIdShort(
    elements: SubmodelElementChoice[] | null | undefined,
    idShort: string | null,
    semanticIds: string[] | null,
): SubmodelElementChoice[] | null {
    if (!elements) return null;

    const matchingElements: SubmodelElementChoice[] = [];

    for (const el of elements) {
        const matchesIdShort = idShort && el.idShort && el.idShort.toLowerCase() === idShort.toLowerCase();
        const matchesSemanticId = semanticIds?.some((semId) =>
            idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim()),
        );

        if (matchesIdShort || matchesSemanticId) {
            matchingElements.push(el);
        }

        if (el.modelType === KeyTypes.SubmodelElementCollection) {
            const nestedMatches = findAllSubmodelElementsBySemanticIdsOrIdShort(el.value ?? null, idShort, semanticIds);
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
    elements: SubmodelElementChoice[] | null,
    idShortPrefix: string | null,
    semanticIds: string[] | null,
): SubmodelElementChoice[] | null {
    if (!elements) return null;

    const matchingElements: SubmodelElementChoice[] = [];

    for (const el of elements) {
        const matchesIdShortPrefix =
            idShortPrefix && el.idShort && el.idShort.toLowerCase().startsWith(idShortPrefix.toLowerCase());
        const matchesSemanticId = semanticIds?.some((semId) =>
            idEquals(el.semanticId?.keys[0]?.value.trim(), semId.trim()),
        );

        if (matchesIdShortPrefix || matchesSemanticId) {
            matchingElements.push(el);
        }

        if (el.modelType === KeyTypes.SubmodelElementCollection) {
            const nestedMatches = findAllSubmodelElementsBySemanticIdsOrIdShortPrefix(
                el.value ?? null,
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
    elements: SubmodelElementChoice[] | undefined | null,
    idShort: string | null,
    semanticId: string | null = null,
    locale: string,
): string | null {
    const element = findSubmodelElementByIdShort(elements, idShort, semanticId);
    if (!element) return null;
    switch (element.modelType) {
        case KeyTypes.MultiLanguageProperty:
            return getTranslationText(element, locale);
        case KeyTypes.Property:
            return element.value ?? null;
        default:
            return null;
    }
}

export function getArrayFromString(v: string): Array<string> {
    // String should look like this: "(Value1|Value2|Value3)"
    const stripped = v.replace(/[()]/gm, '');
    return stripped.split('|');
}

export function hasSemanticId(el: Submodel | SubmodelElementChoice, ...semanticIds: string[]): boolean {
    for (const id of semanticIds) {
        if (el.semanticId?.keys?.some((key) => idEquals(key.value.trim(), id.trim()))) return true;
    }
    return false;
}

export function getValueType(submodelElement: SubmodelElementChoice): DataTypeDefXsd {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueType = (submodelElement as any).valueType;
    switch (valueType) {
        case 'xs:boolean':
            return DataTypeDefXsd.XsBoolean;
        case 'xs:date':
            return DataTypeDefXsd.XsDate;
        case 'xs:decimal':
            return DataTypeDefXsd.XsDecimal;
        case 'xs:long':
            return DataTypeDefXsd.XsLong;
        default:
            return DataTypeDefXsd.XsString;
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

/**
 * Finds the value of the first key with a matching type in the provided keys array.
 *
 * @param type - The type(s) to match (can be a string or an array of strings, e.g. 'Submodel' | 'Global').
 * @param keys - The array of Key objects to search.
 * @returns The value of the first matching key, or undefined if no match is found.
 */
export function findSemanticIdOfType(type: string | string[], keys: Key[] | undefined): string | undefined {
    const types = Array.isArray(type) ? type : [type];
    return keys?.find((key) => types.some((t) => idEquals(key.type, t)))?.value;
}
