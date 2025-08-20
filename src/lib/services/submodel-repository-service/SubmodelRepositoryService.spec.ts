import { SubmodelRepositoryService } from 'lib/services/submodel-repository-service/SubmodelRepositoryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createTestInfrastructure, createTestSubmodel } from 'test-utils/TestUtils';
import { Submodel } from 'lib/api/aas/models';

describe('SubmodelRepositoryService', () => {
    it('returns Submodel when found in submodel repository', async () => {
        const submodelId = 'submodel-123';
        const dummySubmodel: Submodel = createTestSubmodel(submodelId);
        const submodelRepoUrl = 'https://submodel-repo.com';
        const service = SubmodelRepositoryService.createNull([
            { searchResult: dummySubmodel, location: submodelRepoUrl },
        ]);
        const infrastructure = createTestInfrastructure({ submodelRepositoryUrls: [submodelRepoUrl] });

        const result = await service.getFirstSubmodelFromAllRepos(submodelId, infrastructure);
        expect(result.isSuccess).toBeTruthy();
        expect(result.result?.searchResult.id).toBe(submodelId);
        expect(result.result?.location).toBe(submodelRepoUrl);
    });

    it('returns NOT_FOUND when Submodel is not found', async () => {
        const submodelRepoUrl = 'https://submodel-repo.com';
        const service = SubmodelRepositoryService.createNull([]);
        const infrastructure = createTestInfrastructure({ submodelRepositoryUrls: [submodelRepoUrl] });

        const result = await service.getFirstSubmodelFromAllRepos('unknown-submodel', infrastructure);
        expect(result.isSuccess).toBeFalsy();
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns NOT_FOUND if no submodel repository url is configured', async () => {
        const service = SubmodelRepositoryService.createNull([]);
        const infrastructure = createTestInfrastructure({ submodelRepositoryUrls: [] });

        const result = await service.getFirstSubmodelFromAllRepos('any-submodel', infrastructure);
        expect(result.isSuccess).toBeFalsy();
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });
});
