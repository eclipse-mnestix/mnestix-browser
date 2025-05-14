import * as React from 'react';
import { useState } from 'react';
import { TreeItem, TreeItemProps, useTreeItemState } from '@mui/x-tree-view';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';
import { TextSnippet } from '@mui/icons-material';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { TemplateEditTreeItemMenu } from './TemplateEditTreeItemMenu';
import { useTranslations } from 'next-intl';

interface CustomTreeItemProps extends TreeItemProps {
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
        '&.data-focused': {
            backgroundColor: 'transparent',
        },
        '&.data-focused:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.data-focused.data-selected': {
            backgroundColor: theme.palette.action.selected,
        },
    },
}));

const CustomContent = React.forwardRef(function CustomContent(props: CustomTreeItemProps, ref) {
    const {
        classes,
        className,
        label,
        itemId,
        hasValue,
        customOnSelect,
        multiplicity,
        getNumberOfElementsWithSameSemanticId,
        semanticId,
        slots,
    } = props;

    const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } =
        useTreeItemState(itemId);

    const icon = slots?.icon || slots?.expandIcon || displayIcon;

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
        if (selected) {
            customOnSelect();
        }
    }, []);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        customOnSelect();
        handleSelection(event);
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
        <Box
            className={clsx(className, classes?.root, {
                ['data-expanded']: expanded,
                ['data-selected']: selected,
                ['data-focused']: focused,
                ['data-disabled']: disabled,
            })}
            onMouseDown={handleMouseDown}
            ref={ref as React.Ref<HTMLDivElement>}
        >
            <Box onClick={handleExpansionClick} className={classes?.iconContainer} sx={{ py: 1 }}>
                {icon}
            </Box>
            <Box onClick={handleSelectionClick} display="flex" sx={{ width: '100%' }}>
                <Box sx={{ py: 1, pr: 1, display: 'flex' }} onClick={handleSelectionClick}>
                    {isAboutToBeDeleted || props.isParentAboutToBeDeleted ? (
                        <>
                            <Typography component="div" className={classes?.label} sx={{ color: 'text.disabled' }}>
                                {`${label} (${t('messages.deleted')})`}
                            </Typography>
                            {hasValue && <TextSnippet fontSize="small" sx={{ color: 'text.disabled', ml: '3px' }} />}
                        </>
                    ) : (
                        <>
                            <Typography component="div" className={classes?.label}>
                                {label}
                            </Typography>
                            {hasValue && <TextSnippet fontSize="small" sx={{ color: 'text.secondary', ml: '3px' }} />}
                        </>
                    )}
                </Box>
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
    );
});

export const TemplateEditTreeItem = (props: CustomTreeItemProps) => {
    const {
        customOnSelect,
        hasValue,
        multiplicity,
        onDuplicate,
        onDelete,
        onRestore,
        getNumberOfElementsWithSameSemanticId,
        semanticId,
        isParentAboutToBeDeleted,
        isAboutToBeDeleted,
        ...other
    } = props;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
        <StyledTreeItem
            slots={{
                content: CustomContent,
            }}
            slotProps={{
                content: {
                    customOnSelect,
                    hasValue,
                    multiplicity,
                    onDuplicate,
                    onDelete,
                    onRestore,
                    getNumberOfElementsWithSameSemanticId,
                    semanticId,
                    isParentAboutToBeDeleted,
                    isAboutToBeDeleted,
                } as any,
            }}
            {...other}
        />
    );
};
