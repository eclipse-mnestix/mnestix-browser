import { AssetAdministrationShell, Reference, Submodel } from 'lib/api/aas/models';
import { AssetAdministrationShellDescriptor, SubmodelDescriptor } from 'lib/types/registryServiceTypes';
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
export function createTestAas(id: string = 'irrelevant AasId') {
    const aas = assetAdministrationShells;
    aas.id = id;
    return aas;
}

export function createTestShellDescriptor(href: URL, id: string): AssetAdministrationShellDescriptor {
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

export function createTestSubmodelDescriptor(href: URL, id: string): SubmodelDescriptor {
    return {
        endpoints: [
            {
                interface: 'SUBMODEL',
                protocolInformation: {
                    href: href.toString(),
                },
            },
        ],
        id: id,
    };
}

export function createTestInfrastructure({
    name = 'TestInfra',
    discoveryUrls = [],
    aasRegistryUrls = [],
    aasRepositoryUrls = [],
    submodelRegistryUrls = [],
    submodelRepositoryUrls = [],
}: {
    name?: string;
    discoveryUrls?: string[];
    aasRegistryUrls?: string[];
    aasRepositoryUrls?: string[];
    submodelRegistryUrls?: string[];
    submodelRepositoryUrls?: string[];
} = {}) {
    return {
        name,
        discoveryUrls,
        aasRegistryUrls,
        aasRepositoryUrls,
        submodelRegistryUrls,
        submodelRepositoryUrls,
    };
}
