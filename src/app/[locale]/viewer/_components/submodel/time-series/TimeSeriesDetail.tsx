import { ExpandableDefaultSubmodelDisplay } from 'components/basics/ExpandableNestedContentWrapper';
import { TimeSeriesVisualizations } from './TimeSeriesVisualizations';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function TimeSeriesDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <TimeSeriesVisualizations submodel={submodel} />
            <ExpandableDefaultSubmodelDisplay submodel={submodel} />
        </>
    );
}
