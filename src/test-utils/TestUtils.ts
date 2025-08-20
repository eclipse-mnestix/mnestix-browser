import { AssetAdministrationShell, Reference, Submodel } from 'lib/api/aas/models';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import testData from 'lib/services/infrastructure-search-service/TestAas.data.json';

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

const assetAdministrationShells = testData as unknown as AssetAdministrationShell;
export function createDummyAas(id: string = 'irrelevant AasId') {
    const aas = assetAdministrationShells;
    aas.id = id;
    return aas;
}

export function createDummyShellDescriptor(href: URL, id: string): AssetAdministrationShellDescriptor {
    return {
        endpoints: [
            {
                interface: 'AAS-3.0',
                protocolInformation: {
                    href: href.toString(),
                },
            },
        ],
        id: id,
    };
}
