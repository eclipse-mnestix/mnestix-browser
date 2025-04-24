import React, { useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getConceptDescriptionById } from 'lib/services/conceptDescriptionApiActions';
import { Box, Divider, Skeleton } from '@mui/material';
import { useEnv } from 'app/EnvProvider';

/**
 * DataRowWithUnit is a component that displays a label, a value, and a unit.
 * The unit is loaded from the ConceptDescription API (if available) based on the provided cpSemanticId.
 */
export const DataRowWithUnit = (props: { label: string; children: React.ReactNode; cpSemanticId?: string }) => {
    const [unit, setUnit] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const env = useEnv();

    // TODO this could be a custom hook which returns the conceptDescription -> could be reused in the other submodel visualizations
    useAsyncEffect(async () => {
        if (!props.cpSemanticId || !env.CONCEPT_DESCRIPTION_REPO_API_URL) {
            setIsLoading(false);
            return;
        }

        try {
            const cp = await getConceptDescriptionById(props.cpSemanticId);
            // @ts-expect-error ConceptDescription can have a unit, check if of type DataSpecificationIec61360
            if (cp.isSuccess && cp.result?.embeddedDataSpecifications?.[0]?.dataSpecificationContent.unit) {
                // @ts-expect-error ConceptDescription can have a unit, check if of type DataSpecificationIec61360
                setUnit(cp.result.embeddedDataSpecifications[0].dataSpecificationContent.unit);
            }
        } finally {
            setIsLoading(false);
        }
    }, [props.cpSemanticId]);

    return (
        <>
            <Box display="flex" flexDirection="row" mt={0.5} minHeight="30px">
                <Box component="span" sx={{ width: '50%' }}>
                    {props.label}
                </Box>
                <Box width="30%">{props.children}</Box>
                {isLoading ? (
                    <Skeleton width="20%" />
                ) : (
                    unit && (
                        <Box component="span" sx={{ width: '20%' }}>
                            {unit}
                        </Box>
                    )
                )}
            </Box>
            <Divider />
        </>
    );
};