import { Submodel } from 'lib/api/aas/models';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';
import { GenericSubmodelDetailComponent } from './generic-submodel/GenericSubmodelDetailComponent';
import { Box } from '@mui/material';
import { findSemanticIdInMap } from 'lib/util/SubmodelResolverUtil';
import React from 'react';
import { SubmodelRepositoryUrlProvider } from 'app/[locale]/viewer/_components/submodel/SubmodelRepositoryUrlProvider';

type SubmodelDetailProps = {
    submodel: Submodel;
    repositoryUrl: string;
};

export function SubmodelDetail(props: SubmodelDetailProps) {
    const submodelElements = props.submodel?.submodelElements;
    if (!props.submodel || !submodelElements) return <></>;

    const key = findSemanticIdInMap(props.submodel.semanticId, submodelCustomVisualizationMap);

    const CustomSubmodelComponent = key ? submodelCustomVisualizationMap[key] : undefined;

    return (
        <SubmodelRepositoryUrlProvider repositoryUrl={props.repositoryUrl}>
            <Box width="100%" key={props.submodel?.id}>
                {CustomSubmodelComponent ? (
                    <CustomSubmodelComponent submodel={props.submodel} />
                ) : (
                    <GenericSubmodelDetailComponent submodel={props.submodel} />
                )}
            </Box>
        </SubmodelRepositoryUrlProvider>
    );
}
