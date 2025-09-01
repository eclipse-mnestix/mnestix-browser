import * as React from 'react';
import { useState } from 'react';
import { treeItemClasses, TreeItemRoot } from '@mui/x-tree-view';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { TextSnippet } from '@mui/icons-material';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { TemplateEditTreeItemMenu } from './TemplateEditTreeItemMenu';
import { useTranslations } from 'next-intl';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import { TreeItemCheckbox, TreeItemGroupTransition, TreeItemIconContainer } from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { CustomTreeItemContent } from 'app/[locale]/viewer/_components/submodel/bill-of-applications/visualization-components/ApplicationTreeItem';

interface CustomTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
    hasValue?: boolean;
    customOnSelect: () => void;
    multiplicity: MultiplicityEnum | undefined;
    onDuplicate: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onRestore: (nodeId: string) => void;
    getNumberOfElementsWithSameSemanticId: (semanticId: string | undefined) => number;
    semanticId: string | undefined;
    isParentAboutToBeDeleted: boolean | undefined;
    isAboutToBeDeleted: boolean | undefined;
}
const CustomContent = React.forwardRef(function CustomContent(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const {
        id,
        label,
        itemId,
        hasValue,
        customOnSelect,
        multiplicity,
        getNumberOfElementsWithSameSemanticId,
        semanticId,
        children,
        disabled,
        onDuplicate,
        onDelete,
        onRestore,
        isParentAboutToBeDeleted,
        isAboutToBeDeleted,
        ...other
    } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,

        getGroupTransitionProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const [isAboutToBeDeletedLocally, setIsAboutToBeDeletedLocally] = useState(false);
    const t = useTranslations('pages.templates');

    React.useEffect(() => {
        setIsAboutToBeDeletedLocally(false);
    }, [label, semanticId]);

    React.useEffect(() => {
        if (props.isAboutToBeDeleted) {
            setIsAboutToBeDeletedLocally(true);
        }
    }, [props.isAboutToBeDeleted]);

    React.useEffect(() => {
        // Trigger the customOnSelect initially for the first selected element, so the edit fields are displayed
        if (status.selected) {
            customOnSelect();
        }
    }, []);

    const handleSelectionClick = () => {
        customOnSelect();
    };

    const handleDelete = () => {
        onDelete(itemId);
        setIsAboutToBeDeletedLocally(true);
    };

    const handleRestore = () => {
        onRestore(itemId);
        setIsAboutToBeDeletedLocally(false);
    };

    return (
        <TreeItemProvider itemId={itemId} id={id}>
            <TreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()}>
                    <TreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </TreeItemIconContainer>
                    <TreeItemCheckbox {...getCheckboxProps()} />
                    <Box
                        sx={{
                            py: 1,
                            pr: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <Box onClick={handleSelectionClick}>
                            {isAboutToBeDeletedLocally || isParentAboutToBeDeleted ? (
                                <>
                                    <Typography
                                        component="div"
                                        className={treeItemClasses.label}
                                        sx={{ color: 'text.disabled' }}
                                    >
                                        {`${label} (${t('messages.deleted')})`}
                                    </Typography>
                                    {hasValue && (
                                        <TextSnippet fontSize="small" sx={{ color: 'text.disabled', ml: '3px' }} />
                                    )}
                                </>
                            ) : (
                                <>
                                    <Typography component="div" className={treeItemClasses.label}>
                                        {label}
                                    </Typography>
                                    {hasValue && (
                                        <TextSnippet fontSize="small" sx={{ color: 'text.secondary', ml: '3px' }} />
                                    )}
                                </>
                            )}
                        </Box>
                        <TemplateEditTreeItemMenu
                            elementMultiplicity={multiplicity}
                            numberOfThisElement={getNumberOfElementsWithSameSemanticId(semanticId)}
                            onDuplicate={onDuplicate}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                            nodeId={itemId}
                            isElementAboutToBeDeleted={isAboutToBeDeleted || isAboutToBeDeletedLocally}
                            isParentAboutToBeDeleted={isParentAboutToBeDeleted}
                        />
                    </Box>
                </CustomTreeItemContent>
                {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
            </TreeItemRoot>
        </TreeItemProvider>
    );
});

export const TemplateEditTreeItem = (props: CustomTreeItemProps) => {
    return <CustomContent {...props} />;
};
