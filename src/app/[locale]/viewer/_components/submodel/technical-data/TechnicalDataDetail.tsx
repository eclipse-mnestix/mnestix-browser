import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';
import { SimpleTreeView } from '@mui/x-tree-view';
import { getDisplayNameForLocale, hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { SubmodelElementCollection } from 'lib/api/aas/models';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TechnicalDataElement } from 'app/[locale]/viewer/_components/submodel/technical-data/TechnicalDataElement';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.technicalData');
    const locale = useLocale();
    const [expandedItems, setExpandedItems] = useState<string[]>(['technicalProperties']);

    const findSubmodelElementBySemanticIdOrIdShort = (
        semanticIds: SubmodelElementSemanticIdEnum[],
        idShorts: string[],
    ) =>
        submodel.submodelElements?.find(
            (el) => hasSemanticId(el, ...semanticIds) || (el.idShort ? idShorts.includes(el.idShort) : false),
        ) as SubmodelElementCollection | undefined;

    const generalInformation = findSubmodelElementBySemanticIdOrIdShort(
        [SubmodelElementSemanticIdEnum.GeneralInformation, SubmodelElementSemanticIdEnum.GeneralInformationV20],
        ['GeneralInformation'],
    );
    const technicalData = findSubmodelElementBySemanticIdOrIdShort(
        [SubmodelElementSemanticIdEnum.TechnicalProperties, SubmodelElementSemanticIdEnum.TechnicalPropertyAreasV20],
        ['TechnicalProperties', 'TechnicalPropertyAreas'],
    );
    const productClassifications = findSubmodelElementBySemanticIdOrIdShort(
        [SubmodelElementSemanticIdEnum.ProductClassifications, SubmodelElementSemanticIdEnum.ProductClassificationsV20],
        ['ProductClassifications'],
    );
    const furtherInformation = findSubmodelElementBySemanticIdOrIdShort(
        [SubmodelElementSemanticIdEnum.FurtherInformation, SubmodelElementSemanticIdEnum.FurtherInformationV20],
        ['FurtherInformation'],
    );

    const cannotRenderTechnicalData =
        !generalInformation && !technicalData && !productClassifications && !furtherInformation;

    // The technical properties collection can have a battery-passport specific idShort/displayName
    // (e.g. "TechnicalPerformanceAnalysis") while sharing the standard semanticId, so we prefer its
    // own displayName, falling back to the idShort and finally to the generic translated label.
    const technicalPropertiesHeader =
        getDisplayNameForLocale(technicalData?.displayName, locale) ??
        technicalData?.idShort ??
        t('technicalProperties');

    return (
        <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
        >
            {technicalData?.value && (
                <TechnicalDataElement
                    label="technicalProperties"
                    header={technicalPropertiesHeader}
                    elements={technicalData.value}
                    submodelId={submodel.id}
                    isExpanded={true}
                    showUnits={true}
                />
            )}
            {generalInformation?.value && (
                <TechnicalDataElement
                    label="generalInformation"
                    header={t('generalInformation')}
                    elements={generalInformation.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('generalInformation')}
                />
            )}
            {productClassifications?.value && (
                <TechnicalDataElement
                    label="productClassifications"
                    header={t('productClassification')}
                    elements={productClassifications.value}
                    submodelId={submodel.id}
                    isExpanded={expandedItems.includes('productClassifications')}
                />
            )}
            {furtherInformation?.value && (
                <TechnicalDataElement
                    label="furtherInformation"
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
