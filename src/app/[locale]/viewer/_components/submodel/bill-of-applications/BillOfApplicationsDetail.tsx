import { Entity, KeyTypes } from 'lib/api/aas/models';
import { ApplicationComponent } from './visualization-components/ApplicationComponent';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';

export function BillOfApplicationsDetail({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = submodel.submodelElements;
    const entryNode = submodelElements?.find((el) => el.modelType === KeyTypes.Entity);

    return <ApplicationComponent entity={entryNode as Entity} />;
}
