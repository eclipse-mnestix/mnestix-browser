import { AasRegistryService } from 'lib/services/aas-registry-service/AasRegistryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createTestAas, createTestInfrastructure, createTestShellDescriptor } from 'test-utils/TestUtils';

describe('AasRegistryService', () => {
    it('returns AAS when one is found in a registry', async () => {
        const aasId = 'testAasId';
        const aasEndpoint = new URL('https://registry1.com/shells/testAasId');
        const dummyDescriptor = createTestShellDescriptor(aasEndpoint, aasId);
        const aas = createTestAas(aasId);
        const service = AasRegistryService.createNull([dummyDescriptor], [{ endpoint: aasEndpoint, aas: aas }]);
        const infrastructures = createTestInfrastructure({ aasRegistryUrls: ['https://registry1.com'] });

        const result = await service.searchInMultipleAasRegistries(aasId, [infrastructures]);
        expect(result.isSuccess).toBe(true);
        expect(result.result?.[0].redirectUrl).toContain('/viewer/');
    });

    it('returns redirect URL when multiple AAS found', async () => {
        const aasId = 'testAasId';
        const aasEndpoint1 = new URL('https://registry1.com/shells/testAasId');
        const aasEndpoint2 = new URL('https://registry2.com/shells/testAasId');
        const dummyDescriptor1 = createTestShellDescriptor(aasEndpoint1, aasId);
        const dummyDescriptor2 = createTestShellDescriptor(aasEndpoint2, aasId);
        const aas1 = createTestAas(aasId);
        const aas2 = createTestAas(aasId);
        const service = AasRegistryService.createNull(
            [dummyDescriptor1, dummyDescriptor2],
            [
                { endpoint: aasEndpoint1, aas: aas1 },
                { endpoint: aasEndpoint2, aas: aas2 },
            ],
        );
        const infrastructures = createTestInfrastructure({
            aasRegistryUrls: ['https://registry1.com', 'https://registry2.com'],
        });

        const result = await service.searchInMultipleAasRegistries(aasId, [infrastructures]);
        expect(result.isSuccess).toBe(true);
        expect(result.result?.[0].redirectUrl).toContain('/viewer/registry?aasId=testAasId');
    });

    it('returns NOT_FOUND when AAS is not in registry', async () => {
        const service = AasRegistryService.createNull([]);
        const infrastructures = createTestInfrastructure({ aasRegistryUrls: ['https://registry1.com'] });

        const result = await service.searchInMultipleAasRegistries('unknownAasId', [infrastructures]);
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns error if no registry url is configured', async () => {
        const service = AasRegistryService.createNull([]);
        const infrastructures = createTestInfrastructure({ aasRegistryUrls: ['https://registry1.com'] });

        const result = await service.searchInMultipleAasRegistries('aasId', [infrastructures]);
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });
});
