import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';
import { GenericSubmodelDetailComponent } from './generic-submodel/GenericSubmodelDetailComponent';
import { Box } from '@mui/material';
import { findSemanticIdInMap } from 'lib/util/SubmodelResolverUtil';

type SubmodelDetailProps = {
    submodel?: Submodel;
};

export function SubmodelDetail(props: SubmodelDetailProps) {
    const submodelElements = props.submodel?.submodelElements;
    if (!props.submodel || !submodelElements) return <></>;

    const key = findSemanticIdInMap(props.submodel.semanticId, submodelCustomVisualizationMap);

    const CustomSubmodelComponent = key ? submodelCustomVisualizationMap[key] : undefined;

    return (
        <Box width="100%">
            {CustomSubmodelComponent ? (
                <CustomSubmodelComponent submodel={props.submodel} />
            ) : (
                <GenericSubmodelDetailComponent submodel={props.submodel} />
            )}
        </Box>
    );
}
