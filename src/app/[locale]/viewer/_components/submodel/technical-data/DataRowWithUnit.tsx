import React from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import { ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import {
    useBestLabelForSmElement,
    getUnitFromConceptDescription,
} from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionHelper';

/**
 * DataRowWithUnit is a component that displays a label, a value, and a unit.
 * The label is selected from the submodel element or concept description, based on availability.
 */
export const DataRowWithUnit = React.memo(
    (props: {
        submodelElement: ISubmodelElement;
        children: React.ReactNode;
        conceptDescription?: ConceptDescription;
        conceptDescriptionLoading?: boolean;
    }) => {
        const label = useBestLabelForSmElement(props.submodelElement, props.conceptDescription);

        return (
            <>
                <Box display="flex" flexDirection="row" mt={1} minHeight="30px">
                    <Box component="span" sx={{ width: '50%', wordBreak: 'break-word' }} fontWeight="600">
                        {props.conceptDescriptionLoading ? props.submodelElement.idShort : label}
                    </Box>
                    <Box width="30%">{props.children}</Box>
                    {props.conceptDescriptionLoading ? (
                        <Skeleton width="20%" />
                    ) : (
                        props.conceptDescription &&
                        props.conceptDescription.embeddedDataSpecifications?.[0]?.dataSpecificationContent && (
                            <Box component="span" sx={{ width: '20%' }}>
                                {getUnitFromConceptDescription(props.conceptDescription)}
                            </Box>
                        )
                    )}
                </Box>
                <Divider />
            </>
        );
    },
);
