import {
    ISubmodelElement,
    KeyTypes,
    SubmodelElementCollection,
    SubmodelElementList,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { getKeyType } from 'lib/util/KeyTypeUtil';

/**
 * Recursively collects all TreeItem itemIds from a list of submodel elements.
 * Only SubmodelElementCollection and SubmodelElementList nodes produce expandable
 * TreeItems, so only their idShorts are collected.
 *
 * @param elements - The list of submodel elements to walk.
 * @returns A flat array of all expandable itemIds (idShorts).
 */
export function collectAllTreeItemIds(elements: ISubmodelElement[]): string[] {
    const ids: string[] = [];
    for (const element of elements) {
        const keyType = getKeyType(element);
        if (keyType === KeyTypes.SubmodelElementCollection || keyType === KeyTypes.SubmodelElementList) {
            if (element.idShort) {
                ids.push(element.idShort);
            }
            const collection = element as SubmodelElementCollection | SubmodelElementList;
            if (collection.value) {
                ids.push(...collectAllTreeItemIds(collection.value));
            }
        }
    }
    return ids;
}

