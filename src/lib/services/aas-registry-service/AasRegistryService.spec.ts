import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createDummyAas, createDummyShellDescriptor } from 'test-utils/TestUtils';

describe('AasRegistryService', () => {
    function createInfrastructure(registryUrls: string[] = [], repositoryUrls: string[] = []) {
        return [
            {
                name: 'TestInfra',
                aasRegistryUrls: registryUrls,
                aasRepositoryUrls: repositoryUrls,
                discoveryUrls: [],
                submodelRegistryUrls: [],
                submodelRepositoryUrls: [],
            },
        ];
    }

    it('returns AAS when one is found in a registry', async () => {
        const aasId = 'testAasId';
        const aasEndpoint = 'https://registry1.com/shells/testAasId';
        const dummyDescriptor = createDummyShellDescriptor(aasEndpoint, aasId);
        const aas = createDummyAas(aasId);
        const service = AasRegistryService.createNull([dummyDescriptor], [{ endpoint: aasEndpoint, aas: aas }]);
        const infrastructures = createInfrastructure(['https://registry1.com']);

        const result = await service.searchInMultipleAasRegistries(aasId, infrastructures);
        expect(result.isSuccess).toBeTruthy();
        expect(result.result?.[0].redirectUrl).toContain('/viewer/');
    });

    it('returns redirect URL when multiple AAS found', async () => {
        const aasId = 'testAasId';
        const aasEndpoint1 = 'https://registry1.com/shells/testAasId';
        const aasEndpoint2 = 'https://registry2.com/shells/testAasId';
        const dummyDescriptor1 = createDummyShellDescriptor(aasEndpoint1, aasId);
        const dummyDescriptor2 = createDummyShellDescriptor(aasEndpoint2, aasId);
        const aas1 = createDummyAas(aasId);
        const aas2 = createDummyAas(aasId);
        const service = AasRegistryService.createNull(
            [dummyDescriptor1, dummyDescriptor2],
            [
                { endpoint: aasEndpoint1, aas: aas1 },
                { endpoint: aasEndpoint2, aas: aas2 },
            ],
        );
        const infrastructures = createInfrastructure(['https://registry1.com', 'https://registry2.com']);

        const result = await service.searchInMultipleAasRegistries(aasId, infrastructures);
        expect(result.isSuccess).toBeTruthy();
        expect(result.result?.[0].redirectUrl).toContain('/viewer/registry?aasId=testAasId');
    });

    it('returns NOT_FOUND when AAS is not in registry', async () => {
        const service = AasRegistryService.createNull([]);
        const infrastructures = createInfrastructure(['https://registry1.com']);

        const result = await service.searchInMultipleAasRegistries('unknownAasId', infrastructures);
        expect(result.isSuccess).toBeFalsy();
        expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
    });

    it('returns error if no registry url is configured', async () => {
        const service = AasRegistryService.createNull([]);
        const infrastructures = createInfrastructure([], ['https://repository1.com']);

        const result = await service.searchInMultipleAasRegistries('aasId', infrastructures);
        expect(result.isSuccess).toBeFalsy();
        expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
    });
});
