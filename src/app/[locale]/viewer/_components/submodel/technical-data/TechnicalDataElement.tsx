import {
    ConceptDescription,
    ModelFile,
    SubmodelElementChoice,
    KeyTypes,
    MultiLanguageProperty,
    Range,
    SubmodelElementList,
    SubmodelElementCollection,
} from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';
import { Box, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { DataRowWithUnit } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionDataRow';
import { TreeItem } from '@mui/x-tree-view';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import { buildSubmodelElementPath } from 'lib/util/SubmodelResolverUtil';
import { getConceptDescriptionById } from 'lib/services/conceptDescriptionApiActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { GenericPropertyComponent } from '../../submodel-elements/generic-elements/GenericPropertyComponent';

export const TechnicalDataElement = (props: {
    elements: SubmodelElementChoice[];
    submodelId: string;
    label: string;
    header: string;
    isExpanded: boolean;
    showUnits?: boolean
}) => {
    const t = useTranslations('pages.aasViewer.submodels');
    const theme = useTheme();
    const [conceptDescriptions, setConceptDescriptions] = useState<Record<string, ConceptDescription>>({});
    const [loadingConceptDescriptions, setLoadingConceptDescriptions] = useState<boolean>(true);

    /**
     * Get all semantic IDs from the submodel elements and their children,
     * this is needed to fetch all concept descriptions at once.
     */
    function getFlatMapOfAllSemanticIds(elements: SubmodelElementChoice[]): string[] {
        return elements.reduce<string[]>((acc, el) => {
            if (el.semanticId?.keys[0]?.value) {
                acc.push(el.semanticId.keys[0].value);
            }
            if (
                el.modelType === KeyTypes.SubmodelElementCollection ||
                el.modelType === KeyTypes.SubmodelElementList
            ) {
                const collection = el as SubmodelElementCollection | SubmodelElementList;
                if (collection.value) {
                    acc.push(...getFlatMapOfAllSemanticIds(collection.value));
                }
            }
            return [...new Set(acc)];
        }, []);
    }

    const loadConceptDescriptions = React.useCallback(async () => {
        if (props.elements.length === 0) {
            return;
        }
        const semanticIds = getFlatMapOfAllSemanticIds(props.elements);
        const results = await Promise.all(
            semanticIds.map(async (semanticId) => {
                if (semanticId) {
                    const result = await getConceptDescriptionById(semanticId);
                    if (result.isSuccess) return { [semanticId]: result.result };
                }
                return null;
            }),
        );
        const filteredResults = results
            .filter((r): r is Record<string, ConceptDescription> => r !== null)
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setConceptDescriptions(filteredResults);
    }, [props.elements]);

    /**
     * Load all concept descriptions for the submodel elements when the component is expanded.
     */
    useAsyncEffect(async () => {
        if (!props.isExpanded || Object.keys(conceptDescriptions).length > 0) {
            return;
        }
        setLoadingConceptDescriptions(true);
        try {
            await loadConceptDescriptions();
        } finally {
            setLoadingConceptDescriptions(false);
        }
    }, [props.isExpanded, loadConceptDescriptions]);

    const renderSubmodelElement = (element: SubmodelElementChoice) => {
        const semanticId = element.semanticId?.keys?.[0]?.value || '';
        switch (element.modelType) {
            case KeyTypes.Property: {
                return (
                    <DataRowWithUnit
                        submodelElement={element}
                        conceptDescription={conceptDescriptions[semanticId]}
                        conceptDescriptionLoading={loadingConceptDescriptions}
                    >
                        <GenericPropertyComponent
                            property={element}
                            withCopyButton={true}
                            conceptDescription={props.showUnits ? conceptDescriptions[semanticId] : undefined}
                            conceptDescriptionLoading={props.showUnits ? loadingConceptDescriptions : undefined} />
                    </DataRowWithUnit>
                );
            }
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <TreeItem
                        itemId={element.idShort || 'unknown'}
                        label={element.idShort}
                        sx={{
                            '&& .MuiTreeItem-label': {
                                m: 0,
                                ...theme.typography.h5,
                            },
                        }}
                    >
                        {(element as SubmodelElementCollection | SubmodelElementList)?.value?.map(
                            (child) => child && <React.Fragment key={child.idShort}>{renderSubmodelElement(child)}</React.Fragment>,
                        )}
                    </TreeItem>
                );
            case KeyTypes.File: {
                const file = element as ModelFile;
                const path = buildSubmodelElementPath('GeneralInformation', element.idShort);

                return (
                    // With the hardcoded SubmodelElementPath, this only works for CompanyLogo and ProductLogo
                    <DataRowWithUnit submodelElement={element}>
                        <Box height="50px" overflow="hidden" sx={{ display: 'flex', overflowWrap: 'anywhere' }}>
                            <FileComponent
                                file={file}
                                submodelId={props.submodelId}
                                submodelElementPath={path}
                            />
                        </Box>
                    </DataRowWithUnit>
                );
            }
            case KeyTypes.MultiLanguageProperty:
                return (
                    <DataRowWithUnit
                        submodelElement={element}
                        conceptDescription={conceptDescriptions[semanticId]}
                        conceptDescriptionLoading={loadingConceptDescriptions}
                    >
                        <GenericPropertyComponent
                            mLangProp={element as MultiLanguageProperty}
                            conceptDescription={props.showUnits ? conceptDescriptions[semanticId] : undefined}
                            conceptDescriptionLoading={props.showUnits ? loadingConceptDescriptions : undefined}
                        />
                    </DataRowWithUnit>
                );
            case KeyTypes.Range:
                // Range still needs styling
                return (
                    <DataRowWithUnit
                        submodelElement={element}
                        conceptDescription={conceptDescriptions[semanticId]}
                    >
                        <GenericPropertyComponent
                            range={element as Range}
                            conceptDescription={props.showUnits ? conceptDescriptions[semanticId] : undefined}
                            conceptDescriptionLoading={props.showUnits ? loadingConceptDescriptions : undefined}
                        />
                    </DataRowWithUnit>
                );
            default:
                return (
                    <Typography color="error" variant="body2">
                        {t('unknownModelType', { type: `${element.modelType}` })}
                    </Typography>
                );
        }
    };

    return (
        <TreeItem
            itemId={props.label}
            label={props.header.toUpperCase()}
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
            key={props.label}
        >
            {props.elements?.map((el, index) => el && <React.Fragment key={`${el.idShort}_${index}`}>{renderSubmodelElement(el)}</React.Fragment>)}
        </TreeItem>
    );
};
