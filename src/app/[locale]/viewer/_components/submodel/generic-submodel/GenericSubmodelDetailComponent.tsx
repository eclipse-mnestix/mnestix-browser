import { Entity, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { idEquals } from 'lib/util/IdValidationUtil';
import { submodelElementCustomVisualizationMap } from '../../submodel-elements/SubmodelElementCustomVisualizationMap';
import { Fragment } from 'react';
import { GenericSubmodelElementComponent } from '../../submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { Typography, Divider, Box } from '@mui/material';
// import { useTranslations } from 'next-intl';

export function GenericSubmodelDetailComponent({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = (submodel.submodelElements ?? []).filter(
        (element) => !(element.idShort === 'numberOfDocuments'),
    );
    // const t = useTranslations('pages.aasViewer.submodels');

    // Group elements by their type for better readability
    const groupedElements = submodelElements.reduce(
        (groups, element) => {
            const type = element.modelType || 'Unknown';
            if (!groups[type as unknown as string]) {
                groups[type as unknown as string] = [];
            }
            groups[type as unknown as string].push(element);
            return groups;
        },
        {} as Record<string, typeof submodelElements>,
    );

    // Entity element always has a line at the bottom, so we don't need an extra line on the following element
    const isEntityElementAbove = (index: number) => submodelElements[index - 1] instanceof Entity;
    const hasDivider = (index: number) => !(index === 0) && !isEntityElementAbove(index);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(groupedElements).map(([type, elements], groupIndex) => (
                <Box key={groupIndex}>
                    <Typography variant="h6" sx={{ mt: groupIndex === 0 ? 0 : 2, mb: 1 }}>
                        {type}
                    </Typography>
                    {elements.map((el, index) => {
                        const semanticId = el.semanticId?.keys?.[0]?.value;
                        const visualizationMapKey = (
                            Object.keys(submodelElementCustomVisualizationMap) as Array<string>
                        ).find((key) => idEquals(semanticId, key)) as
                            | keyof typeof submodelElementCustomVisualizationMap
                            | undefined;
                        const CustomSubmodelElementComponent = visualizationMapKey
                            ? submodelElementCustomVisualizationMap[visualizationMapKey]
                            : undefined;

                        return (
                            <Fragment key={index}>
                                {CustomSubmodelElementComponent ? (
                                    <CustomSubmodelElementComponent
                                        key={index}
                                        submodelElement={el as SubmodelElementCollection}
                                        submodelId={submodel.id}
                                        hasDivider={hasDivider(index)}
                                    />
                                ) : (
                                    <GenericSubmodelElementComponent
                                        key={index}
                                        submodelElement={el}
                                        submodelId={submodel.id}
                                        hasDivider={hasDivider(index)}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                    {groupIndex < Object.keys(groupedElements).length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
            ))}
        </Box>
    );
}
