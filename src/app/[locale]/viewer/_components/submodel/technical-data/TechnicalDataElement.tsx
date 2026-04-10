import {
    ConceptDescription,
    File,
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Range,
    SubmodelElementList,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { DataRowWithUnit } from 'app/[locale]/viewer/_components/submodel/technical-data/ConceptDescriptionDataRow';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import { buildSubmodelElementPath } from 'lib/util/SubmodelResolverUtil';
import { getConceptDescriptionById } from 'lib/services/conceptDescriptionApiActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { GenericPropertyComponent } from '../../submodel-elements/generic-elements/GenericPropertyComponent';

export const TechnicalDataElement = (props: {
    elements: ISubmodelElement[];
    submodelId: string;
    label: string;
    header: string;
    isExpanded: boolean;
    showUnits?: boolean
}) => {
    const t = useTranslations('pages.aasViewer.submodels');
    const [conceptDescriptions, setConceptDescriptions] = useState<Record<string, ConceptDescription>>({});
    const [loadingConceptDescriptions, setLoadingConceptDescriptions] = useState<boolean>(true);

    /**
     * Get all semantic IDs from the submodel elements and their children,
     * this is needed to fetch all concept descriptions at once.
     */
    function getFlatMapOfAllSemanticIds(elements: ISubmodelElement[]): string[] {
        return elements.reduce<string[]>((acc, el) => {
            if (el.semanticId?.keys[0]?.value) {
                acc.push(el.semanticId.keys[0].value);
            }
            if (
                getKeyType(el) === KeyTypes.SubmodelElementCollection ||
                getKeyType(el) === KeyTypes.SubmodelElementList
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
                    if (result?.isSuccess) return { [semanticId]: result.result };
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

    const renderSubmodelElement = (element: ISubmodelElement) => {
        const semanticId = element.semanticId?.keys?.[0]?.value || '';
        switch (getKeyType(element)) {
            case KeyTypes.Property: {
                return (
                    <DataRowWithUnit
                        submodelElement={element}
                        conceptDescription={conceptDescriptions[semanticId]}
                        conceptDescriptionLoading={loadingConceptDescriptions}
                    >
                        <GenericPropertyComponent
                            property={element as Property}
                            withCopyButton={true}
                            conceptDescription={props.showUnits ? conceptDescriptions[semanticId] : undefined}
                            conceptDescriptionLoading={props.showUnits ? loadingConceptDescriptions : undefined} />
                    </DataRowWithUnit>
                );
            }
            case KeyTypes.SubmodelElementCollection:
            case KeyTypes.SubmodelElementList:
                return (
                    <Box
                        sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            backgroundColor: '#fafafa',
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.95rem' }}>
                            {element.idShort}
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                                gap: 2,
                            }}
                        >
                            {(element as SubmodelElementCollection | SubmodelElementList)?.value?.map(
                                (child) => child && <React.Fragment key={child.idShort}>{renderSubmodelElement(child)}</React.Fragment>,
                            )}
                        </Box>
                    </Box>
                );
            case KeyTypes.File: {
                const file = element as File;
                const path = buildSubmodelElementPath('GeneralInformation', element.idShort);

                return (
                    <DataRowWithUnit submodelElement={element}>
                        <Box height="24px" width="24px" overflow="hidden" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px', backgroundColor: '#f5f5f5', minWidth: '24px' }}>
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
                        {t('unknownModelType', { type: `${getKeyType(element)}` })}
                    </Typography>
                );
        }
    };

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    m: 1,
                    py: 1,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {props.header}
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                    gap: 2,
                    p: 1,
                }}
            >
                {props.elements?.map((el, index) => el && <React.Fragment key={`${el.idShort}_${index}`}>{renderSubmodelElement(el)}</React.Fragment>)}
            </Box>
        </Box>
    );
};
