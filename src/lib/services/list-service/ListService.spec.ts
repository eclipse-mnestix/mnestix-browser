import { expect } from '@jest/globals';
import { AasListDto, ListService } from 'lib/services/list-service/ListService';
import testData from 'lib/services/list-service/ListService.data.json';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import ServiceReachable, { createTestInfrastructure } from 'test-utils/TestUtils';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { getInfrastructureByName } from 'lib/services/database/infrastructureDatabaseActions';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

jest.mock('lib/util/securityHelpers/repositoryFetchGuard', () => ({
    assertEgressAllowed: jest.fn(),
    securityHeadersForUrl: jest.fn(),
}));
jest.mock('lib/services/database/infrastructureDatabaseActions', () => ({
    getInfrastructureByName: jest.fn(),
    getInfrastructuresIncludingDefault: jest.fn(),
}));
jest.mock('lib/api/infrastructure', () => ({
    mnestixFetch: jest.fn(),
}));

const mockedAssertEgressAllowed = assertEgressAllowed as jest.MockedFunction<typeof assertEgressAllowed>;
const mockedSecurityHeadersForUrl = securityHeadersForUrl as jest.MockedFunction<typeof securityHeadersForUrl>;
const mockedGetInfrastructureByName = getInfrastructureByName as jest.MockedFunction<typeof getInfrastructureByName>;
const mockedMnestixFetch = mnestixFetch as jest.MockedFunction<typeof mnestixFetch>;

const assetAdministrationShells = testData.assetAdministrationShells as AssetAdministrationShell[];
const expectedData = testData.expectedResult as AasListDto;

