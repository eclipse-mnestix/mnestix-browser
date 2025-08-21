import { AasRepositoryService } from 'lib/services/aas-repository-service/AasRepositoryService';
import { createTestAas, createTestInfrastructure } from 'test-utils/TestUtils';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

jest.mock('./../database/connectionServerActions');

describe('AasRepositorySearchService', () => {
    describe('one infrastructure', () => {
        beforeEach(() => {
            jest.clearAllMocks();

            (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue([
                {
                    name: 'Test Infrastructure',
                    aasRepositoryUrls: ['https://testrepo1.com', 'https://testrepo2.com'],
                },
            ]);
        });

        it('returns the aas as result if found in one repository', async () => {
            const aasId = 'testAasId';
            const mockSearchResult = {
                searchResult: createTestAas(aasId),
                location: 'https://testrepo1.com',
                infrastructureName: 'Test Infrastructure',
            };

            const aasRepositorySearchService = AasRepositoryService.createNull([mockSearchResult]);

            const result = await aasRepositorySearchService.searchInAllAasRepositories(encodeBase64(aasId));

            expect(result.isSuccess).toBe(true);
            expect(result.result?.length).toBe(1);
            expect(result.result![0].searchResult.id).toBe(aasId);
        });

        it('returns a list of aas as result if found in multiple repositories', async () => {
            const aasId = 'testAasId';
            const mockSearchResult1 = {
                searchResult: createTestAas(aasId),
                location: 'https://testrepo1.com',
                infrastructureName: 'Test Infrastructure',
            };
            const mockSearchResult2 = {
                searchResult: createTestAas(aasId),
                location: 'https://testrepo2.com',
                infrastructureName: 'Test Infrastructure',
            };

            const aasRepositorySearchService = AasRepositoryService.createNull([mockSearchResult1, mockSearchResult2]);

            const result = await aasRepositorySearchService.searchInAllAasRepositories(encodeBase64(aasId));

            expect(result.isSuccess).toBe(true);
            expect(result.result?.length).toBe(2);
            expect(result.result![0].searchResult.id).toBe(aasId);
            expect(result.result![1].searchResult.id).toBe(aasId);
        });
    });
    describe('two infrastructures', () => {
        const infrastructures = [
            createTestInfrastructure({ name: 'Test Infrastructure 1', aasRepositoryUrls: ['https://testrepo1.com'] }),
            createTestInfrastructure({ name: 'Test Infrastructure 2', aasRepositoryUrls: ['https://testrepo2.com'] }),
        ];

        beforeEach(() => {
            jest.clearAllMocks();
            (getInfrastructuresIncludingDefault as jest.Mock).mockResolvedValue(infrastructures);
        });

        it('returns the aas as result if found in one repository across multiple infrastructures', async () => {
            const aasId = 'testAasId';
            const mockSearchResult = {
                searchResult: createTestAas(aasId),
                location: 'https://testrepo1.com',
                infrastructureName: 'Test Infrastructure 1',
            };

            const aasRepositorySearchService = AasRepositoryService.createNull([mockSearchResult]);

            const result = await aasRepositorySearchService.searchAASInMultipleRepositories(
                encodeBase64(aasId),
                infrastructures,
            );

            expect(result.isSuccess).toBe(true);
            expect(result.result?.length).toBe(1);
            expect(result.result![0].searchResult.id).toBe(aasId);
        });

        it('returns not found if aas is not in any repository', async () => {
            const aasId = 'nonExistentAasId';
            const aasRepositorySearchService = AasRepositoryService.createNull([]);

            const result = await aasRepositorySearchService.searchAASInMultipleRepositories(
                encodeBase64(aasId),
                infrastructures,
            );

            expect(result.isSuccess).toBe(false);
            if (!result.isSuccess) {
                expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
            }
        });

        it('returns error if no repository url is configured', async () => {
            const aasId = 'testAasId';
            const aasRepositorySearchService = AasRepositoryService.createNull([]);

            const result = await aasRepositorySearchService.searchInAllAasRepositories(encodeBase64(aasId));

            expect(result.isSuccess).toBe(false);
            if (!result.isSuccess) {
                expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
            }
        });
    });
});
