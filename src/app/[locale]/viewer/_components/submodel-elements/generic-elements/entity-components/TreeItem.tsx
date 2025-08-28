import * as React from 'react';
import { Box, Theme, Typography, useTheme } from '@mui/material';
import { treeItemClasses, UseTreeItemParameters } from '@mui/x-tree-view';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';

interface ExpandableTreeItemContentProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        React.HTMLAttributes<HTMLLIElement> {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelInfo?: string;
    dataIcon: React.JSX.Element;
}

export const getTreeItemStyle = (theme: Theme) => ({
    [`& .${treeItemClasses.content}`]: {
        userSelect: 'none',
        margin: 0,
        borderBottom: '1px solid !important',
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
    const { label, dataIcon } = props;

    return (
        <>
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
                    className={treeItemClasses.label}
                >
                    {label}
                </Typography>
            </Box>
        </>
    );
});
