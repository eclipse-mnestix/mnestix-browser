import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { buildSubmodelElementPath, hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { MultiLanguagePropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/MultiLanguagePropertyComponent';
import { Box, Typography, useTheme } from '@mui/material';
import {
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import { PropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/PropertyComponent';
import {
    ConceptDescription,
    File,
    Range,
    SubmodelElementList,
} from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import React, { useState } from 'react';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import { DataRowWithUnit } from 'app/[locale]/viewer/_components/submodel/technical-data/DataRowWithUnit';
import { getConceptDescriptionById } from 'lib/services/conceptDescriptionApiActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

export function TechnicalDataDetail({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('pages.aasViewer.submodels');
    const theme = useTheme();
    const [semanticIdResults, setSemanticIdResults] = useState<Record<string, ConceptDescription>>({});
    const [loadingConceptDescriptions, setLoadingConceptDescriptions] = useState<boolean>(true);

    const findSubmodelElement = (semanticId: SubmodelElementSemanticIdEnum) =>
        submodel.submodelElements?.find((el) => hasSemanticId(el, semanticId)) as SubmodelElementCollection | undefined;

    const generalInformation = findSubmodelElement(SubmodelElementSemanticIdEnum.GeneralInformation);
    const technicalData = findSubmodelElement(SubmodelElementSemanticIdEnum.TechnicalProperties);
    const productClassifications = findSubmodelElement(SubmodelElementSemanticIdEnum.ProductClassifications);
    const furtherInformation = findSubmodelElement(SubmodelElementSemanticIdEnum.FurtherInformation);

    const renderVisualization = (element: ISubmodelElement) => {
        const semanticId = element.semanticId?.keys[0].value || '';
        switch (getKeyType(element)) {
            case KeyTypes.Property: {
                return (
                    <DataRowWithUnit
                        label={element.idShort || 'id'}
                        key={element.idShort}
                        unit={semanticIdResults[semanticId]?.embeddedDataSpecifications?.[0]?.dataSpecificationContent.unit}
                        conceptDescriptionLoading={loadingConceptDescriptions}
                    >
                        <PropertyComponent property={element as Property} />
                    </DataRowWithUnit>
                );
            }
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <TreeItem
                        key={element.idShort}
                        itemId={element.idShort || 'unknown'}
                        label={element.idShort}
                        sx={{
                            '&& .MuiTreeItem-label': {
                                m: 0,
                                ...theme.typography.h6,
                            },
                        }}
                    >
                        {(element as SubmodelElementCollection | SubmodelElementList)?.value?.map(
                            (child) => child && renderVisualization(child),
                        )}
                    </TreeItem>
                );
            case KeyTypes.File:
                return (
                    // With the hardcoded SubmodelElementPath, this only works for CompanyLogo and ProductLogo
                    <DataRowWithUnit label={element.idShort || 'id'} key={element.idShort}>
                        <Box maxHeight="50px" overflow="hidden" sx={{ overflowWrap: 'anywhere' }}>
                            <FileComponent
                                file={element as File}
                                submodelId={submodel.id}
                                submodelElementPath={buildSubmodelElementPath('GeneralInformation', element.idShort)}
                            />
                        </Box>
                    </DataRowWithUnit>
                );
            case KeyTypes.MultiLanguageProperty:
                return (
                    <DataRowWithUnit label={element.idShort || 'id'} key={element.idShort}>
                        <MultiLanguagePropertyComponent mLangProp={element as MultiLanguageProperty} />
                    </DataRowWithUnit>
                );
            case KeyTypes.Range:
                // Range still needs styling
                return (
                    <DataRowWithUnit label={element.idShort || 'id'} key={element.idShort}>
                        <span>
                            min: {(element as Range).min}, max: {(element as Range).max}
                        </span>
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
                '& .MuiTreeItem-content .MuiTreeItem-iconContainer': {
                    '& svg': {
                        fontSize: '30px',
                    },
                },
                '&& .MuiTreeItem-label': {
                    m: 1,
                    ...theme.typography.h4,
                },
            }}
            key={id}
        >
            {elements?.map((el) => el && renderVisualization(el))}
        </TreeItem>
    );


    function getFlatMapOfAllSemanticIds(elements: ISubmodelElement[]): string[] {
        return elements.reduce<string[]>((acc, el) => {
            if (el.semanticId?.keys[0]?.value) {
                acc.push(el.semanticId.keys[0].value);
            }
            if (getKeyType(el) === KeyTypes.SubmodelElementCollection || getKeyType(el) === KeyTypes.SubmodelElementList) {
                const collection = el as SubmodelElementCollection | SubmodelElementList;
                if (collection.value) {
                    acc.push(...getFlatMapOfAllSemanticIds(collection.value));
                }
            }
            return [...new Set(acc)];
        }, []);
    }
    const loadConceptDescriptions = React.useCallback(async () => {
        const elements = [
            ...(technicalData?.value || []),
            ...(generalInformation?.value || []),
            ...(productClassifications?.value || []),
            ...(furtherInformation?.value || [])
        ];

        if (elements.length > 0) {
            const semanticIds = getFlatMapOfAllSemanticIds(elements);
            const results = await Promise.all(
                semanticIds.map(async (semanticId) => {
                    if (semanticId) {
                        const result = await getConceptDescriptionById(semanticId);
                        if(result.isSuccess)
                            return { [semanticId]: result.result };
                    }
                    return null;
                })
            );
            const filteredResults = results.filter((r): r is Record<string, ConceptDescription> => r !== null)
                .reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setSemanticIdResults(prev => ({ ...prev, ...filteredResults }));
        }
    }, [technicalData, generalInformation, productClassifications, furtherInformation]);

    useAsyncEffect(async () => {
        setLoadingConceptDescriptions(true);
        await loadConceptDescriptions();
        setLoadingConceptDescriptions(false);
    }, [ loadConceptDescriptions])

    return (
        <SimpleTreeView
            defaultExpandedItems={['technicalProperties']}>
            {technicalData?.value && renderTreeItem('technicalProperties', 'Technical Properties', technicalData.value)}
            {generalInformation?.value &&
                renderTreeItem('generalInformation', 'General Information', generalInformation.value)}
            {productClassifications?.value &&
                renderTreeItem('productClassifications', 'Product Classifications', productClassifications.value)}
            {furtherInformation?.value &&
                renderTreeItem('furtherInformation', 'Further Information', furtherInformation.value)}
        </SimpleTreeView>
    );
}

