import { DiscoveryService } from 'lib/services/discovery-service/DiscoveryService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createTestInfrastructure } from 'test-utils/TestUtils';

describe('DiscoveryService', () => {
    it('returns aasId when found in discovery', async () => {
        const assetId = 'asset-123';
        const aasId = 'aas-456';
        const service = DiscoveryService.createNull([{ assetId, aasId }]);
        const infrastructures = createTestInfrastructure({ discoveryUrls: ['https://discovery1.com'] });

        const result = await service.searchAasIdInMultipleDiscoveries(assetId, [infrastructures]);
        expect(result.isSuccess).toBeTruthy();
        expect(result.result?.[0].aasId).toBe(aasId);
        expect(result.result?.[0].infrastructureName).toBe('TestInfra');
    });

    it('returns multiple aasIds when found in discovery', async () => {
        const assetId = 'asset-123';
        const service = DiscoveryService.createNull([
            { assetId, aasId: 'aas-1' },
            { assetId, aasId: 'aas-2' },
        ]);
        const infrastructures = createTestInfrastructure({ discoveryUrls: ['https://discovery1.com'] });

        const result = await service.searchAasIdInMultipleDiscoveries(assetId, [infrastructures]);
        expect(result.isSuccess).toBeTruthy();
        expect(result.result?.length).toBe(2);
        expect(result.result?.map((r) => r.aasId)).toEqual(['aas-1', 'aas-2']);
    });

    it('returns NOT_FOUND when assetId is not found', async () => {
        const service = DiscoveryService.createNull([]);
        const infrastructures = createTestInfrastructure({ discoveryUrls: ['https://discovery1.com'] });

        const result = await service.searchAasIdInMultipleDiscoveries('unknown-asset', [infrastructures]);
        expect(result.isSuccess).toBeFalsy();
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns error if no discovery url is configured', async () => {
        const service = DiscoveryService.createNull([]);
        const infrastructures = createTestInfrastructure();

        const result = await service.searchAasIdInMultipleDiscoveries('any-asset', [infrastructures]);
        expect(result.isSuccess).toBeFalsy();
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });
});
