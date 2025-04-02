import { rbacRuleTargets, TargetInformation } from 'lib/services/rbac-service/RbacRulesService';
import { ArrayOfIds, TargetInformationFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';

// Utility function to map an array of strings to an array of objects with an id property
const mapArrayToIdObjects = (array: string[]): ArrayOfIds => {
    return array.length ? (array.map((item) => ({ id: item })) as ArrayOfIds) : ([{ id: '' }] as ArrayOfIds);
};

export const mapDtoToTargetInformationFormModel = (
    targetInformation: TargetInformation,
): TargetInformationFormModel => {
    const targetInformationFormModel: TargetInformationFormModel = {
        aasEnvironment: undefined,
        aas: undefined,
        submodel: undefined,
        conceptDescription: undefined,
        aasRegistry: undefined,
        submodelRegistry: undefined,
        aasDiscoveryService: undefined,
    };

    switch (targetInformation['@type']) {
        case 'aas-environment':
            targetInformationFormModel.aasEnvironment = {
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
            targetInformationFormModel.conceptDescription = {
                conceptDescriptionIds: mapArrayToIdObjects(targetInformation.conceptDescriptionIds),
            };
            break;
        case 'aas-registry':
            targetInformationFormModel.aasRegistry = { aasIds: mapArrayToIdObjects(targetInformation.aasIds) };
            break;
        case 'submodel-registry':
            targetInformationFormModel.submodelRegistry = {
                submodelIds: mapArrayToIdObjects(targetInformation.submodelIds),
            };
            break;
        case 'aas-discovery-service':
            targetInformationFormModel.aasDiscoveryService = {
                aasIds: mapArrayToIdObjects(targetInformation.aasIds),
                assetIds: mapArrayToIdObjects(targetInformation.assetIds),
            };
            break;
        default:
            throw new Error(`Unknown target type: ${targetInformation['@type']}`);
    }
    return targetInformationFormModel;
};

export const mapTargetInformationFormModelToDto = (
    formModel: TargetInformationFormModel,
    type: keyof typeof rbacRuleTargets,
): TargetInformation => {
    switch (type) {
        case 'aas-environment':
            return {
                '@type': 'aas-environment',
                aasIds: formModel.aasEnvironment?.aasIds.map((obj) => obj.id) || [],
                submodelIds: formModel.aasEnvironment?.submodelIds.map((obj) => obj.id) || [],
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
                conceptDescriptionIds: formModel.conceptDescription?.conceptDescriptionIds.map((obj) => obj.id) || [],
            };
        case 'aas-registry':
            return {
                '@type': 'aas-registry',
                aasIds: formModel.aasRegistry?.aasIds.map((obj) => obj.id) || [],
            };
        case 'submodel-registry':
            return {
                '@type': 'submodel-registry',
                submodelIds: formModel.submodelRegistry?.submodelIds.map((obj) => obj.id) || [],
            };
        case 'aas-discovery-service':
            return {
                '@type': 'aas-discovery-service',
                aasIds: formModel.aasDiscoveryService?.aasIds.map((obj) => obj.id) || [],
                assetIds: formModel.aasDiscoveryService?.assetIds.map((obj) => obj.id) || [],
            };
        default:
            throw new Error(`Unknown target type: ${type}`);
    }
};
