import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { SimpleTreeView } from '@mui/x-tree-view';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import {
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.technicalData');
    const [expandedItems, setExpandedItems] = useState<string[]>(['technicalProperties']);

    const findSubmodelElement = (semanticId: SubmodelElementSemanticIdEnum) =>
        submodel.submodelElements?.find((el) => hasSemanticId(el, semanticId)) as SubmodelElementCollection | undefined;

    const generalInformation = findSubmodelElement(SubmodelElementSemanticIdEnum.GeneralInformation);
    const technicalData = findSubmodelElement(SubmodelElementSemanticIdEnum.TechnicalProperties);
    const productClassifications = findSubmodelElement(SubmodelElementSemanticIdEnum.ProductClassifications);
    const furtherInformation = findSubmodelElement(SubmodelElementSemanticIdEnum.FurtherInformation);

    return (
        <SimpleTreeView defaultExpandedItems={['technicalProperties']} onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}>
            {technicalData?.value && (
                <TechnicalDataElement
                    label={'technicalProperties'}
                    header={t('technicalProperties')}
                    elements={technicalData.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('technicalProperties')}
                />
            )}
            {generalInformation?.value && (
                <TechnicalDataElement
                    label={'generalInformation'}
                    header={t('generalInformation')}
                    elements={generalInformation.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('generalInformation')}
                />
            )}
            {productClassifications?.value && (
                <TechnicalDataElement
                    label={'productClassifications'}
                    header={t('productClassification')}
                    elements={productClassifications.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('productClassifications')}
                />
            )}
            {furtherInformation?.value && (
                <TechnicalDataElement
                    label={'furtherInformation'}
                    header={t('furtherInformation')}
                    elements={furtherInformation.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('furtherInformation')}
                />
            )}
        </SimpleTreeView>
    );
}

