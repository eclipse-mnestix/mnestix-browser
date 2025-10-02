import { SyntheticEvent, useState } from 'react';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view';
import { Entity, SubmodelElementChoice, KeyTypes } from 'lib/api/aas/models';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { generateSubmodelViewObjectFromSubmodelElement } from 'lib/util/submodelHelpers/SubmodelViewObjectUtil';
import { ApplicationTreeItem } from './ApplicationTreeItem';
import { useLocale } from 'next-intl';

type ApplicationComponentProps = {
    readonly entity: Entity;
};

export function ApplicationComponent(props: ApplicationComponentProps) {
    const { entity } = props;
    const locale = useLocale();
    const [expandedTreeItems, setExpandedTreeItems] = useState<string[]>(['0']);
    const entityTree: SubmodelViewObject = generateSubmodelViewObjectFromSubmodelElement(entity, '0', locale);

    const handleToggle = (_event: SyntheticEvent, nodeIds: string[]) => {
        setExpandedTreeItems(nodeIds);
    };

    const renderTree = (tree: SubmodelViewObject) => {
        const hasChildEntities =
            tree.children.filter((child) => child.data && child.data.modelType === KeyTypes.Entity).length > 0;
        const applicationUrl = tree.children.find((child) => child.name === 'ApplicationURL')?.propertyValue;
        return (
            <ApplicationTreeItem
                key={tree.id}
                itemId={tree.id}
                label={tree.name}
                data={tree.data as SubmodelElementChoice}
                hasChildEntities={hasChildEntities}
                applicationUrl={applicationUrl}
            >
                {hasChildEntities ? tree.children.map((childTree) => renderTree(childTree)) : undefined}
            </ApplicationTreeItem>
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
