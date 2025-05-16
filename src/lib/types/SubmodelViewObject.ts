import { Submodel, ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';
import * as SpecTypes from 'lib/api/aas/models';

// TODO merge back with SubmodelViewObject
export interface SubmodelViewObjectSpec {
    id: string;
    name: string;
    data?: SpecTypes.Submodel | SpecTypes.SubmodelElementChoice;
    children: SubmodelViewObjectSpec[];
    hasValue?: boolean;
    isAboutToBeDeleted?: boolean;
    propertyValue?: string;
}

export interface SubmodelViewObject {
    id: string;
    name: string;
    data?: Submodel | ISubmodelElement;
    children: SubmodelViewObject[];
    hasValue?: boolean;
    isAboutToBeDeleted?: boolean;
    propertyValue?: string;
}
