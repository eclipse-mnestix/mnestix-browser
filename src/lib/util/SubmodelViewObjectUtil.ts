import {
    Entity,
    ISubmodelElement,
    KeyTypes,
    Property,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { SubmodelViewObject, SubmodelViewObjectSpec } from 'lib/types/SubmodelViewObject';
import { cloneDeep, parseInt } from 'lodash';
import { getKeyType } from './KeyTypeUtil';
import * as SpecTypes from 'lib/api/aas/models';

export function generateSubmodelViewObjectFromSubmodelElement(el: ISubmodelElement, id: string): SubmodelViewObject {
    const localEl = cloneDeep(el);
    const frontend: SubmodelViewObject = {
        id,
        name: localEl.idShort ?? '',
        children: [],
        hasValue: false,
        isAboutToBeDeleted: false,
        propertyValue: (localEl as Property).value ?? undefined,
    };

    if (getKeyType(localEl) === KeyTypes.SubmodelElementCollection) {
        const col = localEl as SubmodelElementCollection;
        const arr = col.value || [];
        arr.forEach((child, i) => {
            if (!child) return;
            frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(child, id + '-' + i));
        });
        col.value = [];
    } else if (getKeyType(localEl) === KeyTypes.Entity) {
        const entity = localEl as Entity;
        entity.statements?.forEach((child, i) => {
            if (!child) return;
            frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(child, id + '-' + i));
        });
        entity.statements = [];
    }
    frontend.data = localEl;
    frontend.hasValue = viewObjectHasDataValue(frontend as SubmodelViewObjectSpec);
    return frontend;
}

export function viewObjectHasDataValue(el: SubmodelViewObjectSpec) {
    if (!el.data) {
        return false;
    }
    switch (el.data.modelType) {
        case SpecTypes.KeyTypes.Property:
        case SpecTypes.KeyTypes.File:
            return !!el.data.value;
        case SpecTypes.KeyTypes.MultiLanguageProperty: {
            if (!el.data) {
                return false;
            }
            if (Array.isArray(el.data.value)) {
                return !!el.data.value.length;
            }
            return false;
        }
        default:
            return false;
    }
}

export function splitIdIntoArray(id: string): number[] {
    return id.split('-').map(function (i) {
        return parseInt(i);
    });
}

export function getParentOfElement(id: string, submodel: SubmodelViewObjectSpec) {
    const idArray = splitIdIntoArray(id);
    let parentElement = submodel;
    for (let i = 0; i < idArray.length - 1; i++) {
        if (i != 0) {
            parentElement = parentElement.children[idArray[i]];
        }
    }
    return parentElement;
}

export async function rewriteNodeIds(elementToUpdate: SubmodelViewObjectSpec, newId: string) {
    elementToUpdate.id = newId;
    for (let i = 0; i < elementToUpdate.children.length; i++) {
        await rewriteNodeIds(elementToUpdate.children[i], newId + '-' + i);
    }
}

export function updateNodeIds(originalParentNodeId: string, newParentNodeId: string, parent: SubmodelViewObjectSpec) {
    for (const child of parent.children) {
        updateNodeIds(originalParentNodeId, newParentNodeId, child);
    }
    parent.id = parent.id.replace(originalParentNodeId, newParentNodeId);
}
