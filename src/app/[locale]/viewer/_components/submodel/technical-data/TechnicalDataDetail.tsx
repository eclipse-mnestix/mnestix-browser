import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { MultiLanguagePropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/MultiLanguagePropertyComponent';
import { Box, Divider, Typography, useTheme } from '@mui/material';
import {
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import { PropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/PropertyComponent';
import { SubmodelElementList } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import React from 'react';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('pages.aasViewer.submodels');
    const theme = useTheme();

    const findSubmodelElement = (semanticId: SubmodelElementSemanticIdEnum) =>
        submodel.submodelElements?.find((el) => hasSemanticId(el, semanticId)) as SubmodelElementCollection | undefined;

    const generalInformation = findSubmodelElement(SubmodelElementSemanticIdEnum.GeneralInformation);
    const technicalData = findSubmodelElement(SubmodelElementSemanticIdEnum.TechnicalProperties);
    const productClassifications = findSubmodelElement(SubmodelElementSemanticIdEnum.ProductClassifications);

    const renderVisualization = (element: ISubmodelElement) => {
        switch (getKeyType(element)) {
            case KeyTypes.Property:
                return (
                    <DataRowWithUnit label={element.idShort || 'id'} key={element.idShort}>
                        <PropertyComponent property={element as Property} />
                    </DataRowWithUnit>
                );
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <TreeItem itemId={element.idShort || 'unknown'} label={element.idShort}>
                        {(element as SubmodelElementCollection | SubmodelElementList)?.value?.map(
                            (child) => child && renderVisualization(child),
                        )}
                    </TreeItem>
                );
            case KeyTypes.File:
                return;
            case KeyTypes.MultiLanguageProperty:
                return (
                    <DataRowWithUnit label={element.idShort || 'id'} key={element.idShort}>
                        <MultiLanguagePropertyComponent mLangProp={element as MultiLanguageProperty} />
                    </DataRowWithUnit>
                );
            default:
                return (
                    <Typography color="error" variant="body2">
                        {t('unknownModelType', { type: `${getKeyType(element)}` })}
                    </Typography>
                );
        }
    };

    const renderTreeItem = (id: string, label: string, elements?: ISubmodelElement[]) => (
        <TreeItem
            itemId={id}
            label={label}
            sx={{
                '& .MuiTreeItem-content': {
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                },
                '&& .MuiTreeItem-label': {
                    ...theme.typography.h5,
                },
            }}
            key={id}
        >
            {elements?.map((el) => el && renderVisualization(el))}
        </TreeItem>
    );

    return (
        <SimpleTreeView defaultExpandedItems={['generalInformation']}>
            {generalInformation?.value &&
                renderTreeItem('generalInformation', 'General Information', generalInformation.value)}
            {technicalData?.value && renderTreeItem('technicalProperties', 'Technical Properties', technicalData.value)}
            {productClassifications?.value &&
                renderTreeItem('productClassifications', 'Product Classifications', productClassifications.value)}
        </SimpleTreeView>
    );
}

const DataRowWithUnit = (props: { label: string; children: React.ReactNode }) => (
    <>
        <Box display="flex" flexDirection="row" sx={{ '& > *': { flex: '1 1 33.33%' } }} mt={0.5}>
            <span>{props.label}</span>
            {props.children}
        </Box>
        <Divider />
    </>
);
