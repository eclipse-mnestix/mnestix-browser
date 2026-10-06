import { SubmodelElementCollection } from 'lib/api/aas/models';
import { getSubmodelElementVisualizationMap } from '../../submodel-elements/submodel-element.config';
import { Fragment } from 'react';
import { GenericSubmodelElementComponent } from '../../submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';
import { findSemanticIdInMap } from 'lib/util/SubmodelResolverUtil';
import { KeyTypes } from 'lib/api/aas/models';

export function GenericSubmodelDetailComponent({ submodel, repositoryUrl }: SubmodelVisualizationProps) {
    const submodelElements = (submodel.submodelElements ?? []).filter(
        (element) => !(element.idShort === 'numberOfDocuments'),
    );

    // Entity element always has a line at the bottom, so we don't need an extra line on the following element
    const isEntityElementAbove = (index: number) => submodelElements[index - 1].modelType === KeyTypes.Entity;
    const hasDivider = (index: number) => !(index === 0) && !isEntityElementAbove(index);

    const visualizationMap = getSubmodelElementVisualizationMap();

    return (
        <>
            {submodelElements.map((el, index) => {
                // findSemanticIdInMap handles IRDIs and checks every semanticId key, not just the first
                const visualizationMapKey = findSemanticIdInMap(el.semanticId, visualizationMap);
                const CustomSubmodelElementComponent = visualizationMapKey
                    ? visualizationMap[visualizationMapKey]
                    : undefined;

                return (
                    <Fragment key={index}>
                        {CustomSubmodelElementComponent ? (
                            <CustomSubmodelElementComponent
                                key={index}
                                submodelElement={el as SubmodelElementCollection}
                                submodelId={submodel.id}
                                hasDivider={hasDivider(index)}
                                repositoryUrl={repositoryUrl}
                            />
                        ) : (
                            <GenericSubmodelElementComponent
                                key={index}
                                submodelElement={el}
                                submodelId={submodel.id}
                                hasDivider={hasDivider(index)}
                                repositoryUrl={repositoryUrl}
                            />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}
