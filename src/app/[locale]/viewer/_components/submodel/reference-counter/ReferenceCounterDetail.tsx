import { ReferenceCounterVisualizations } from './ReferenceCounterVisualizations';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function ReferenceCounterDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <ReferenceCounterVisualizations submodel={submodel} />
        </>
    );
}
