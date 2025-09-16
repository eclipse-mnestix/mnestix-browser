import * as React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { treeItemClasses, UseTreeItemParameters } from '@mui/x-tree-view';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';

interface ExpandableTreeItemContentProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        React.HTMLAttributes<HTMLLIElement> {
    dataIcon: React.JSX.Element;
}

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
                    data-testid="tree-item-label"
                >
                    {label}
                </Typography>
            </Box>
        </>
    );
});
