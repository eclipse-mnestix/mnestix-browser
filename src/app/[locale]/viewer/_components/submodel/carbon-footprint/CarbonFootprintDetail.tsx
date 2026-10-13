import { ExpandableDefaultSubmodelDisplay } from 'components/basics/ExpandableNestedContentWrapper';
import { CarbonFootprintVisualizations } from './CarbonFootprintVisualizations';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';

export function CarbonFootprintDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <CarbonFootprintVisualizations submodel={submodel} />
            <ExpandableDefaultSubmodelDisplay submodel={submodel} />
        </>
    );
}
