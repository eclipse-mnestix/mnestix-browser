import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view';
import { SyntheticEvent, useState } from 'react';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { viewObjectHasDataValue } from 'lib/util/submodelHelpers/SubmodelViewObjectUtil';
import { BlueprintEditTreeItem } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditTreeItem';
import { useBlueprintContext } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintContext';

export function BlueprintEditTree() {
    const {
        blueprint,
        selectedId,
        selectNode,
        deleteNode,
        duplicateNode,
        getMultiplicity,
        getNumberOfElementsWithSameSemanticId,
    } = useBlueprintContext();

    const [expandedTreeItems, setExpandedTreeItems] = useState<string[]>(blueprint ? [blueprint.id] : []);

    const handleToggle = (event: SyntheticEvent, nodeIds: string[]) => {
        setExpandedTreeItems(nodeIds);
    };

    const handleSelect = (event: SyntheticEvent, nodeId: string | null) => {
        if (nodeId) {
            selectNode(nodeId);
        }
    };

    function renderTree(tree: SubmodelViewObject) {
        return (
            <BlueprintEditTreeItem
                key={tree.id}
                itemId={tree.id}
                label={tree.name}
                hasValue={viewObjectHasDataValue(tree)}
                customOnSelect={() => selectNode(tree.id)}
                multiplicity={getMultiplicity(tree)}
                onDuplicate={() => duplicateNode(tree.id)}
                onDelete={() => deleteNode(tree.id)}
                getNumberOfElementsWithSameSemanticId={(semanticId) =>
                    getNumberOfElementsWithSameSemanticId(semanticId)
                }
                semanticId={tree.data?.semanticId?.keys[0]?.value}
            >
                {tree.children.length
                    ? tree.children.map((childTree) => renderTree(childTree))
                    : undefined}
            </BlueprintEditTreeItem>
        );
    }

    return (
        <SimpleTreeView
            slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
            expandedItems={expandedTreeItems}
            selectedItems={selectedId}
            onExpandedItemsChange={handleToggle}
            onSelectedItemsChange={handleSelect}
            itemChildrenIndentation={24}
        >
            {blueprint && renderTree(blueprint)}
        </SimpleTreeView>
    );
}
