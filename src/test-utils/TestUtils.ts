import { Reference, Submodel } from 'lib/api/aas/models';

export enum ServiceReachable {
    Yes = 'Yes',
    No = 'No',
}

export default ServiceReachable;

export function createTestSubmodel(id: string, idShort: string = 'submodel') {
    const submodel: Submodel = {
        modelType: 'Submodel',
        id: id,
        idShort: idShort,
    };
    return submodel;
}

export function createTestSubmodelRef(id: string) {
    const submodelRef: Reference = {
        keys: [
            {
                type: 'Submodel',
                value: id,
            },
        ],
        type: 'ModelReference',
    };
    return submodelRef;
}
