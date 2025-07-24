import * as React from 'react';
import { Box, Theme, Typography, useTheme } from '@mui/material';
import { TreeItemContentProps, TreeItemProps } from '@mui/x-tree-view';
import { SubmodelElementChoice } from 'lib/api/aas/models';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';

export interface CustomTreeItemProps extends TreeItemProps {
    data?: SubmodelElementChoice;
}

export interface CustomTreeItemContentProps extends TreeItemContentProps {
    data?: SubmodelElementChoice;
}

export interface ExpandableTreeItemContentProps extends TreeItemContentProps {
    icon: React.ReactNode;
    dataIcon: React.JSX.Element;
}

export const getTreeItemStyle = (theme: Theme) => ({
    '.MuiTreeItem-content': {
        userSelect: 'none',
        margin: 0,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
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
});

export const ExpandableTreeitem = React.forwardRef(function CustomContent(props: ExpandableTreeItemContentProps, _ref) {
    const theme = useTheme();
    const { classes, label, icon: iconProp, expansionIcon, displayIcon, dataIcon } = props;

    const toggleIcon = iconProp || expansionIcon || displayIcon;
    return (
        <>
            <Box data-testid="expand-entity-icon" className={classes.iconContainer} sx={{ py: 1 }}>
                {toggleIcon}
            </Box>
            <Box
                sx={{
                    [theme.breakpoints.down(480)]: {
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
                display="flex"
                alignItems="center"
            >
                <IconCircleWrapper>{dataIcon}</IconCircleWrapper>
                <Typography
                    component="div"
                    sx={{
                        py: 2,
                        pr: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    className={classes.label}
                >
                    {label}
                </Typography>
            </Box>
        </>
    );
});
