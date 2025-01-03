import {
    Entity,
    ISubmodelElement,
    KeyTypes,
    LangStringTextType,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { clone, cloneDeep, escapeRegExp, parseInt } from 'lodash';
import { getKeyType } from './KeyTypeUtil';

export function generateSubmodelViewObject(sm: Submodel): SubmodelViewObject {
    const localSm = cloneDeep(sm);
    // Ids are unique for the tree, start with 0, children have 0-0, 0-1, and so on
    const frontend: SubmodelViewObject = { id: '0', name: localSm.idShort!, children: [], isAboutToBeDeleted: false };

    if (localSm.submodelElements) {
        const arr = localSm.submodelElements;
        arr.forEach((el, i) => frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(el, '0-' + i)));
        localSm.submodelElements = [];
    }
    frontend.data = localSm;

    return frontend;
}

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
    frontend.hasValue = viewObjectHasDataValue(frontend);
    return frontend;
}

export function generateSubmodel(viewObject: SubmodelViewObject): Submodel {
    const submodel = viewObject.data as Submodel;
    if (viewObject.children.length) {
        submodel.submodelElements = [];
        viewObject.children.forEach((child) => {
            if (child.children.length) {
                const collection = child.data as SubmodelElementCollection;
                collection.value = generateSubmodelElements(child.children);
                child.data = collection;
            }
            submodel.submodelElements?.push(child.data as ISubmodelElement);
        });
    }
    return submodel;
}

function generateSubmodelElements(viewObjects: SubmodelViewObject[]): ISubmodelElement[] {
    return viewObjects.map((vo) => {
        if (vo.children.length) {
            const collection = vo.data as SubmodelElementCollection;
            collection.value = generateSubmodelElements(vo.children);
            vo.data = collection;
        }
        return vo.data as ISubmodelElement;
    });
}

export function viewObjectHasDataValue(el: SubmodelViewObject) {
    switch (getKeyType(el.data!)) {
        case KeyTypes.Property:
        case KeyTypes.File:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return !!(el.data as any).value;
        case KeyTypes.MultiLanguageProperty: {
            const mLangProp = el.data as MultiLanguageProperty;
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

function splitIdIntoArray(id: string): number[] {
    return id.split('-').map(function (i) {
        return parseInt(i);
    });
}

function getParentOfElement(id: string, submodel: SubmodelViewObject) {
    const idArray = splitIdIntoArray(id);
    let parentElement = submodel;
    for (let i = 0; i < idArray.length - 1; i++) {
        if (i != 0) {
            parentElement = parentElement.children[idArray[i]];
        }
    }
    return parentElement;
}

export function deleteItem(elementToDeleteId: string, submodel: SubmodelViewObject): SubmodelViewObject {
    const idArray = splitIdIntoArray(elementToDeleteId);
    const parentElement = getParentOfElement(elementToDeleteId, submodel);
    if (parentElement) {
        //search for the current index of the element to delete because through deleting, the arrays shift
        let childIndex = -1;
        parentElement.children.filter((el, index) => {
            if ((el as SubmodelViewObject).id == idArray.join('-')) {
                childIndex = index;
            }
        });
        if (childIndex >= 0) {
            parentElement.children.splice(childIndex, 1);
        }
        //update all element ids after the deleted one
        for (let i = idArray[idArray.length - 1]; i < parentElement.children.length; i++) {
            const oldId = clone(idArray);
            oldId[oldId.length - 1] = i + 1;
            const newId = clone(idArray);
            newId[newId.length - 1] = i;
            updateNodeIds(oldId.join('-'), newId.join('-'), parentElement.children[i]);
        }
    }
    return submodel;
}

export function duplicateItem(elementToDuplicateId: string, submodel: SubmodelViewObject) {
    const parentElement = getParentOfElement(elementToDuplicateId, submodel);
    const idArray = splitIdIntoArray(elementToDuplicateId);
    const elementToDuplicate = cloneDeep(parentElement?.children[idArray[idArray.length - 1]]);
    if (elementToDuplicate && parentElement) {
        //rename the duplicated element
        const matchingNames = findMatchingNames(parentElement, elementToDuplicate.name);
        const elementName = generateNameOfDuplicatedElement(parentElement, elementToDuplicate.name, matchingNames);
        elementToDuplicate.name = elementName; //Name needs to be adjusted, otherwise only one element will be saved
        if (elementToDuplicate.data?.idShort) {
            elementToDuplicate.data.idShort = elementName;
        }
        //insert the duplicated element after the original element and already existing duplicates
        parentElement.children.splice(idArray[idArray.length - 1] + matchingNames.length + 1, 0, elementToDuplicate);
        //rewrite the id
        for (let i = idArray[idArray.length - 1] + matchingNames.length + 1; i < parentElement.children.length; i++) {
            const newIndexArray = idArray;
            newIndexArray.pop();
            newIndexArray.push(i);
            const newId = newIndexArray.join('-');
            updateNodeIds(parentElement.children[i].id, newId, parentElement.children[i]);
        }
    }
    return submodel;
}

export async function rewriteNodeIds(elementToUpdate: SubmodelViewObject, newId: string) {
    elementToUpdate.id = newId;
    for (let i = 0; i < elementToUpdate.children.length; i++) {
        await rewriteNodeIds(elementToUpdate.children[i], newId + '-' + i);
    }
}

export function findElementsToDelete(elementToCheck: SubmodelViewObject): string[] {
    let returnArray: string[] = [];
    for (const child of elementToCheck.children) {
        returnArray = returnArray.concat(findElementsToDelete(child));
    }
    if (elementToCheck.isAboutToBeDeleted == true) {
        returnArray.push(elementToCheck.id);
    }
    return returnArray;
}

function updateNodeIds(originalParentNodeId: string, newParentNodeId: string, parent: SubmodelViewObject) {
    for (const child of parent.children) {
        updateNodeIds(originalParentNodeId, newParentNodeId, child);
    }
    parent.id = parent.id.replace(originalParentNodeId, newParentNodeId);
}

function findMatchingNames(tree: SubmodelViewObject, originalName: string): string[] {
    const matchingNames: string[] = [];
    //go through the tree and find all names with pattern "originalName_number"
    tree.children.map((child) => {
        if (new RegExp('^' + escapeRegExp(originalName) + '_([1-9]\\d*|0)$').test(child.name)) {
            matchingNames.push(child.name);
        }
    });
    return matchingNames;
}

function generateNameOfDuplicatedElement(
    tree: SubmodelViewObject,
    originalName: string,
    matchingNames: string[],
): string {
    let currentSmallestIndex = 0;
    const matchingNameIndexes: number[] = [];
    matchingNames.map((name) => {
        //split the index off of the names with pattern 'name_index'
        const index = name.split(new RegExp('^.*(_([1-9]\\d*|0))$'))[1].split('_')[1];
        matchingNameIndexes.push(parseInt(index));
    });
    let anotherLoop = true;
    while (anotherLoop) {
        anotherLoop = false;
        for (const i of matchingNameIndexes) {
            if (i == currentSmallestIndex) {
                anotherLoop = true;
                currentSmallestIndex++;
            }
        }
    }
    return originalName + '_' + currentSmallestIndex;
}
