import { Submodel, SubmodelElementChoice } from 'lib/api/aas/models';

export interface SubmodelViewObject {
    id: string;
    name: string;
    data?: Submodel | SubmodelElementChoice;
    children: SubmodelViewObject[];
    hasValue?: boolean;
    isAboutToBeDeleted?: boolean;
    propertyValue?: string;
}
