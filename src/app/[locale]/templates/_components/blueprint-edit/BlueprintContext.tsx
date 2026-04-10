'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { Qualifier, Submodel, SubmodelElementChoice, SubmodelElementCollection } from 'lib/api/aas/models';
import {
    generateSubmodelViewObjectFromSubmodelElement,
    rewriteNodeIds,
    splitIdIntoArray,
    updateNodeIds,
} from 'lib/util/submodelHelpers/SubmodelViewObjectUtil';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import multiplicityData from './edit-components/multiplicity/multiplicity-data.json';
import cloneDeep from 'lodash/cloneDeep';
import { escapeRegExp, parseInt } from 'lodash';

// ───────────────────────── Types ─────────────────────────

interface BlueprintContextValue {
    /** The single source of truth tree. */
    blueprint: SubmodelViewObject | undefined;
    /** Set the full blueprint tree (e.g. after fetching from API). */
    setBlueprint: (tree: SubmodelViewObject | undefined) => void;
    /** ID of the currently selected node. */
    selectedId: string | null;
    /** Select a node by ID. */
    selectNode: (id: string | null) => void;
    /** Whether changes have been made since last save/load. */
    changesMade: boolean;
    /** Mark the blueprint as changed. */
    markChanged: () => void;
    /** Reset changesMade flag (e.g. after save). */
    resetChanged: () => void;
    /** The currently selected element (derived from blueprint + selectedId). */
    selectedElement: SubmodelViewObject | undefined;
    /** Update the currently selected element in-place within the tree. */
    updateSelectedElement: (updated: SubmodelViewObject) => void;
    /** Hard-delete a node by ID (removes it from the tree). */
    deleteNode: (nodeId: string) => void;
    /** Duplicate a node by ID. */
    duplicateNode: (nodeId: string) => void;
    /** Get the multiplicity qualifier value for a node. */
    getMultiplicity: (node: SubmodelViewObject) => MultiplicityEnum | undefined;
    /** Count how many elements in the entire tree share the same semanticId. */
    getNumberOfElementsWithSameSemanticId: (semanticId: string | undefined) => number;
    /** Whether the blueprint is based on a custom template. */
    isBasedOnCustomTemplate: boolean | undefined;
    /** Set known templates for custom template detection. */
    setTemplates: (templates: Submodel[]) => void;
    /** Convert the current tree back into a Submodel for saving. */
    toSubmodel: () => Submodel | undefined;
    /** Display name derived from the blueprint. */
    blueprintDisplayName: string | undefined;
    /** Semantic ID of the blueprint (stable after load, avoids subscribing to full blueprint). */
    templateSemanticId: string | undefined;
}

const BlueprintContext = createContext<BlueprintContextValue | undefined>(undefined);

// ───────────────────────── Utility functions ─────────────────────────

/** Convert a Submodel from the API into a SubmodelViewObject tree. */
function generateSubmodelViewObject(sm: Submodel, locale: string): SubmodelViewObject {
    const localSm = cloneDeep(sm);
    const frontend: SubmodelViewObject = {
        id: '0',
        name: localSm.idShort!,
        children: [],
    };

    if (localSm.submodelElements) {
        localSm.submodelElements.forEach((el, i) =>
            frontend.children.push(generateSubmodelViewObjectFromSubmodelElement(el, '0-' + i, locale)),
        );
        localSm.submodelElements = [];
    }
    frontend.data = localSm;

    return frontend;
}

/** Convert a SubmodelViewObject tree back into a Submodel. */
function generateSubmodel(viewObject: SubmodelViewObject): Submodel {
    const submodel = cloneDeep(viewObject.data) as Submodel;
    if (viewObject.children.length) {
        submodel.submodelElements = [];
        viewObject.children.forEach((child) => {
            if (child.children.length) {
                const collection = cloneDeep(child.data) as SubmodelElementCollection;
                collection.value = generateSubmodelElements(child.children);
                submodel.submodelElements?.push(collection as SubmodelElementChoice);
            } else {
                submodel.submodelElements?.push(cloneDeep(child.data) as SubmodelElementChoice);
            }
        });
    }
    return submodel;
}

function generateSubmodelElements(viewObjects: SubmodelViewObject[]): SubmodelElementChoice[] {
    return viewObjects.map((vo) => {
        if (vo.children.length) {
            const collection = cloneDeep(vo.data) as SubmodelElementCollection;
            collection.value = generateSubmodelElements(vo.children);
            return collection as SubmodelElementChoice;
        }
        return cloneDeep(vo.data) as SubmodelElementChoice;
    });
}

