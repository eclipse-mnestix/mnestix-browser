import { mapBaSyxRbacRuleToFormModel, mapFormModelToBaSyxRbacRule } from './FormMappingHelper';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { RoleFormModel } from './RoleDialogForm';

describe('FormMappingHelper', () => {
    describe('mapBaSyxRbacRuleToFormModel', () => {
        it('should map BaSyxRbacRule to RoleFormModel correctly', () => {
            const role: BaSyxRbacRule = {
                idShort: 'role1',
                role: 'admin',
                action: 'READ',
                targetInformation: {
                    '@type': 'aas-environment',
                    aasIds: ['aasId1'],
                    submodelIds: ['submodelId1'],
                },
            };

            const expectedFormModel: RoleFormModel = {
                type: 'aas-environment',
                action: 'READ',
                targetInformation: {
                    'aas-environment': { aasIds: [{ id: 'aasId1' }], submodelIds: [{ id: 'submodelId1' }] },
                    aas: { aasIds: [{ id: '*' }] },
                    submodel: { submodelIds: [{ id: '*' }], submodelElementIdShortPaths: [{ id: '*' }] },
                    'concept-description': { conceptDescriptionIds: [{ id: '*' }] },
                    'aas-registry': { aasIds: [{ id: '*' }] },
                    'submodel-registry': { submodelIds: [{ id: '*' }] },
                    'aas-discovery-service': { aasIds: [{ id: '*' }], assetIds: [{ id: '*' }] },
                },
            };

            expect(mapBaSyxRbacRuleToFormModel(role)).toEqual(expectedFormModel);
        });
    });

    describe('mapFormModelToBaSyxRbacRule', () => {
        it('should map RoleFormModel to BaSyxRbacRule correctly', () => {
            const formModel: RoleFormModel = {
                type: 'aas-environment',
                action: 'READ',
                targetInformation: {
                    'aas-environment': { aasIds: [{ id: 'aasId-edit' }], submodelIds: [{ id: 'submodelId-edit' }] },
                    aas: { aasIds: [{ id: '*' }] },
                    submodel: { submodelIds: [{ id: '*' }], submodelElementIdShortPaths: [{ id: '*' }] },
                    'concept-description': { conceptDescriptionIds: [{ id: '*' }] },
                    'aas-registry': { aasIds: [{ id: '*' }] },
                    'submodel-registry': { submodelIds: [{ id: '*' }] },
                    'aas-discovery-service': { aasIds: [{ id: '*' }], assetIds: [{ id: '*' }] },
                },
            };

            const role: BaSyxRbacRule = {
                idShort: 'role1',
                role: 'admin',
                action: 'READ',
                targetInformation: {
                    '@type': 'aas-environment',
                    aasIds: ['aasId1'],
                    submodelIds: ['submodelId1'],
                },
            };

            const expectedRole: BaSyxRbacRule = {
                idShort: 'role1',
                role: 'admin',
                action: 'READ',
                targetInformation: {
                    '@type': 'aas-environment',
                    aasIds: ['aasId-edit'],
                    submodelIds: ['submodelId-edit'],
                },
            };

            expect(mapFormModelToBaSyxRbacRule(formModel, role)).toEqual(expectedRole);
        });
    });
});
