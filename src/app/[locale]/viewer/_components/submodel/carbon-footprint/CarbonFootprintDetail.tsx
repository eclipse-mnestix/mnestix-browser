import { ExpandableDefaultSubmodelDisplay } from 'components/basics/ExpandableNestedContentWrapper';
import { CarbonFootprintVisualizations } from './CarbonFootprintVisualizations';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function CarbonFootprintDetail({ submodel }: SubmodelVisualizationProps) {
    return (
        <>
            <CarbonFootprintVisualizations submodel={submodel} />
            <ExpandableDefaultSubmodelDisplay submodel={submodel} />
        </>
    );
}
