import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { SimpleTreeView } from '@mui/x-tree-view';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import {
    SubmodelElementCollection,
} from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';
import {
    GenericSubmodelDetailComponent
} from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';

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

    return (
        <SimpleTreeView expandedItems={expandedItems} onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}>
            {technicalData?.value && (
                <TechnicalDataElement
                    label='technicalProperties'
                    header={t('technicalProperties')}
                    elements={technicalData.value}
                    submodelId={submodel.id}
                    isExpanded={true}
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
    );
}