/** Find an element in the tree by its ID path (e.g. "0-1-2"). */
function findElement(nodeId: string, tree: SubmodelViewObject): SubmodelViewObject | undefined {
    const idArray = splitIdIntoArray(nodeId);
    let current: SubmodelViewObject = tree;
    // idArray[0] is always 0 (root), start navigation from index 1
    for (let i = 1; i < idArray.length; i++) {
        const child = current.children[idArray[i]];
        if (!child) return undefined;
        current = child;
    }
    return current;
}

/** Find the parent of an element by its ID path. */
function findParent(nodeId: string, tree: SubmodelViewObject): SubmodelViewObject | undefined {
    const idArray = splitIdIntoArray(nodeId);
    if (idArray.length <= 1) return undefined; // root has no parent
    let current: SubmodelViewObject = tree;
    for (let i = 1; i < idArray.length - 1; i++) {
        const child = current.children[idArray[i]];
        if (!child) return undefined;
        current = child;
    }
    return current;
}

/** Count elements in the tree that share a given semanticId. */
function countBySemanticId(tree: SubmodelViewObject, semanticId: string): number {
    let count = 0;
    if (tree.data?.semanticId?.keys[0]?.value === semanticId) {
        count++;
    }
    for (const child of tree.children) {
        count += countBySemanticId(child, semanticId);
    }
    return count;
}

/** Get the multiplicity qualifier from a tree node's data. */
function getMultiplicityFromNode(tree: SubmodelViewObject): MultiplicityEnum | undefined {
    const qualifier = tree.data?.qualifiers?.find((q: Qualifier) => multiplicityData.qualifierTypes.includes(q.type));
    return qualifier?.value as MultiplicityEnum | undefined;
}

function findMatchingNames(parent: SubmodelViewObject, originalName: string): string[] {
    const matchingNames: string[] = [];
    parent.children.forEach((child) => {
        if (new RegExp('^' + escapeRegExp(originalName) + '_([1-9]\\d*|0)$').test(child.name)) {
            matchingNames.push(child.name);
        }
    });
    return matchingNames;
}

function generateNameOfDuplicatedElement(originalName: string, matchingNames: string[]): string {
    let currentSmallestIndex = 0;
    const matchingNameIndexes: number[] = [];
    matchingNames.forEach((name) => {
        const index = name.split(new RegExp('^.*(_([1-9]\\d*|0))$'))[1].split('_')[1];
        matchingNameIndexes.push(parseInt(index));
    });
    let anotherLoop = true;
    while (anotherLoop) {
        anotherLoop = false;
        for (const i of matchingNameIndexes) {
            if (i === currentSmallestIndex) {
                anotherLoop = true;
                currentSmallestIndex++;
            }
        }
    }
    return originalName + '_' + currentSmallestIndex;
}

// ───────────────────────── Provider ─────────────────────────

interface BlueprintProviderProps {
    children: React.ReactNode;
}

