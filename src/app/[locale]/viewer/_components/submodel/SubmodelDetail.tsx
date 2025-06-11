import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';
import { GenericSubmodelDetailComponent } from './generic-submodel/GenericSubmodelDetailComponent';
import { Box } from '@mui/material';
import { idEquals } from 'lib/util/IdValidationUtil';

type SubmodelDetailProps = {
    submodel?: Submodel;
};

export function SubmodelDetail(props: SubmodelDetailProps) {
    const submodelElements = props.submodel?.submodelElements;
    if (!props.submodel || !submodelElements) return <></>;

    const semanticId = props.submodel.semanticId?.keys?.[0]?.value;

    // We have to use the idEquals function here to correctly handle IRDIs
    const key = Object.keys(submodelCustomVisualizationMap).find((key) => idEquals(semanticId, key)) as
        | keyof typeof submodelCustomVisualizationMap
        | undefined;

    const CustomSubmodelComponent = key ? submodelCustomVisualizationMap[key] : undefined;

    return (
        <Box width="100%" key={props.submodel?.id}>
            {CustomSubmodelComponent ? (
                <CustomSubmodelComponent submodel={props.submodel} />
            ) : (
                <GenericSubmodelDetailComponent submodel={props.submodel} />
            )}
        </Box>
    );
}
