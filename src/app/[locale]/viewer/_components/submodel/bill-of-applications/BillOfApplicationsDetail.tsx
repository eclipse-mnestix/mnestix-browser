import { Entity, KeyTypes } from 'lib/api/aas/models';
import { ApplicationComponent } from './visualization-components/ApplicationComponent';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function BillOfApplicationsDetail({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = submodel.submodelElements;
    const entryNode = submodelElements?.find((el) => el.modelType === KeyTypes.Entity);

    return <ApplicationComponent entity={entryNode as Entity} />;
}
