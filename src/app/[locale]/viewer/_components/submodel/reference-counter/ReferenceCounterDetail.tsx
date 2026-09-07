import { ReferenceCounterVisualizations } from './ReferenceCounterVisualizations';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';

export function ReferenceCounterDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <ReferenceCounterVisualizations submodel={submodel} />
        </>
    );
}
