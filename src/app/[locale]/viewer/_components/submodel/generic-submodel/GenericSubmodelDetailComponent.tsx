import { Entity, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { idEquals } from 'lib/util/IdValidationUtil';
import { submodelElementCustomVisualizationMap } from '../../submodel-elements/SubmodelElementCustomVisualizationMap';
import { Fragment } from 'react';
import { GenericSubmodelElementComponent } from '../../submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function GenericSubmodelDetailComponent({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = submodel.submodelElements ?? [];

    // Entity element always has a line at the bottom, so we don't need an extra line on the following element
    const isEntityElementAbove = (index: number) => submodelElements[index - 1] instanceof Entity;
    const hasDivider = (index: number) => !(index === 0) && !isEntityElementAbove(index);

    return (
        <>
            {submodelElements.map((el, index) => {
                const semanticId = el.semanticId?.keys?.[0]?.value;

                // We have to use the idEquals function here to correctly handle IRDIs
                const visualizationMapKey = (Object.keys(submodelElementCustomVisualizationMap) as Array<string>).find(
                    (key) => idEquals(semanticId, key),
                ) as keyof typeof submodelElementCustomVisualizationMap | undefined;
                const CustomSubmodelElementComponent = visualizationMapKey
                    ? submodelElementCustomVisualizationMap[visualizationMapKey]
                    : undefined;

                return (
                    <Fragment key={index}>
                        {CustomSubmodelElementComponent ? (
                            <CustomSubmodelElementComponent
                                key={index}
                                submodelElement={el as SubmodelElementCollection}
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
        </>
    );
}
