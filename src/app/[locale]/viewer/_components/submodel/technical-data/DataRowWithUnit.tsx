import React from 'react';
import { Box, Divider, Skeleton } from '@mui/material';

/**
 * DataRowWithUnit is a component that displays a label, a value, and a unit.
 * The unit is loaded from the ConceptDescription API (if available) based on the provided cpSemanticId.
 */
export const DataRowWithUnit = React.memo((props: { label: string; children: React.ReactNode; unit?: string, conceptDescriptionLoading?: boolean }) => {
    return (
        <>
            <Box display="flex" flexDirection="row" mt={0.5} minHeight="30px">
                <Box component="span" sx={{ width: '50%' }}>
                    {props.label}
                </Box>
                <Box width="30%">{props.children}</Box>
                {props.conceptDescriptionLoading ? (
                    <Skeleton width="20%" />
                ) : (
                props.unit && (
                    <Box component="span" sx={{ width: '20%' }}>
                        {props.unit}
                    </Box>
                ))}
            </Box>
            <Divider />
        </>
    );
});