describe('ListService: Return List Entities', function () {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAssertEgressAllowed.mockResolvedValue(undefined);
        mockedSecurityHeadersForUrl.mockResolvedValue(null);
        mockedGetInfrastructureByName.mockResolvedValue(undefined);
    });

    it('returns proper object when aas list is returned from aas repository', async () => {
        // ARRANGE
        const listService = ListService.createNull(assetAdministrationShells);

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult).toEqual(expectedData);
    });

    it('returns empty object when no aas is returned from aas repository', async () => {
        // ARRANGE
        const listService = ListService.createNull();

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult).toEqual({
            success: true,
            entities: [],
            cursor: '',
        });
    });

    it('return success false when aas repository is not reachable and returns error', async () => {
        // ARRANGE
        const listService = ListService.createNull([], [], ServiceReachable.No);

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult.success).toEqual(false);
        expect(listServiceResult).toHaveProperty('error');
    });

    it('returns nameplate data when existing in the repository', async () => {
        const listService = ListService.createNull(
            assetAdministrationShells,
            [testData.nameplate as unknown as Submodel],
            ServiceReachable.Yes,
        );

        const nameplateResult = await listService.getNameplateValuesForAAS('https://i40.xitaso.com/aas/testListAas_00');

        expect(nameplateResult).toEqual(testData.nameplateResult);
    });

    it('returns undefined if there is no nameplate reference', async () => {
        const listService = ListService.createNull(
            assetAdministrationShells,
            [testData.nameplate as unknown as Submodel],
            ServiceReachable.Yes,
        );

        const nameplateResult = await listService.getNameplateValuesForAAS('https://i40.xitaso.com/aas/testListAas_01');

        expect(nameplateResult.manufacturerName).toEqual(undefined);
        expect(nameplateResult.manufacturerProductDesignation).toEqual(undefined);
    });

    describe('egress guarding', () => {
        const blockedRepository: RepositoryWithInfrastructure = {
            infrastructureName: 'Default Infrastructure',
            url: 'http://169.254.169.254/x',
        };

        describe('getAasListEntities', () => {
            it('returns a forbidden failure and never fetches when egress is blocked', async () => {
                mockedAssertEgressAllowed.mockRejectedValue(new Error('Egress blocked: internal target.'));
                const listService = ListService.createNull(assetAdministrationShells);

                const result = await listService.getAasListEntities(5);

                expect(mockedAssertEgressAllowed).toHaveBeenCalledWith('https://targetAasRepositoryClient.com', 'null');
                expect(result.success).toBe(false);
                expect((result.error as { errorCode: ApiResultStatus })?.errorCode).toBe(ApiResultStatus.FORBIDDEN);
                expect(mockedSecurityHeadersForUrl).not.toHaveBeenCalled();
            });

            it('fetches without security headers when the target host is not configured', async () => {
                const infrastructure = createTestInfrastructure({ name: blockedRepository.infrastructureName });
                mockedGetInfrastructureByName.mockResolvedValue(infrastructure);
                mockedSecurityHeadersForUrl.mockResolvedValue(null);
                const fetchMock = jest
                    .fn()
                    .mockResolvedValue({ isSuccess: true, result: { result: [], paging_metadata: {} } });
                mockedMnestixFetch.mockReturnValue({ fetch: fetchMock });
                const targetRepository: RepositoryWithInfrastructure = {
                    ...blockedRepository,
                    url: 'http://attacker.example/loot',
                };

                const listService = await ListService.create(targetRepository);
                const result = await listService.getAasListEntities(5);

                expect(mockedSecurityHeadersForUrl).toHaveBeenCalledWith(targetRepository.url, infrastructure);
                expect(mockedMnestixFetch).toHaveBeenCalledWith(null);
                expect(result.success).toBe(true);
            });

            it('fetches with the security headers when the target host is configured', async () => {
                const configuredRepository: RepositoryWithInfrastructure = {
                    infrastructureName: 'Default Infrastructure',
                    url: 'http://backend:8081',
                };
                const infrastructure = createTestInfrastructure({
                    name: configuredRepository.infrastructureName,
                    aasRepositoryUrls: [configuredRepository.url],
                });
                const securityHeader = { 'X-API-KEY': 'secret' };
                mockedGetInfrastructureByName.mockResolvedValue(infrastructure);
                mockedSecurityHeadersForUrl.mockResolvedValue(securityHeader);
                const fetchMock = jest
                    .fn()
                    .mockResolvedValue({ isSuccess: true, result: { result: [], paging_metadata: {} } });
                mockedMnestixFetch.mockReturnValue({ fetch: fetchMock });

                const listService = await ListService.create(configuredRepository);
                const result = await listService.getAasListEntities(5);

                expect(mockedSecurityHeadersForUrl).toHaveBeenCalledWith(configuredRepository.url, infrastructure);
                expect(mockedMnestixFetch).toHaveBeenCalledWith(securityHeader);
                expect(result.success).toBe(true);
            });
        });

        describe('getNameplateValuesForAAS', () => {
            it('returns a forbidden failure and never fetches when egress is blocked', async () => {
                mockedAssertEgressAllowed.mockRejectedValue(new Error('Egress blocked: internal target.'));
                const listService = ListService.createNull(assetAdministrationShells);

                const result = await listService.getNameplateValuesForAAS('irrelevant-aas-id');

                expect(mockedAssertEgressAllowed).toHaveBeenCalledWith('https://targetAasRepositoryClient.com', 'null');
                expect(result.success).toBe(false);
                expect((result.error as { errorCode: ApiResultStatus })?.errorCode).toBe(ApiResultStatus.FORBIDDEN);
                expect(mockedSecurityHeadersForUrl).not.toHaveBeenCalled();
            });

            it('fetches without security headers when the target host is not configured', async () => {
                const infrastructure = createTestInfrastructure({ name: blockedRepository.infrastructureName });
                mockedGetInfrastructureByName.mockResolvedValue(infrastructure);
                mockedSecurityHeadersForUrl.mockResolvedValue(null);
                const fetchMock = jest.fn().mockResolvedValue({ isSuccess: true, result: { result: [] } });
                mockedMnestixFetch.mockReturnValue({ fetch: fetchMock });
                const targetRepository: RepositoryWithInfrastructure = {
                    ...blockedRepository,
                    url: 'http://attacker.example/loot',
                };

                const listService = await ListService.create(targetRepository);
                const result = await listService.getNameplateValuesForAAS('irrelevant-aas-id');

                expect(mockedSecurityHeadersForUrl).toHaveBeenCalledWith(targetRepository.url, infrastructure);
                expect(mockedMnestixFetch).toHaveBeenCalledWith(null);
                expect(result.success).toBe(true);
            });

            it('fetches with the security headers when the target host is configured', async () => {
                const configuredRepository: RepositoryWithInfrastructure = {
                    infrastructureName: 'Default Infrastructure',
                    url: 'http://backend:8081',
                };
                const infrastructure = createTestInfrastructure({
                    name: configuredRepository.infrastructureName,
                    aasRepositoryUrls: [configuredRepository.url],
                });
                const securityHeader = { 'X-API-KEY': 'secret' };
                mockedGetInfrastructureByName.mockResolvedValue(infrastructure);
                mockedSecurityHeadersForUrl.mockResolvedValue(securityHeader);
                const fetchMock = jest.fn().mockResolvedValue({ isSuccess: true, result: { result: [] } });
                mockedMnestixFetch.mockReturnValue({ fetch: fetchMock });

                const listService = await ListService.create(configuredRepository);
                const result = await listService.getNameplateValuesForAAS('irrelevant-aas-id');

                expect(mockedSecurityHeadersForUrl).toHaveBeenCalledWith(configuredRepository.url, infrastructure);
                expect(mockedMnestixFetch).toHaveBeenCalledWith(securityHeader);
                expect(result.success).toBe(true);
            });
        });
    });
});
