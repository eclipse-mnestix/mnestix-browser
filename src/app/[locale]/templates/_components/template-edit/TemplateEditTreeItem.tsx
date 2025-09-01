import * as React from 'react';
import { useState } from 'react';
import { TreeItem, treeItemClasses, TreeItemRoot } from '@mui/x-tree-view';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';
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

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
    '.MuiTreeItem-content': {
        userSelect: 'none',
        margin: 0,
        '&.Mui-focused': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
        },
    },
}));

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

    const [isAboutToBeDeleted, setIsAboutToBeDeleted] = useState(false);
    const t = useTranslations('pages.templates');

    React.useEffect(() => {
        setIsAboutToBeDeleted(false);
    }, [label, semanticId]);

    React.useEffect(() => {
        if (props.isAboutToBeDeleted) {
            setIsAboutToBeDeleted(true);
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

    const onDelete = () => {
        props.onDelete(itemId);
        setIsAboutToBeDeleted(true);
    };

    const onRestore = () => {
        props.onRestore(itemId);
        setIsAboutToBeDeleted(false);
    };

    return (
        <TreeItemProvider itemId={itemId} id={id}>
            <TreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()}>
                    <TreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </TreeItemIconContainer>
                    <TreeItemCheckbox {...getCheckboxProps()} />
                    <Box sx={{ py: 1, pr: 1, display: 'flex' }}>
                        <Box onClick={handleSelectionClick}>
                            {isAboutToBeDeleted || props.isParentAboutToBeDeleted ? (
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
                            onDuplicate={props.onDuplicate}
                            onDelete={onDelete}
                            onRestore={onRestore}
                            nodeId={itemId}
                            isElementAboutToBeDeleted={props.isAboutToBeDeleted || isAboutToBeDeleted}
                            isParentAboutToBeDeleted={props.isParentAboutToBeDeleted}
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
