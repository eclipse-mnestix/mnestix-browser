import { AasRepositoryService } from 'lib/services/aas-repository-service/AasRepositoryService';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { createTestAas, createTestInfrastructure } from 'test-utils/TestUtils';
import {
    getInfrastructureByName,
    getInfrastructuresIncludingDefault,
} from 'lib/services/database/infrastructureDatabaseActions';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { mnestixFetch } from 'lib/api/infrastructure';

jest.mock('./../database/infrastructureDatabaseActions');
jest.mock('lib/util/securityHelpers/repositoryFetchGuard', () => ({
    assertEgressAllowed: jest.fn(),
    securityHeadersForUrl: jest.fn(),
}));
jest.mock('lib/api/infrastructure', () => ({
    mnestixFetch: jest.fn(),
}));

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

    describe('egress guarding', () => {
        const repository: RepositoryWithInfrastructure = {
            infrastructureName: 'Test Infrastructure',
            url: 'http://attacker.example/loot',
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        describe('getAasFromRepository', () => {
            it('returns a forbidden failure and never creates a client when egress is blocked', async () => {
                (getInfrastructureByName as jest.Mock).mockResolvedValue(undefined);
                (assertEgressAllowed as jest.Mock).mockRejectedValue(new Error('Egress blocked: internal target.'));
                const createNullSpy = jest.spyOn(AssetAdministrationShellRepositoryApi, 'createNull');

                const service = AasRepositoryService.createNull([]);
                const result = await service.getAasFromRepository('testAasId', repository);

                expect(assertEgressAllowed).toHaveBeenCalledWith(repository.url, repository.infrastructureName);
                expect(result.isSuccess).toBe(false);
                if (!result.isSuccess) {
                    expect(result.errorCode).toBe(ApiResultStatus.FORBIDDEN);
                }
                expect(securityHeadersForUrl).not.toHaveBeenCalled();
                expect(createNullSpy).not.toHaveBeenCalled();
            });

            it('fetches without security headers when the target host is not configured for the infrastructure', async () => {
                const aasId = 'testAasId';
                const testAas = createTestAas(aasId);
                const infrastructure = createTestInfrastructure({ name: repository.infrastructureName });
                (getInfrastructureByName as jest.Mock).mockResolvedValue(infrastructure);
                (assertEgressAllowed as jest.Mock).mockResolvedValue(undefined);
                (securityHeadersForUrl as jest.Mock).mockResolvedValue(null);
                const fetchResult = { fetch: jest.fn().mockResolvedValue({ isSuccess: true, result: testAas }) };
                (mnestixFetch as jest.Mock).mockReturnValue(fetchResult);

                const service = AasRepositoryService.create();
                const result = await service.getAasFromRepository(aasId, repository);

                expect(securityHeadersForUrl).toHaveBeenCalledWith(repository.url, infrastructure);
                expect(mnestixFetch).toHaveBeenCalledWith(null);
                expect(result.isSuccess).toBe(true);
            });

            it('fetches with the security headers when the target host is configured for the infrastructure', async () => {
                const aasId = 'testAasId';
                const testAas = createTestAas(aasId);
                const configuredRepository: RepositoryWithInfrastructure = {
                    infrastructureName: 'Test Infrastructure',
                    url: 'https://testrepo1.com',
                };
                const infrastructure = createTestInfrastructure({
                    name: configuredRepository.infrastructureName,
                    aasRepositoryUrls: [configuredRepository.url],
                });
                const securityHeader = { 'X-API-KEY': 'secret' };
                (getInfrastructureByName as jest.Mock).mockResolvedValue(infrastructure);
                (assertEgressAllowed as jest.Mock).mockResolvedValue(undefined);
                (securityHeadersForUrl as jest.Mock).mockResolvedValue(securityHeader);
                const fetchResult = { fetch: jest.fn().mockResolvedValue({ isSuccess: true, result: testAas }) };
                (mnestixFetch as jest.Mock).mockReturnValue(fetchResult);

                const service = AasRepositoryService.create();
                const result = await service.getAasFromRepository(aasId, configuredRepository);

                expect(securityHeadersForUrl).toHaveBeenCalledWith(configuredRepository.url, infrastructure);
                expect(mnestixFetch).toHaveBeenCalledWith(securityHeader);
                expect(result.isSuccess).toBe(true);
                expect(result.result?.id).toBe(aasId);
            });
        });

        describe('getThumbnailFromShell', () => {
            it('returns a forbidden failure and never creates a client when egress is blocked', async () => {
                (getInfrastructureByName as jest.Mock).mockResolvedValue(undefined);
                (assertEgressAllowed as jest.Mock).mockRejectedValue(new Error('Egress blocked: internal target.'));
                const createNullSpy = jest.spyOn(AssetAdministrationShellRepositoryApi, 'createNull');

                const service = AasRepositoryService.createNull([]);
                const result = await service.getThumbnailFromShell('testAasId', repository);

                expect(assertEgressAllowed).toHaveBeenCalledWith(repository.url, repository.infrastructureName);
                expect(result.isSuccess).toBe(false);
                if (!result.isSuccess) {
                    expect(result.errorCode).toBe(ApiResultStatus.FORBIDDEN);
                }
                expect(securityHeadersForUrl).not.toHaveBeenCalled();
                expect(createNullSpy).not.toHaveBeenCalled();
            });

            it('fetches without security headers when the target host is not configured for the infrastructure', async () => {
                const aasId = 'testAasId';
                const testThumbnail = new Blob(['thumbnail-bytes'], { type: 'image/png' });
                const infrastructure = createTestInfrastructure({ name: repository.infrastructureName });
                (getInfrastructureByName as jest.Mock).mockResolvedValue(infrastructure);
                (assertEgressAllowed as jest.Mock).mockResolvedValue(undefined);
                (securityHeadersForUrl as jest.Mock).mockResolvedValue(null);
                const fetchResult = { fetch: jest.fn().mockResolvedValue({ isSuccess: true, result: testThumbnail }) };
                (mnestixFetch as jest.Mock).mockReturnValue(fetchResult);

                const service = AasRepositoryService.create();
                const result = await service.getThumbnailFromShell(aasId, repository);

                expect(securityHeadersForUrl).toHaveBeenCalledWith(repository.url, infrastructure);
                expect(mnestixFetch).toHaveBeenCalledWith(null);
                expect(result.isSuccess).toBe(true);
            });

            it('fetches with the security headers when the target host is configured for the infrastructure', async () => {
                const aasId = 'testAasId';
                const testThumbnail = new Blob(['thumbnail-bytes'], { type: 'image/png' });
                const configuredRepository: RepositoryWithInfrastructure = {
                    infrastructureName: 'Test Infrastructure',
                    url: 'https://testrepo1.com',
                };
                const infrastructure = createTestInfrastructure({
                    name: configuredRepository.infrastructureName,
                    aasRepositoryUrls: [configuredRepository.url],
                });
                const securityHeader = { 'X-API-KEY': 'secret' };
                (getInfrastructureByName as jest.Mock).mockResolvedValue(infrastructure);
                (assertEgressAllowed as jest.Mock).mockResolvedValue(undefined);
                (securityHeadersForUrl as jest.Mock).mockResolvedValue(securityHeader);
                const fetchResult = { fetch: jest.fn().mockResolvedValue({ isSuccess: true, result: testThumbnail }) };
                (mnestixFetch as jest.Mock).mockReturnValue(fetchResult);

                const service = AasRepositoryService.create();
                const result = await service.getThumbnailFromShell(aasId, configuredRepository);

                expect(securityHeadersForUrl).toHaveBeenCalledWith(configuredRepository.url, infrastructure);
                expect(mnestixFetch).toHaveBeenCalledWith(securityHeader);
                expect(result.isSuccess).toBe(true);
            });
        });
    });
});
