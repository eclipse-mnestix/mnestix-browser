import React from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import {
    DataSpecificationIec61360,
    IAbstractLangString,
    ISubmodelElement,
    MultiLanguageProperty,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { ConceptDescription } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { getTranslationText } from 'lib/util/SubmodelResolverUtil';
import { useLocale } from 'next-intl';

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
        const locale = useLocale();

        /**
         * The Standardized way to get the best label for a submodel element as defined by the IDTA.
         * The order of preference is: submodelElement.displayName, conceptDescription.preferredName, conceptDescription.shortName, submodelElement.idShort.
         */
        const getBestLabel = () => {
            if (props.submodelElement.displayName) {
                const langString = props.submodelElement.displayName;
                return getTranslationText(langString, locale);
            }

            if (props.conceptDescription?.embeddedDataSpecifications?.[0].dataSpecificationContent) {
                const iec61360Content = getDataSpecContent();
                let langString: MultiLanguageProperty | IAbstractLangString[] | undefined = [];

                if (iec61360Content && iec61360Content.preferredName) {
                    langString = iec61360Content.preferredName;
                } else if (iec61360Content && iec61360Content.shortName) {
                    langString = iec61360Content.shortName;
                }
                const translatedString = getTranslationText(langString, locale);
                if (translatedString.trim()) {
                    return translatedString;
                }
            }

            if (props.submodelElement.idShort) {
                return props.submodelElement.idShort;
            }
            return 'Not available';
        };

        const getDataSpecContent = (): DataSpecificationIec61360 | null => {
            if (props.conceptDescription?.embeddedDataSpecifications?.[0]?.dataSpecificationContent) {
                const dataSpecContent = props.conceptDescription.embeddedDataSpecifications[0].dataSpecificationContent;
                if (isDataSpecificationIec61360(dataSpecContent)) {
                    return dataSpecContent;
                }
            }
            return null;
        };

        /**
         * Type guard to check if the content is a DataSpecificationIec61360.
         */
        const isDataSpecificationIec61360 = (content: unknown): content is DataSpecificationIec61360 => {
            return (
                typeof content === 'object' &&
                content !== null &&
                ('preferredName' in content || 'shortName' in content || 'unit' in content)
            );
        };

        const getUnit = () => {
            const dataSpecContent = getDataSpecContent();
            if (dataSpecContent) {
                return dataSpecContent.unit;
            }
            return '';
        };

        return (
            <>
                <Box display="flex" flexDirection="row" mt={0.5} minHeight="30px">
                    <Box component="span" sx={{ width: '50%' }}>
                        {props.conceptDescriptionLoading ? props.submodelElement.idShort : getBestLabel()}
                    </Box>
                    <Box width="30%">{props.children}</Box>
                    {props.conceptDescriptionLoading ? (
                        <Skeleton width="20%" />
                    ) : (
                        props.conceptDescription &&
                        props.conceptDescription.embeddedDataSpecifications?.[0]?.dataSpecificationContent && (
                            <Box component="span" sx={{ width: '20%' }}>
                                {getUnit()}
                            </Box>
                        )
                    )}
                </Box>
                <Divider />
            </>
        );
    },
);
