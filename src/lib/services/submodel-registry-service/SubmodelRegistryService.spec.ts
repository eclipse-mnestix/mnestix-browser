import { SubmodelRegistryService } from 'lib/services/submodel-registry-service/SubmodelRegistryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createTestInfrastructure, createTestSubmodelDescriptor } from 'test-utils/TestUtils';
import { SubmodelDescriptor } from 'lib/types/registryServiceTypes';

describe('SubmodelRegistryService', () => {
    it('returns SubmodelDescriptor when found in registry', async () => {
        const submodelId = 'submodel-123';
        const dummyDescriptor: SubmodelDescriptor = createTestSubmodelDescriptor(
            new URL('https://registry.com/submodels/submodel-123'),
            submodelId,
        );

        const service = SubmodelRegistryService.createNull([dummyDescriptor]);
        const infrastructures = createTestInfrastructure({ submodelRegistryUrls: ['https://registry.com'] });

        const result = await service.searchInMultipleSubmodelRegistries(submodelId, infrastructures);
        expect(result.isSuccess).toBe(true);
        expect(result.result?.id).toBe(submodelId);
    });

    it('returns the a single SubmodelDescriptor when multiple are found', async () => {
        const submodelId = 'submodel-123';
        const dummyDescriptor1: SubmodelDescriptor = createTestSubmodelDescriptor(
            new URL('https://registry1.com/submodels/submodel-123'),
            submodelId,
        );
        const dummyDescriptor2: SubmodelDescriptor = createTestSubmodelDescriptor(
            new URL('https://registry2.com/submodels/submodel-123'),
            submodelId,
        );
        const service = SubmodelRegistryService.createNull([dummyDescriptor1, dummyDescriptor2]);
        const infrastructures = createTestInfrastructure({
            submodelRegistryUrls: ['https://registry1.com', 'https://registry2.com'],
        });

        const result = await service.searchInMultipleSubmodelRegistries(submodelId, infrastructures);
        expect(result.isSuccess).toBe(true);
        expect(result.result?.id).toBe(submodelId);
    });

    it('returns NOT_FOUND when SubmodelDescriptor is not found', async () => {
        const service = SubmodelRegistryService.createNull([]);
        const infrastructures = createTestInfrastructure({ submodelRegistryUrls: ['https://registry.com'] });

        const result = await service.searchInMultipleSubmodelRegistries('unknown-submodel', infrastructures);
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns error if no submodel registry url is configured', async () => {
        const service = SubmodelRegistryService.createNull([]);
        const infrastructures = createTestInfrastructure({ submodelRegistryUrls: [] });

        const result = await service.searchInMultipleSubmodelRegistries('any-submodel', infrastructures);
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns NOT_FOUND if descriptor has no endpoints', async () => {
        const submodelId = 'submodel-123';
        const dummyDescriptor: SubmodelDescriptor = {
            id: submodelId,
            endpoints: [],
        };
        const service = SubmodelRegistryService.createNull([dummyDescriptor]);
        const infrastructures = createTestInfrastructure({ submodelRegistryUrls: ['https://registry.com'] });

        const result = await service.searchInMultipleSubmodelRegistries(submodelId, infrastructures);
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });
});
