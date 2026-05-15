import { Box, Typography } from '@mui/material';
import React from 'react';

type HeadingProps = {
    readonly title: React.ReactNode;
    readonly subtitle?: React.ReactNode;
};

export function ViewHeading(props: HeadingProps) {
    return (
        <Box>
            <Typography variant="h2" color="primary" sx={{ mb: 1 }}>
                {props.title}
            </Typography>
            {!!props.subtitle && <Typography sx={{
                color: 'text.secondary'
            }}>{props.subtitle}</Typography>}
        </Box>
    );
}
