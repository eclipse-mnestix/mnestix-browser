import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { GenericSubmodelElementComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { checkIfSubmodelElementHasIdShortOrSemanticId } from 'lib/util/SubmodelResolverUtil';
import { Box, Typography, useTheme } from '@mui/material';
import {
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    Submodel,
    SubmodelElementCollection,
    SubmodelElementList,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import React, { useState } from 'react';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { GenericPropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericPropertyComponent';
import { MultiLanguagePropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/MultiLanguagePropertyComponent';
import { ParametersComponent } from './ParametersComponent';

export const ConfigurationParametersComponent = ({ submodel }: SubmodelVisualizationProps) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const theme = useTheme();

    const filteredSubmodel = {
        ...submodel,
        submodelElements: (submodel.submodelElements ?? []).filter(
            (element) => !checkIfSubmodelElementHasIdShortOrSemanticId(element, { idShort: 'configurations' }),
        ),
    };

    const configurationsElement = (submodel.submodelElements ?? []).find((element) =>
        checkIfSubmodelElementHasIdShortOrSemanticId(element, { idShort: 'configurations' }),
    ) as SubmodelElementCollection;

    const renderSubmodelElement = (element: ISubmodelElement) => {
        const isParametersList = checkIfSubmodelElementHasIdShortOrSemanticId(element, {
            idShort: 'parameters',
        });
        switch (getKeyType(element)) {
            case KeyTypes.Property: {
                return (
                    <Box
                        key={element.idShort}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography component="span" fontWeight="bold">
                            {element.idShort}:
                        </Typography>
                        <GenericPropertyComponent property={element as Property} withCopyButton={true} />
                    </Box>
                );
            }
            case KeyTypes.MultiLanguageProperty: {
                return (
                    <Box
                        key={element.idShort}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography component="span" fontWeight="bold">
                            {element.idShort}:
                        </Typography>
                        <MultiLanguagePropertyComponent mLangProp={element as MultiLanguageProperty} />
                    </Box>
                );
            }
            case KeyTypes.SubmodelElementList:
                if (!isParametersList) {
                    return (
                        <GenericSubmodelElementComponent
                            key={element.idShort}
                            submodelId={submodel.id}
                            submodelElement={element}
                            hasDivider={false}
                        />
                    );
                }
                return <ParametersComponent smElement={element as SubmodelElementList} key={element.idShort} />;
            default:
                return (
                    <GenericSubmodelElementComponent
                        key={element.idShort}
                        submodelId={submodel.id}
                        submodelElement={element}
                        hasDivider={false}
                    />
                );
        }
    };

    return (
        <>
            <GenericSubmodelDetailComponent submodel={filteredSubmodel as Submodel} />
            <SimpleTreeView
                expandedItems={expandedItems}
                onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
            >
                {configurationsElement?.value?.map((element, index) => {
                    const confProperties = (element as SubmodelElementCollection).value ?? [];
                    const sortedConfProperties = sortSubmodelElementsWithEndElements(confProperties, ['parameters']);

                    const version = getConfigurationVersion(confProperties);

                    return (
                        <Typography key={index} variant="h6" sx={{ marginTop: 2 }}>
                            <TreeItem
                                itemId={index.toString()}
                                label={`${element?.idShort?.toUpperCase()} v.${version}`}
                                sx={{
                                    '& .MuiTreeItem-content': {
                                        py: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    },
                                    '& .MuiTreeItem-content .MuiTreeItem-iconContainer': {
                                        '& svg': {
                                            fontSize: '18px',
                                        },
                                    },
                                    '&& .MuiTreeItem-label': {
                                        m: 0.5,
                                        ...theme.typography.h6,
                                    },
                                }}
                                key={index.toString()}
                            >
                                {sortedConfProperties.map((config) =>
                                    renderSubmodelElement(config as ISubmodelElement),
                                )}
                            </TreeItem>
                        </Typography>
                    );
                })}
            </SimpleTreeView>
        </>
    );
};

/**
 * Sorts submodel elements by moving specific idShort values to the end
 * @param elements - Array of submodel elements to sort
 * @param endElements - Array of idShort values to move to the end
 * @returns New sorted array of submodel elements
 */
export function sortSubmodelElementsWithEndElements(
    elements: ISubmodelElement[],
    endElements: string[],
): ISubmodelElement[] {
    return elements.slice().sort((a, b) => {
        const aIsEndElement = endElements.includes(a.idShort || '');
        const bIsEndElement = endElements.includes(b.idShort || '');

        if (aIsEndElement && !bIsEndElement) return 1;
        if (bIsEndElement && !aIsEndElement) return -1;

        const aIdShort = a.idShort || '';
        const bIdShort = b.idShort || '';
        return aIdShort.localeCompare(bIdShort);
    });
}

function getConfigurationVersion(confProperties: ISubmodelElement[]): string | null {
    const versionElement = confProperties.find((prop) =>
        checkIfSubmodelElementHasIdShortOrSemanticId(prop, { idShort: 'version' }),
    );
    return versionElement ? (versionElement as Property).value : 'N/A';
}
