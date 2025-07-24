import { LangStringTextType, SubmodelElement } from 'lib/api/aas/models';

export interface SubModelElementCollectionContactInfo extends SubmodelElement {
    value: string | Array<LangStringTextType> | null;
}
