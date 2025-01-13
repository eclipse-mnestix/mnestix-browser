import { Entity, ISubmodelElement, KeyTypes } from '@aas-core-works/aas-core3.0-typescript/types';
import { ApplicationComponent } from './visualization-components/ApplicationComponent';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export function BillOfApplicationsDetail({ submodel }: SubmodelVisualizationProps) {
    const submodelElements = submodel.submodelElements as ISubmodelElement[];
    const entryNode = submodelElements.find((el) => getKeyType(el) === KeyTypes.Entity) as Entity;

    return <ApplicationComponent entity={entryNode as Entity} />;
}
