import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button, Stack } from '@mui/material';
import { ExpandMore, UnfoldLess, UnfoldMore, Search } from '@mui/icons-material';

/**
 * TechnicalDataDetail
 * Renders the technical data submodel with controls to expand/collapse all sections and a placeholder search button.
 */
export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.technicalData');
    // allow multiple accordions to be expanded
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['technicalProperties']);
    // track expanded items including nested collection idShorts (used by tests / nested expansion)
    const [expandedItems, setExpandedItems] = useState<string[]>(['technicalProperties']);

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

    const isPanelExpanded = function (panel: string) {
        return expandedAccordions.includes(panel);
    };

    const handleAccordionChange = function (panel: string) {
        return (_event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedAccordions((prev) => {
                if (isExpanded) {
                    return Array.from(new Set([...prev, panel]));
                }
                return prev.filter((p) => p !== panel);
            });

            setExpandedItems((prev) => {
                if (isExpanded) {
                    return Array.from(new Set([...prev, panel]));
                }
                return prev.filter((p) => p !== panel);
            });
        };
    };

    type SMElement = { idShort?: string | null; modelType?: string; value?: unknown };
    const gatherNestedIdShorts = function (elements: SMElement[] | undefined): string[] {
        const result: string[] = [];
        if (!elements || !Array.isArray(elements)) return result;
        for (const el of elements) {
            if (el && typeof el === 'object') {
                const idShort = el.idShort;
                const modelType = el.modelType;
                const value = el.value;
                if (idShort && modelType === 'SubmodelElementCollection') {
                    result.push(idShort);
                    if (Array.isArray(value)) {
                        result.push(...gatherNestedIdShorts(value as SMElement[]));
                    }
                }
                if (value && Array.isArray(value)) {
                    result.push(...gatherNestedIdShorts(value as SMElement[]));
                }
            }
        }
        return result;
    };

    const expandAll = function () {
        const panels: string[] = [];
        if (technicalData?.value) panels.push('technicalProperties');
        if (generalInformation?.value) panels.push('generalInformation');
        if (productClassifications?.value) panels.push('productClassifications');
        if (furtherInformation?.value) panels.push('furtherInformation');

        // collect nested idShorts from all present collections
        const nested: string[] = [];
        if (technicalData?.value) nested.push(...gatherNestedIdShorts(technicalData.value as unknown as SMElement[]));
        if (generalInformation?.value) nested.push(...gatherNestedIdShorts(generalInformation.value as unknown as SMElement[]));
        if (productClassifications?.value) nested.push(...gatherNestedIdShorts(productClassifications.value as unknown as SMElement[]));
        if (furtherInformation?.value) nested.push(...gatherNestedIdShorts(furtherInformation.value as unknown as SMElement[]));

        setExpandedAccordions(panels);
        setExpandedItems(Array.from(new Set([...panels, ...nested])));
    };

    const collapseAll = function () {
        setExpandedAccordions([]);
        setExpandedItems([]);
    };

    return (
        <Box data-testid="technical-data-detail" data-expanded-items={JSON.stringify(expandedItems)} sx={{ width: '100%' }}>
            {cannotRenderTechnicalData ? (
                <GenericSubmodelDetailComponent submodel={submodel} />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', alignSelf: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={collapseAll}
                            data-testid="collapse-all-button"
                            aria-label={t('collapseAll')}
                            startIcon={<UnfoldLess />}
                        >
                            {t('collapseAll')}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={expandAll}
                            data-testid="expand-all-button"
                            aria-label={t('expandAll')}
                            startIcon={<UnfoldMore />}
                        >
                            {t('expandAll')}
                        </Button>
                        <Button
                            variant="outlined"
                            disabled
                            data-testid="search-button"
                            aria-label={t('search')}
                            startIcon={<Search />}
                        >
                            {t('search')}
                        </Button>
                    </Stack>
                    {technicalData?.value && (
                        <Accordion
                            expanded={isPanelExpanded('technicalProperties')}
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
                                    isExpanded={isPanelExpanded('technicalProperties')}
                                    showUnits={true}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {generalInformation?.value && (
                        <Accordion
                            expanded={isPanelExpanded('generalInformation')}
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
                                    isExpanded={isPanelExpanded('generalInformation')}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {productClassifications?.value && (
                        <Accordion
                            expanded={isPanelExpanded('productClassifications')}
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
                                    isExpanded={isPanelExpanded('productClassifications')}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {furtherInformation?.value && (
                        <Accordion
                            expanded={isPanelExpanded('furtherInformation')}
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
                                    isExpanded={isPanelExpanded('furtherInformation')}
                                />
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Box>
            )}
        </Box>
    );
}
