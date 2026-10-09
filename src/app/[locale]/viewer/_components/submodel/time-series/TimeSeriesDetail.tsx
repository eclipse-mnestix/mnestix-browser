import { ExpandableDefaultSubmodelDisplay } from 'components/basics/ExpandableNestedContentWrapper';
import { TimeSeriesVisualizations } from './TimeSeriesVisualizations';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';

export function TimeSeriesDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <TimeSeriesVisualizations submodel={submodel} />
            <ExpandableDefaultSubmodelDisplay submodel={submodel} />
        </>
    );
}
