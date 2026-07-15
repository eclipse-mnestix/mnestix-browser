import React from 'react';
import { Box, Divider } from '@mui/material';
import { SubmodelElementChoice, ConceptDescription } from 'lib/api/aas/models';
import { useBestLabelForSmElement } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionHelper';
import { ConceptDescriptionInfoButton } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionInfoButton';

/**
 * DataRowWithUnit is a component that displays a label, a value, and a unit.
 * The label is selected from the submodel element or concept description, based on availability.
 * The unit display is now handled by the GenericPropertyComponent.
 */
export const DataRowWithUnit = React.memo(
    (props: {
        submodelElement: SubmodelElementChoice;
        children: React.ReactNode;
        conceptDescription?: ConceptDescription;
        conceptDescriptionLoading?: boolean;
    }) => {
        const label = useBestLabelForSmElement(props.submodelElement, props.conceptDescription);

        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'relative',
                        mt: 1,
                        minHeight: '30px',
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontWeight: '600',
                            width: '60%',
                            wordBreak: 'break-word',
                        }}
                    >
                        {props.conceptDescriptionLoading ? props.submodelElement.idShort : label}
                    </Box>
                    <Box
                        sx={{
                            width: '40%',
                            display: 'flex',
                            alignItems: 'center',
                            pr: props.conceptDescription ? 4 : 0,
                        }}
                    >
                        {props.children}
                    </Box>
                    {props.conceptDescription && (
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ConceptDescriptionInfoButton conceptDescription={props.conceptDescription} />
                        </Box>
                    )}
                </Box>
                <Divider />
            </>
        );
    },
);
