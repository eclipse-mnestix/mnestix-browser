import { ExpandableDefaultSubmodelDisplay } from 'components/basics/ExpandableNestedContentWrapper';
import { CarbonFootprintVisualizations } from './CarbonFootprintVisualizations';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function CarbonFootprintDetail(props: SubmodelVisualizationProps) {
    return (
        <>
            <CarbonFootprintVisualizations submodel={props.submodel} />
            <ExpandableDefaultSubmodelDisplay submodel={props.submodel} />
        </>
    );
}
