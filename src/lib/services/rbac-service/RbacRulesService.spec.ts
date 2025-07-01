import { expect } from '@jest/globals';
import { RbacRulesService } from './RbacRulesService';
import { JsonValue, submodelFromJsonable } from '@aas-core-works/aas-core3.0-typescript/jsonization';
import testData from './RbacRulesService.data.json';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { range } from 'lodash';

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
            expect(res.result?.rules).toHaveLength(2);
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
        const subApiMock = {
            postSubmodelElement: jest.fn().mockResolvedValue({
                isSuccess: true,
                result: testData.correct.submodelElements[0],
            } satisfies ApiResponseWrapper<unknown>),
            getSubmodelById: () => Promise.resolve({ isSuccess: true, result: testData.correct }),
        } as unknown as SubmodelRepositoryApi;
        it('should convert rule to the correct idShort', async () => {
            const service = RbacRulesService.createNull(subApiMock);

            await service.createRule({
                action: 'DELETE',
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
        it('should return bad request if rule is invalid', async () => {
            const service = RbacRulesService.createNull(subApiMock);
            const res = await service.createRule({
                action: 'DELETE',
                role: range(1001).join(''),
                targetInformation: { '@type': 'aas', aasIds: ['*'] },
            });
            if (res.isSuccess) {
                fail('Expected error, but got success');
            }
            expect(res.errorCode).toBe(ApiResultStatus.BAD_REQUEST);
        });

        it('should show error if idShort already exists', async () => {
            const service = RbacRulesService.createNull(
                SubmodelRepositoryApi.createNull('', [submodelFromJsonable(correctRules).mustValue()]),
            );

            const res = await service.createRule({
                role: 'admin',
                action: 'READ',
                targetInformation: { '@type': 'aas', aasIds: ['*'] },
            });

            if (res.isSuccess) {
                fail('Expected error, but got success');
            }
            expect(res.errorCode).toBe(ApiResultStatus.CONFLICT);
        });
    });

    describe('update', () => {
        it('should show error if idShort already exists', async () => {
            const service = RbacRulesService.createNull(
                SubmodelRepositoryApi.createNull('', [submodelFromJsonable(correctRules).mustValue()]),
            );

            const res = await service.deleteAndCreate(
                // admin DELETE submodel
                'YWRtaW5ERUxFVEVvcmcuZWNsaXBzZS5kaWdpdGFsdHdpbi5iYXN5eC5hYXNyZXBvc2l0b3J5LmZlYXR1cmUuYXV0aG9yaXphdGlvbi5BYXNUYXJnZXRJbmZvcm1hdGlvbg==',
                {
                    role: 'admin',
                    action: 'READ',
                    targetInformation: { '@type': 'aas', aasIds: ['*'] },
                },
            );

            if (res.isSuccess) {
                fail('Expected error, but got success');
            }
            expect(res.errorCode).toBe(ApiResultStatus.CONFLICT);
        });
    });
});
