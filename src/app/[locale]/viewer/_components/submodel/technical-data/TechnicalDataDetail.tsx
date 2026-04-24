import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.technicalData');
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>('technicalProperties');

    const findSubmodelElementBySemanticIdOrIdShort = (semanticId: SubmodelElementSemanticIdEnum, idShort: string) =>
        submodel.submodelElements?.find((el) => hasSemanticId(el, semanticId) || el.idShort === idShort) as
            | SubmodelElementCollection
            | undefined;

    const generalInformation = findSubmodelElementBySemanticIdOrIdShort(
        SubmodelElementSemanticIdEnum.GeneralInformation,
        'GeneralInformation',
    );
    const technicalData = findSubmodelElementBySemanticIdOrIdShort(
        SubmodelElementSemanticIdEnum.TechnicalProperties,
        'TechnicalProperties',
    );
    const productClassifications = findSubmodelElementBySemanticIdOrIdShort(
        SubmodelElementSemanticIdEnum.ProductClassifications,
        'ProductClassifications',
    );
    const furtherInformation = findSubmodelElementBySemanticIdOrIdShort(
        SubmodelElementSemanticIdEnum.FurtherInformation,
        'FurtherInformation',
    );

    const cannotRenderTechnicalData =
        !generalInformation && !technicalData && !productClassifications && !furtherInformation;

    const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    return (
        <Box data-testid="technical-data-detail" sx={{ width: '100%' }}>
            {cannotRenderTechnicalData ? (
                <GenericSubmodelDetailComponent submodel={submodel} />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {technicalData?.value && (
                        <Accordion
                            expanded={expandedAccordion === 'technicalProperties'}
                            onChange={handleAccordionChange('technicalProperties')}
                            defaultExpanded
                            sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('technicalProperties')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{ backgroundColor: '#fafafa', width: '100%', boxSizing: 'border-box' }}
                            >
                                <TechnicalDataElement
                                    label="technicalProperties"
                                    header={t('technicalProperties')}
                                    elements={technicalData.value}
                                    submodelId={submodel.id}
                                    isExpanded={expandedAccordion === 'technicalProperties'}
                                    showUnits={true}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {generalInformation?.value && (
                        <Accordion
                            expanded={expandedAccordion === 'generalInformation'}
                            onChange={handleAccordionChange('generalInformation')}
                            sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('generalInformation')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{ backgroundColor: '#fafafa', width: '100%', boxSizing: 'border-box' }}
                            >
                                <TechnicalDataElement
                                    label="generalInformation"
                                    header={t('generalInformation')}
                                    elements={generalInformation.value}
                                    submodelId={submodel.id}
                                    isExpanded={expandedAccordion === 'generalInformation'}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {productClassifications?.value && (
                        <Accordion
                            expanded={expandedAccordion === 'productClassifications'}
                            onChange={handleAccordionChange('productClassifications')}
                            sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('productClassification')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{ backgroundColor: '#fafafa', width: '100%', boxSizing: 'border-box' }}
                            >
                                <TechnicalDataElement
                                    label="productClassifications"
                                    header={t('productClassification')}
                                    elements={productClassifications.value}
                                    submodelId={submodel.id}
                                    isExpanded={expandedAccordion === 'productClassifications'}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {furtherInformation?.value && (
                        <Accordion
                            expanded={expandedAccordion === 'furtherInformation'}
                            onChange={handleAccordionChange('furtherInformation')}
                            sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', '&:before': { display: 'none' } }}
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('furtherInformation')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{ backgroundColor: '#fafafa', width: '100%', boxSizing: 'border-box' }}
                            >
                                <TechnicalDataElement
                                    label="furtherInformation"
                                    header={t('furtherInformation')}
                                    elements={furtherInformation.value}
                                    submodelId={submodel.id}
                                    isExpanded={expandedAccordion === 'furtherInformation'}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Box>
            )}
        </Box>
    );
}
