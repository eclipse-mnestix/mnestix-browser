import { Submodel } from 'lib/api/aas/models';
import { getSubmodelVisualizationMap } from './submodel.config';
import { GenericSubmodelDetailComponent } from './generic-submodel/GenericSubmodelDetailComponent';
import { Box } from '@mui/material';
import { findSemanticIdInMap } from 'lib/util/SubmodelResolverUtil';
import React from 'react';
import { SubmodelRepositoryUrlProvider } from 'app/[locale]/viewer/_components/submodel/SubmodelRepositoryUrlProvider';

type SubmodelDetailProps = {
    submodel: Submodel;
    submodelRepositoryUrl: string;
};

export function SubmodelDetail(props: SubmodelDetailProps) {
    const submodelElements = props.submodel?.submodelElements;
    if (!props.submodel || !submodelElements) return <></>;

    const visualizationMap = getSubmodelVisualizationMap();
    const key = findSemanticIdInMap(props.submodel.semanticId, visualizationMap);

    const CustomSubmodelComponent = key ? visualizationMap[key] : undefined;

    return (
        <SubmodelRepositoryUrlProvider repositoryUrl={props.submodelRepositoryUrl}>
            <Box key={props.submodel?.id} sx={{
                width: '100%'
            }}>
                {CustomSubmodelComponent ? (
                    <CustomSubmodelComponent submodel={props.submodel} repositoryUrl={props.submodelRepositoryUrl} />
                ) : (
                    <GenericSubmodelDetailComponent submodel={props.submodel} repositoryUrl={props.submodelRepositoryUrl} />
                )}
            </Box>
        </SubmodelRepositoryUrlProvider>
    );
}