export function BlueprintProvider({ children }: BlueprintProviderProps) {
    const [blueprint, setBlueprintState] = useState<SubmodelViewObject | undefined>();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [changesMade, setChangesMade] = useState(false);
    const [templates, setTemplatesState] = useState<Submodel[]>([]);

    // ── Derived values ──

    const selectedElement = useMemo(() => {
        if (!blueprint || !selectedId) return undefined;
        if (selectedId === blueprint.id) return blueprint;
        return findElement(selectedId, blueprint);
    }, [blueprint, selectedId]);

    const blueprintDisplayName = useMemo(() => {
        return (
            blueprint?.data?.qualifiers?.find((q: Qualifier) => q.type === 'displayName')?.value ||
            blueprint?.data?.idShort
        );
    }, [blueprint]);

    const templateSemanticId = useMemo(() => {
        return blueprint?.data?.semanticId?.keys?.[0]?.value;
    }, [blueprint]);

    const isBasedOnCustomTemplate = useMemo(() => {
        if (!blueprint) return undefined;
        const id = blueprint.data?.semanticId?.keys?.[0]?.value;
        if (!id || templates.length === 0) return undefined;
        return !templates.some((t) => t.semanticId?.keys?.[0]?.value === id);
    }, [blueprint, templates]);

    // ── Actions ──

    const setBlueprint = useCallback((tree: SubmodelViewObject | undefined) => {
        setBlueprintState(tree);
        if (tree) {
            setSelectedId(tree.id);
        } else {
            setSelectedId(null);
        }
    }, []);

    const selectNode = useCallback((id: string | null) => {
        setSelectedId(id);
    }, []);

    const markChanged = useCallback(() => {
        setChangesMade(true);
    }, []);

    const resetChanged = useCallback(() => {
        setChangesMade(false);
    }, []);

    const updateSelectedElement = useCallback(
        (updated: SubmodelViewObject) => {
            if (!blueprint || !selectedId) return;

            if (selectedId === blueprint.id) {
                // updating root
                setBlueprintState(updated);
                setChangesMade(true);
                return;
            }
            const newTree = cloneDeep(blueprint);
            const parent = findParent(selectedId, newTree);
            if (!parent) return;

            const idArray = splitIdIntoArray(selectedId);
            const childIndex = idArray[idArray.length - 1];
            parent.children[childIndex] = updated;
            setBlueprintState(newTree);
            setChangesMade(true);
        },
        [blueprint, selectedId],
    );

    const deleteNode = useCallback(
        (nodeId: string) => {
            if (!blueprint || nodeId === blueprint.id) return; // cannot delete root

            const newTree = cloneDeep(blueprint);
            const parent = findParent(nodeId, newTree);
            if (!parent) return;

            const idArray = splitIdIntoArray(nodeId);
            const childIndex = idArray[idArray.length - 1];
            parent.children.splice(childIndex, 1);

            // Rewrite all IDs to be consistent
            rewriteNodeIds(newTree, '0');

            // Auto-select: prefer the parent, or the next sibling if available
            const newSelectedId = parent.id;

            setBlueprintState(newTree);
            setSelectedId(newSelectedId);
            setChangesMade(true);
        },
        [blueprint],
    );

    const duplicateNode = useCallback(
        (nodeId: string) => {
            if (!blueprint) return;

            const newTree = cloneDeep(blueprint);
            const parent = findParent(nodeId, newTree);
            if (!parent) return;

            const idArray = splitIdIntoArray(nodeId);
            const childIndex = idArray[idArray.length - 1];
            const elementToDuplicate = cloneDeep(parent.children[childIndex]);
            if (!elementToDuplicate) return;

            // Rename the duplicated element
            const matchingNames = findMatchingNames(parent, elementToDuplicate.name);
            const elementName = generateNameOfDuplicatedElement(elementToDuplicate.name, matchingNames);
            elementToDuplicate.name = elementName;
            if (elementToDuplicate.data?.idShort) {
                elementToDuplicate.data.idShort = elementName;
            }

            // Insert after the original + existing duplicates
            const insertIndex = childIndex + matchingNames.length + 1;
            parent.children.splice(insertIndex, 0, elementToDuplicate);

            // Rewrite IDs for elements after the insertion point
            for (let i = insertIndex; i < parent.children.length; i++) {
                const newIdArray = [...idArray];
                newIdArray.pop();
                newIdArray.push(i);
                const newId = newIdArray.join('-');
                updateNodeIds(parent.children[i].id, newId, parent.children[i]);
            }

            // Also rewrite the duplicated element's children
            const duplicatedId = [...idArray];
            duplicatedId.pop();
            duplicatedId.push(insertIndex);
            rewriteNodeIds(elementToDuplicate, duplicatedId.join('-'));

            setBlueprintState(newTree);
            setChangesMade(true);
        },
        [blueprint],
    );

    const getNumberOfElementsWithSameSemanticId = useCallback(
        (semanticId: string | undefined) => {
            if (!blueprint || !semanticId) return 0;
            return countBySemanticId(blueprint, semanticId);
        },
        [blueprint],
    );

    const toSubmodel = useCallback(() => {
        if (!blueprint) return undefined;
        return generateSubmodel(blueprint);
    }, [blueprint]);

    // ── Context value ──

    const value = useMemo<BlueprintContextValue>(
        () => ({
            blueprint,
            setBlueprint,
            selectedId,
            selectNode,
            changesMade,
            markChanged,
            resetChanged,
            selectedElement,
            updateSelectedElement,
            deleteNode,
            duplicateNode,
            getMultiplicity: getMultiplicityFromNode,
            getNumberOfElementsWithSameSemanticId,
            isBasedOnCustomTemplate,
            setTemplates: setTemplatesState,
            toSubmodel,
            blueprintDisplayName,
            templateSemanticId,
        }),
        [
            blueprint,
            setBlueprint,
            selectedId,
            selectNode,
            changesMade,
            markChanged,
            resetChanged,
            selectedElement,
            updateSelectedElement,
            deleteNode,
            duplicateNode,
            getNumberOfElementsWithSameSemanticId,
            isBasedOnCustomTemplate,
            toSubmodel,
            blueprintDisplayName,
            templateSemanticId,
        ],
    );

    return <BlueprintContext.Provider value={value}>{children}</BlueprintContext.Provider>;
}

// ───────────────────────── Hook ─────────────────────────

/**
 * Access the BlueprintContext. Must be used within a BlueprintProvider.
 */
export function useBlueprintContext(): BlueprintContextValue {
    const context = useContext(BlueprintContext);
    if (!context) {
        throw new Error('useBlueprintContext must be used within a BlueprintProvider');
    }
    return context;
}

// Re-export for use in TemplateBuilderPage (API → tree conversion)
export { generateSubmodelViewObject };
