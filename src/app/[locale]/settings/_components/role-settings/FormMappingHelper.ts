import { BaSyxRbacRule, rbacRuleTargets, TargetInformation } from 'lib/services/rbac-service/types/RbacServiceData';
import {
    ArrayOfIds,
    RuleFormModel,
    TargetInformationFormModel,
} from 'app/[locale]/settings/_components/role-settings/RuleForm';

// Utility function to map an array of strings to an array of objects with an id property
const mapArrayToIdObjects = (array: string[]): ArrayOfIds => {
    return array.length ? (array.map((item) => ({ id: item })) as ArrayOfIds) : wildcard;
};

const wildcard: ArrayOfIds = [{ id: '*' }];

const mapDtoToTargetInformationFormModel = (targetInformation: TargetInformation): TargetInformationFormModel => {
    const targetInformationFormModel: TargetInformationFormModel = {
        'aas-environment': { aasIds: wildcard, submodelIds: wildcard },
        aas: { aasIds: wildcard },
        submodel: { submodelIds: wildcard, submodelElementIdShortPaths: wildcard },
        'concept-description': { conceptDescriptionIds: wildcard },
        'aas-registry': { aasIds: wildcard },
        'submodel-registry': { submodelIds: wildcard },
        'aas-discovery-service': { aasIds: wildcard, assetIds: wildcard },
    };

    switch (targetInformation['@type']) {
        case 'aas-environment':
            targetInformationFormModel['aas-environment'] = {
                aasIds: mapArrayToIdObjects(targetInformation.aasIds),
                submodelIds: mapArrayToIdObjects(targetInformation.submodelIds),
            };
            break;
        case 'aas':
            targetInformationFormModel.aas = { aasIds: mapArrayToIdObjects(targetInformation.aasIds) };
            break;
        case 'submodel':
            targetInformationFormModel.submodel = {
                submodelIds: mapArrayToIdObjects(targetInformation.submodelIds),
                submodelElementIdShortPaths: mapArrayToIdObjects(targetInformation.submodelElementIdShortPaths),
            };
            break;
        case 'concept-description':
            targetInformationFormModel['concept-description'] = {
                conceptDescriptionIds: mapArrayToIdObjects(targetInformation.conceptDescriptionIds),
            };
            break;
        case 'aas-registry':
            targetInformationFormModel['aas-registry'] = { aasIds: mapArrayToIdObjects(targetInformation.aasIds) };
            break;
        case 'submodel-registry':
            targetInformationFormModel['submodel-registry'] = {
                submodelIds: mapArrayToIdObjects(targetInformation.submodelIds),
            };
            break;
        case 'aas-discovery-service':
            targetInformationFormModel['aas-discovery-service'] = {
                aasIds: mapArrayToIdObjects(targetInformation.aasIds),
                assetIds: mapArrayToIdObjects(targetInformation.assetIds),
            };
            break;
        default:
            throw new Error(`Unknown target type: ${targetInformation['@type']}`);
    }
    return targetInformationFormModel;
};

const mapTargetInformationFormModelToDto = (
    formModel: TargetInformationFormModel,
    type: keyof typeof rbacRuleTargets,
): TargetInformation => {
    switch (type) {
        case 'aas-environment':
            return {
                '@type': 'aas-environment',
                aasIds: formModel['aas-environment']?.aasIds.map((obj) => obj.id) || [],
                submodelIds: formModel['aas-environment']?.submodelIds.map((obj) => obj.id) || [],
            };
        case 'aas':
            return {
                '@type': 'aas',
                aasIds: formModel.aas?.aasIds.map((obj) => obj.id) || [],
            };
        case 'submodel':
            return {
                '@type': 'submodel',
                submodelIds: formModel.submodel?.submodelIds.map((obj) => obj.id) || [],
                submodelElementIdShortPaths: formModel.submodel?.submodelElementIdShortPaths.map((obj) => obj.id) || [],
            };
        case 'concept-description':
            return {
                '@type': 'concept-description',
                conceptDescriptionIds:
                    formModel['concept-description']?.conceptDescriptionIds.map((obj) => obj.id) || [],
            };
        case 'aas-registry':
            return {
                '@type': 'aas-registry',
                aasIds: formModel['aas-registry']?.aasIds.map((obj) => obj.id) || [],
            };
        case 'submodel-registry':
            return {
                '@type': 'submodel-registry',
                submodelIds: formModel['submodel-registry']?.submodelIds.map((obj) => obj.id) || [],
            };
        case 'aas-discovery-service':
            return {
                '@type': 'aas-discovery-service',
                aasIds: formModel['aas-discovery-service']?.aasIds.map((obj) => obj.id) || [],
                assetIds: formModel['aas-discovery-service']?.assetIds.map((obj) => obj.id) || [],
            };
        default:
            throw new Error(`Unknown target type: ${type}`);
    }
};

export const mapBaSyxRbacRuleToFormModel = (role: BaSyxRbacRule): RuleFormModel => {
    return {
        role: { name: role.role },
        type: role.targetInformation['@type'],
        action: role.action,
        targetInformation: mapDtoToTargetInformationFormModel(role.targetInformation),
    };
};

export const mapFormModelToBaSyxRbacRule = (formModel: RuleFormModel, role: BaSyxRbacRule): BaSyxRbacRule => {
    const targetInformation = mapTargetInformationFormModelToDto(formModel.targetInformation, formModel.type);
    return {
        idShort: role.idShort,
        role: typeof formModel.role === 'string' ? formModel.role : formModel.role.name,
        action: formModel.action,
        targetInformation: targetInformation,
    };
};
