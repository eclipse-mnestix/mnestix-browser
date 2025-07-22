import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view';
import { SyntheticEvent, useState } from 'react';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import {
    viewObjectHasDataValue,
    rewriteNodeIds, splitIdIntoArray, updateNodeIds,
} from 'lib/util/SubmodelViewObjectUtil';
import { TemplateEditTreeItem } from './TemplateEditTreeItem';
import multiplicityData from './edit-components/multiplicity/multiplicity-data.json';
import cloneDeep from 'lodash/cloneDeep';
import { Qualifier } from 'lib/api/aas/models';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { escapeRegExp, parseInt } from 'lodash';

type TemplateEditTreeProps = {
    rootTree?: SubmodelViewObject;
    onTreeChange: (tree: SubmodelViewObject, deletedItems?: string[]) => void;
    onSelectionChange: (treePart: SubmodelViewObject, onChange: (tree: SubmodelViewObject) => void) => void;
};

export function TemplateEditTree(props: TemplateEditTreeProps) {
    const [expandedTreeItems, setExpandedTreeItems] = useState<string[]>(props.rootTree ? [props.rootTree?.id] : []);
    const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>(props.rootTree ? props.rootTree.id : null);
    const [deletedItems, setDeletedItems] = useState<string[]>([]);

    const handleToggle = (event: SyntheticEvent, nodeIds: string[]) => {
        setExpandedTreeItems(nodeIds);
    };

    const handleSelect = (event: SyntheticEvent, nodeId: string | null) => {
        setSelectedTreeItem(nodeId);
    };

    const renderTree = (
        tree: SubmodelViewObject,
        parentAboutToBeDeleted: boolean | undefined,
        onChange: (tree: SubmodelViewObject) => void,
    ) => {
        return (
            <TemplateEditTreeItem
                key={tree.id}
                itemId={tree.id}
                label={tree.name}
                hasValue={viewObjectHasDataValue(tree)}
                customOnSelect={() => props.onSelectionChange(tree, onChange)}
                multiplicity={getMultiplicity(tree)}
                onDuplicate={() => duplicateTreeItem(tree.id, props.rootTree)}
                onDelete={() => deleteTreeItem(tree.id, props.rootTree)}
                onRestore={() => restoreTreeItem(tree.id, props.rootTree)}
                getNumberOfElementsWithSameSemanticId={(semanticId) => getAllWithSemanticId(props.rootTree, semanticId)}
                semanticId={tree.data?.semanticId?.keys[0]?.value}
                isParentAboutToBeDeleted={parentAboutToBeDeleted}
                isAboutToBeDeleted={tree.isAboutToBeDeleted}
            >
                {tree.children.length
                    ? tree.children.map((childTree, i) =>
                          renderTree(childTree, tree.isAboutToBeDeleted || parentAboutToBeDeleted, (changedChildTree) =>
                              // if an onChange from a child is triggered, we combine it with the higher tree and inject the changed child into the children
                              onChange({
                                  ...tree,
                                  children: tree.children?.map((child, ci) => (ci === i ? changedChildTree : child)),
                              }),
                          ),
                      )
                    : undefined}
            </TemplateEditTreeItem>
        );
    };

    function getAllWithSemanticId(tree: SubmodelViewObject | undefined, semanticId: string | undefined): number {
        let number = 0;
        if (tree && semanticId) {
            for (const child of tree.children) {
                number += getAllWithSemanticId(child, semanticId);
            }
            if (tree.data?.semanticId?.keys[0]?.value == semanticId && !tree.isAboutToBeDeleted) {
                return number + 1;
            } else {
                return number;
            }
        } else {
            return number;
        }
    }

    function getMultiplicity(tree: SubmodelViewObject) {
        const qualifier = tree.data?.qualifiers?.find((q: Qualifier) =>
            multiplicityData.qualifierTypes.includes(q.type),
        );
        return qualifier?.value as MultiplicityEnum;
    }

    //Duplicate, Delete, Restore
    async function duplicateTreeItem(nodeId: string, rootTree: SubmodelViewObject | undefined) {
        if (rootTree) {
            const newRootTree = duplicateItem(nodeId, cloneDeep(rootTree));
            await rewriteNodeIds(newRootTree, '0');
            const newDeletedItems = findElementsToDelete(newRootTree);
            setDeletedItems(newDeletedItems);
            props.onTreeChange(newRootTree, newDeletedItems);
        }
    }

    function findElementsToDelete(elementToCheck: SubmodelViewObject): string[] {
        let returnArray: string[] = [];
        for (const child of elementToCheck.children) {
            returnArray = returnArray.concat(findElementsToDelete(child));
        }
        if (elementToCheck.isAboutToBeDeleted == true) {
            returnArray.push(elementToCheck.id);
        }
        return returnArray;
    }

    function duplicateItem(elementToDuplicateId: string, submodel: SubmodelViewObject) {
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

    function deleteTreeItem(nodeId: string, rootTree: SubmodelViewObject | undefined) {
        if (rootTree) {
            const treeCopy = cloneDeep(rootTree);
            const elementToDelete = getElement(nodeId, treeCopy);
            if (elementToDelete) {
                let newDeletedItems = cloneDeep(deletedItems);
                newDeletedItems = newDeletedItems.concat(deleteTreeItemAndChildren(elementToDelete));
                setDeletedItems(newDeletedItems);
                props.onTreeChange(treeCopy, newDeletedItems);
            }
        }
    }

    function deleteTreeItemAndChildren(treeItem: SubmodelViewObject) {
        let deletedElementsIds: string[] = [];
        for (const child of treeItem.children) {
            deletedElementsIds = deletedElementsIds.concat(deleteTreeItemAndChildren(child));
        }
        treeItem.isAboutToBeDeleted = true;
        deletedElementsIds.push(treeItem.id);
        return deletedElementsIds;
    }

    function restoreTreeItem(nodeId: string, rootTree: SubmodelViewObject | undefined) {
        if (rootTree) {
            const treeCopy = cloneDeep(rootTree);
            const elementToRestore = getElement(nodeId, treeCopy);
            if (elementToRestore) {
                elementToRestore.isAboutToBeDeleted = false;
                const newDeletedItems = deletedItems.filter((el) => {
                    return !el.includes(nodeId);
                });
                setDeletedItems(newDeletedItems);
                props.onTreeChange(treeCopy, newDeletedItems);
            }
        }
    }

    function getParentOfElement(nodeId: string, tree: SubmodelViewObject): SubmodelViewObject | undefined {
        let currentElement = tree;
        let parentElement;
        const idArray = separateNodeId(nodeId);
        for (let i = 0; i < idArray.length; i++) {
            if (i != 0) {
                currentElement = currentElement.children[idArray[i]];
            }
            if (i == idArray.length - 2) {
                //second to last item
                parentElement = currentElement;
                break;
            }
        }
        return parentElement;
    }

    function getElement(nodeId: string, tree: SubmodelViewObject): SubmodelViewObject | undefined {
        const idArray = separateNodeId(nodeId);
        return getParentOfElement(nodeId, tree)?.children[idArray[idArray.length - 1]];
    }

    function separateNodeId(nodeId: string): number[] {
        const stringArray = nodeId.split('-');
        const numberArray: number[] = [];
        stringArray.map((string) => {
            numberArray.push(parseInt(string));
        });
        return numberArray;
    }

    return (
        <SimpleTreeView
            slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
            expandedItems={expandedTreeItems}
            selectedItems={selectedTreeItem}
            onExpandedItemsChange={handleToggle}
            onSelectedItemsChange={handleSelect}
        >
            {props.rootTree &&
                renderTree(
                    props.rootTree,
                    props.rootTree.isAboutToBeDeleted,
                    props.onTreeChange as (tree: SubmodelViewObject) => void,
                )}
        </SimpleTreeView>
    );
}
