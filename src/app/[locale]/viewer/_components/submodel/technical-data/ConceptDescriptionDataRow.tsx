import React from 'react';
import { Box, Divider } from '@mui/material';
import { ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { useBestLabelForSmElement } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionHelper';

/**
 * DataRowWithUnit is a component that displays a label, a value, and a unit.
 * The label is selected from the submodel element or concept description, based on availability.
 * The unit display is now handled by the GenericPropertyComponent.
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
                    <Box component="span" sx={{ width: '60%', wordBreak: 'break-word' }} fontWeight="600">
                        {props.conceptDescriptionLoading ? props.submodelElement.idShort : label}
                    </Box>
                    <Box width="40%" display={'flex'} alignItems="center">
                        {props.children}
                    </Box>
                </Box>
                <Divider />
            </>
        );
    },
);
