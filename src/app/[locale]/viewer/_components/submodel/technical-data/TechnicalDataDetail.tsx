import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { SimpleTreeView } from '@mui/x-tree-view';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import {
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';
import {
    GenericSubmodelDetailComponent
} from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { Box, IconButton, Tooltip } from '@mui/material';
import { UnfoldLess, UnfoldMore, Search } from '@mui/icons-material';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.technicalData');
    const [expandedItems, setExpandedItems] = useState<string[]>(['technicalProperties']);

    const findSubmodelElementBySemanticIdOrIdShort = (semanticId: SubmodelElementSemanticIdEnum, idShort: string) =>
        submodel.submodelElements?.find((el) => hasSemanticId(el, semanticId) || el.idShort === idShort) as SubmodelElementCollection | undefined;

    const generalInformation = findSubmodelElementBySemanticIdOrIdShort(SubmodelElementSemanticIdEnum.GeneralInformation, 'GeneralInformation');
    const technicalData = findSubmodelElementBySemanticIdOrIdShort(SubmodelElementSemanticIdEnum.TechnicalProperties, 'TechnicalProperties');
    const productClassifications = findSubmodelElementBySemanticIdOrIdShort(SubmodelElementSemanticIdEnum.ProductClassifications, 'ProductClassifications');
    const furtherInformation = findSubmodelElementBySemanticIdOrIdShort(SubmodelElementSemanticIdEnum.FurtherInformation, 'FurtherInformation');

    const cannotRenderTechnicalData = !generalInformation && !technicalData && !productClassifications && !furtherInformation;

    const allSectionIds = useMemo(() => {
        const ids: string[] = [];
        if (technicalData?.value) ids.push('technicalProperties');
        if (generalInformation?.value) ids.push('generalInformation');
        if (productClassifications?.value) ids.push('productClassifications');
        if (furtherInformation?.value) ids.push('furtherInformation');
        return ids;
    }, [technicalData, generalInformation, productClassifications, furtherInformation]);

    function handleExpandAll() {
        setExpandedItems(allSectionIds);
    }

    function handleCollapseAll() {
        setExpandedItems([]);
    }

    return (
        <Box>
            {!cannotRenderTechnicalData && (
                <Box display='flex' justifyContent='flex-end' mb={1}>
                    <Tooltip title={t('expandAll')}>
                        <IconButton
                            aria-label={t('expandAll')}
                            onClick={handleExpandAll}
                            size='small'
                            data-testid='expand-all-button'
                        >
                            <UnfoldMore />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('collapseAll')}>
                        <IconButton
                            aria-label={t('collapseAll')}
                            onClick={handleCollapseAll}
                            size='small'
                            data-testid='collapse-all-button'
                        >
                            <UnfoldLess />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('search')}>
                        <IconButton
                            aria-label={t('search')}
                            size='small'
                            data-testid='search-button'
                        >
                            <Search />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            <SimpleTreeView expandedItems={expandedItems} onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}>
                {technicalData?.value && (
                    <TechnicalDataElement
                        label='technicalProperties'
                        header={t('technicalProperties')}
                        elements={technicalData.value}
                        submodelId={submodel.id}
                        isExpanded={expandedItems.includes('technicalProperties')}
                        showUnits={true}
                    />
                )}
                {generalInformation?.value && (
                    <TechnicalDataElement
                        label='generalInformation'
                        header={t('generalInformation')}
                        elements={generalInformation.value}
                        submodelId={submodel.id}
                        isExpanded={expandedItems.includes('generalInformation')}
                    />
                )}
                {productClassifications?.value && (
                    <TechnicalDataElement
                        label='productClassifications'
                        header={t('productClassification')}
                        elements={productClassifications.value}
                        submodelId={submodel.id}
                        isExpanded={expandedItems.includes('productClassifications')}
                    />
                )}
                {furtherInformation?.value && (
                    <TechnicalDataElement
                        label='furtherInformation'
                        header={t('furtherInformation')}
                        elements={furtherInformation.value}
                        submodelId={submodel.id}
                        isExpanded={expandedItems.includes('furtherInformation')}
                    />
                )}
                {cannotRenderTechnicalData && <GenericSubmodelDetailComponent submodel={submodel} />}
            </SimpleTreeView>
        </Box>
    );
}

