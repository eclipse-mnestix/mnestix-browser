import { Submodel, SubmodelElementChoice } from 'lib/api/aas/models';
import * as WorksTypes from '@aas-core-works/aas-core3.0-typescript/types';

export interface SubmodelViewObject {
    id: string;
    name: string;
    data?: Submodel | SubmodelElementChoice | WorksTypes.Submodel | WorksTypes.ISubmodelElement;
    children: SubmodelViewObject[];
    hasValue?: boolean;
    isAboutToBeDeleted?: boolean;
    propertyValue?: string;
}
