import { SubmodelElementChoice, KeyTypes, LangStringTextType, Property } from 'lib/api/aas/models';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { cloneDeep, parseInt } from 'lodash';

export function generateSubmodelViewObjectFromSubmodelElement(
    el: SubmodelElementChoice,
    id: string,
): SubmodelViewObject {
    const localEl = cloneDeep(el);
    const frontend: SubmodelViewObject = {
        id,
        name: localEl.idShort ?? '',
        children: [],
        hasValue: false,
        isAboutToBeDeleted: false,
        propertyValue: (localEl as Property).value ?? undefined,
    };

    if (localEl.modelType === KeyTypes.SubmodelElementCollection) {
        const col = localEl;
        const arr = col.value || [];
        arr.forEach((child, i) => {
            if (!child) return;
            frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(child, id + '-' + i));
        });
        col.value = [];
    } else if (localEl.modelType === KeyTypes.Entity) {
        const entity = localEl;
        entity.statements?.forEach((child, i) => {
            if (!child) return;
            frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(child, id + '-' + i));
        });
        entity.statements = [];
    }
    frontend.data = localEl;
    frontend.hasValue = viewObjectHasDataValue(frontend);
    return frontend;
}

export function viewObjectHasDataValue(el: SubmodelViewObject) {
    switch (el.data!.modelType) {
        case KeyTypes.Property:
        case KeyTypes.File:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return !!(el.data as any).value;
        case KeyTypes.MultiLanguageProperty: {
            const mLangProp = el.data;
            if (Array.isArray(mLangProp.value)) {
                return !!mLangProp.value.length;
            } else if (mLangProp.value! as Array<LangStringTextType>) {
                return !!mLangProp.value!.length;
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

export function getParentOfElement(id: string, submodel: SubmodelViewObject) {
    const idArray = splitIdIntoArray(id);
    let parentElement = submodel;
    for (let i = 0; i < idArray.length - 1; i++) {
        if (i != 0) {
            parentElement = parentElement.children[idArray[i]];
        }
    }
    return parentElement;
}

export async function rewriteNodeIds(elementToUpdate: SubmodelViewObject, newId: string) {
    elementToUpdate.id = newId;
    for (let i = 0; i < elementToUpdate.children.length; i++) {
        await rewriteNodeIds(elementToUpdate.children[i], newId + '-' + i);
    }
}

export function updateNodeIds(originalParentNodeId: string, newParentNodeId: string, parent: SubmodelViewObject) {
    for (const child of parent.children) {
        updateNodeIds(originalParentNodeId, newParentNodeId, child);
    }
    parent.id = parent.id.replace(originalParentNodeId, newParentNodeId);
}
