import * as React from 'react';
import { treeItemClasses, TreeItemRoot } from '@mui/x-tree-view';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';
import { TextSnippet } from '@mui/icons-material';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { BlueprintEditTreeItemMenu } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditTreeItemMenu';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
    TreeItemCheckbox,
    TreeItemContent,
    TreeItemGroupTransition,
    TreeItemIconContainer,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
    userSelect: 'none',
    '&[data-expanded]': {
        backgroundColor: 'transparent',
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&[data-focused], &[data-selected], &[data-selected][data-focused]': {
        backgroundColor: theme.palette.action.selected,
    },
}));

interface CustomTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
    hasValue?: boolean;
    customOnSelect: () => void;
    multiplicity: MultiplicityEnum | undefined;
    onDuplicate: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    getNumberOfElementsWithSameSemanticId: (semanticId: string | undefined) => number;
    semanticId: string | undefined;
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

    React.useEffect(() => {
        // Trigger the customOnSelect initially for the first selected element, so the edit fields are displayed
        if (status.selected) {
            customOnSelect();
        }
    }, []);

    const handleSelectionClick = () => {
        customOnSelect();
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
                        onClick={handleSelectionClick}
                    >
                        <Box display="flex">
                            <Typography component="div" className={treeItemClasses.label}>
                                {label}
                            </Typography>
                            {hasValue && (
                                <TextSnippet fontSize="small" sx={{ color: 'text.secondary', ml: '3px' }} />
                            )}
                        </Box>
                        <BlueprintEditTreeItemMenu
                            elementMultiplicity={multiplicity}
                            numberOfThisElement={getNumberOfElementsWithSameSemanticId(semanticId)}
                            onDuplicate={onDuplicate}
                            onDelete={onDelete}
                            nodeId={itemId}
                        />
                    </Box>
                </CustomTreeItemContent>
                {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
            </TreeItemRoot>
        </TreeItemProvider>
    );
});

export const BlueprintEditTreeItem = (props: CustomTreeItemProps) => {
    return <CustomContent {...props} />;
};
