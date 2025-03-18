import { expect } from '@jest/globals';
import { RbacRulesService } from './RbacRulesService';
import { JsonValue, submodelFromJsonable } from '@aas-core-works/aas-core3.0-typescript/jsonization';
import testData from './RbacRulesService.data.json';
import ServiceReachable from 'test-utils/TestUtils';

const correctRules = testData.correct as JsonValue;
const warningRules = testData.warning as JsonValue;

describe('RbacRulesService', () => {
    it('should parse correct SecuritySubmodel', async () => {
        const service = RbacRulesService.createNull(submodelFromJsonable(correctRules).mustValue());
        const res = await service.getRules('SecuritySubmodel');
        expect(res.isSuccess).toBeTruthy();
        expect(res.result?.warnings).toHaveLength(0);
        expect(res.result?.roles).toHaveLength(2);
    });

    it('should add warnings if unknown data is in SecuritySubmodel', async () => {
        const service = RbacRulesService.createNull(submodelFromJsonable(warningRules).mustValue());
        const res = await service.getRules('SecuritySubmodel');
        expect(res.isSuccess).toBeTruthy();
        expect(res.result?.warnings).toHaveLength(1);
    });

    it('should return error if repo is not reachable/repo error', async () => {
        const service = RbacRulesService.createNull(
            submodelFromJsonable(warningRules).mustValue(),
            ServiceReachable.No,
        );
        const res = await service.getRules('SecuritySubmodel');
        expect(res.isSuccess).toBeFalsy();
    });
});
