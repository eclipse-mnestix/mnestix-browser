import { RbacRulesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';

export const mockRbacRoles: RbacRulesFetchResult = {
    rules: [
        {
            idShort: 'roleId1',
            role: 'Admin-Role',
            action: 'READ',
            targetInformation: {
                '@type': 'aas-environment',
                aasIds: ['aasId1', 'aasId2'],
                submodelIds: ['submodelId1'],
            },
        },
        {
            idShort: 'roleId2',
            role: 'Admin-Role',
            action: 'DELETE',
            targetInformation: {
                '@type': 'submodel',
                submodelIds: ['aasId1', 'aasId2'],
                submodelElementIdShortPaths: ['*'],
            },
        },
        {
            idShort: 'roleId3',
            role: 'User-Role',
            action: 'CREATE',
            targetInformation: {
                '@type': 'submodel',
                submodelElementIdShortPaths: ['*'],
                submodelIds: ['*'],
            },
        },
        {
            idShort: 'roleId4',
            role: 'Admin-Role2',
            action: 'READ',
            targetInformation: {
                '@type': 'aas-environment',
                aasIds: ['aasId1', 'aasId2'],
                submodelIds: ['submodelId1'],
            },
        },
    ],
    warnings: [],
};
