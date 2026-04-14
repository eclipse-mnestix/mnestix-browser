import { expect } from '@jest/globals';
import { AasListDto, extractRepoBaseUrl, ListService } from 'lib/services/list-service/ListService';
import testData from 'lib/services/list-service/ListService.data.json';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import ServiceReachable from 'test-utils/TestUtils';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import { AasRegistryEndpointEntryInMemory } from 'lib/api/registry-service-api/registryServiceApiInMemory';

const assetAdministrationShells = testData.assetAdministrationShells as AssetAdministrationShell[];
const expectedData = testData.expectedResult as AasListDto;

describe('ListService: Return List Entities', function () {
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
});

describe('ListService: Registry flow', function () {
    const repoBaseUrl = 'https://aas-repo.example.com';
    const aasShells = testData.assetAdministrationShells as AssetAdministrationShell[];

    const descriptors: AssetAdministrationShellDescriptor[] = aasShells.map((aas) => ({
        id: aas.id,
        idShort: aas.idShort,
        globalAssetId: aas.assetInformation?.globalAssetId,
        endpoints: [
            {
                interface: 'AAS-3.0',
                protocolInformation: {
                    href: `${repoBaseUrl}/shells/${encodeURIComponent(aas.id)}`,
                },
            },
        ],
    }));

    const endpointEntries: AasRegistryEndpointEntryInMemory[] = aasShells.map((aas) => ({
        endpoint: `${repoBaseUrl}/shells/${encodeURIComponent(aas.id)}`,
        aas,
    }));

    it('returns entities with resolvedRepositoryUrl when fetching from registry', async () => {
        const listService = ListService.createNullWithRegistry(descriptors, endpointEntries);

        const result = await listService.getAasListEntities(10, undefined, 'registry');

        expect(result.success).toBe(true);
        expect(result.entities).toHaveLength(3);
        for (const entity of result.entities!) {
            expect(entity.resolvedRepositoryUrl).toBe(repoBaseUrl);
        }
    });

    it('does not set resolvedRepositoryUrl when fetching from repository', async () => {
        const listService = ListService.createNull(aasShells);

        const result = await listService.getAasListEntities(10);

        expect(result.success).toBe(true);
        for (const entity of result.entities!) {
            expect(entity.resolvedRepositoryUrl).toBeUndefined();
        }
    });

    it('returns empty list when registry is not reachable', async () => {
        const listService = ListService.createNullWithRegistry(descriptors, endpointEntries, ServiceReachable.No);

        const result = await listService.getAasListEntities(10, undefined, 'registry');

        expect(result.success).toBe(false);
        expect(result).toHaveProperty('error');
    });
});

describe('extractRepoBaseUrl', function () {
    it('extracts base URL from AAS endpoint href', () => {
        expect(extractRepoBaseUrl('https://repo.example.com/shells/abc123')).toBe('https://repo.example.com');
    });

    it('handles URL with path before /shells/', () => {
        expect(extractRepoBaseUrl('https://repo.example.com/api/v3/shells/abc123')).toBe(
            'https://repo.example.com/api/v3',
        );
    });

    it('returns full URL if /shells/ not found', () => {
        expect(extractRepoBaseUrl('https://repo.example.com/other/path')).toBe(
            'https://repo.example.com/other/path',
        );
    });
});
