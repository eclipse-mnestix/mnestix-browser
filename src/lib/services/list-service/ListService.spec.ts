import { expect } from '@jest/globals';
import { AasListDto, ListService } from 'lib/services/list-service/ListService';
import testData from 'lib/services/list-service/ListService.data.json';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';
import { ServiceReachable } from 'lib/services/transfer-service/TransferService';

const assetAdministrationShells = testData.assetAdministrationShells as unknown as AssetAdministrationShell[];
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
        const listService = ListService.createNull([], ServiceReachable.No);

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult.success).toEqual(false);
        expect(listServiceResult).toHaveProperty('error');
    });
});
