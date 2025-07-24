import { Entity, SubmodelElementChoice } from 'lib/api/aas/models';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { generateSubmodelViewObjectFromSubmodelElement } from 'lib/util/SubmodelViewObjectUtil';
import { SimpleTreeView } from '@mui/x-tree-view';
import { EntityTreeItem } from './EntityTreeItem';
import { SyntheticEvent, useState } from 'react';

type EntityComponentProps = {
    readonly entity: Entity;
};

export function EntityComponent(props: EntityComponentProps) {
    const { entity } = props;
    const [expandedTreeItems, setExpandedTreeItems] = useState<string[]>(['0']);
    const entityTree: SubmodelViewObject = generateSubmodelViewObjectFromSubmodelElement(entity, '0');

    const handleToggle = (event: SyntheticEvent, nodeIds: string[]) => {
        setExpandedTreeItems(nodeIds);
    };

    const renderTree = (tree: SubmodelViewObject) => {
        return (
            <EntityTreeItem key={tree.id} itemId={tree.id} label={tree.name} data={tree.data as SubmodelElementChoice}>
                {tree.children.length ? tree.children.map((childTree) => renderTree(childTree)) : undefined}
            </EntityTreeItem>
        );
    };

    return (
        <SimpleTreeView
            slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
            expandedItems={expandedTreeItems}
            onExpandedItemsChange={handleToggle}
            disableSelection
        >
            {renderTree(entityTree)}
        </SimpleTreeView>
    );
}
