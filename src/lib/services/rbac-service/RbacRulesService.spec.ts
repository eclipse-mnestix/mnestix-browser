import { expect } from '@jest/globals';
import { RbacRulesService } from './RbacRulesService';
import { JsonValue, submodelFromJsonable } from '@aas-core-works/aas-core3.0-typescript/jsonization';
import testData from './RbacRulesService.data.json';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

const correctRules = testData.correct as JsonValue;
const warningRules = testData.warning as JsonValue;

describe('RbacRulesService', () => {
    describe('getAll', () => {
        it('should parse correct SecuritySubmodel', async () => {
            const service = RbacRulesService.createNull(
                SubmodelRepositoryApi.createNull('', [submodelFromJsonable(correctRules).mustValue()]),
            );
            const res = await service.getRules();
            expect(res.isSuccess).toBeTruthy();
            expect(res.result?.warnings).toHaveLength(0);
            expect(res.result?.roles).toHaveLength(2);
        });

        it('should add warnings if unknown data is in SecuritySubmodel', async () => {
            const service = RbacRulesService.createNull(
                SubmodelRepositoryApi.createNull('', [submodelFromJsonable(warningRules).mustValue()]),
            );
            const res = await service.getRules();
            expect(res.isSuccess).toBeTruthy();
            expect(res.result?.warnings).toHaveLength(1);
        });

        it('should return error if repo is not reachable/repo error', async () => {
            const service = RbacRulesService.createNull(
                SubmodelRepositoryApi.createNull(
                    '',
                    [submodelFromJsonable(warningRules).mustValue()],
                    ServiceReachable.No,
                ),
            );
            const res = await service.getRules();
            expect(res.isSuccess).toBeFalsy();
        });
    });

    describe('create', () => {
        it('should convert rule to the correct idShort', () => {
            const subApiMock = {
                postSubmodelElement: jest.fn().mockResolvedValue({
                    isSuccess: true,
                    result: testData.correct.submodelElements[0],
                } satisfies ApiResponseWrapper<unknown>),
            } as unknown as SubmodelRepositoryApi;

            const service = RbacRulesService.createNull(subApiMock);

            service.createRule({
                action: ['DELETE'],
                role: 'test',
                targetInformation: { '@type': 'aas', aasIds: ['*'] },
            });

            expect(subApiMock.postSubmodelElement).toHaveBeenCalledWith(
                'SecuritySubmodel',
                expect.objectContaining({
                    idShort:
                        'dGVzdERFTEVURW9yZy5lY2xpcHNlLmRpZ2l0YWx0d2luLmJhc3l4LmFhc3JlcG9zaXRvcnkuZmVhdHVyZS5hdXRob3JpemF0aW9uLkFhc1RhcmdldEluZm9ybWF0aW9u',
                }),
            );
        });
    });
});
