import { rbacRuleTargets, TargetInformation } from 'lib/services/rbac-service/RbacRulesService';
import { TargetInformationFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';

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
                aasIds: targetInformation.aasIds,
                submodelIds: targetInformation.submodelIds,
            };
            break;
        case 'aas':
            targetInformationFormModel.aas = { aasIds: targetInformation.aasIds };
            break;
        case 'submodel':
            targetInformationFormModel.submodel = {
                submodelIds: targetInformation.submodelIds,
                submodelElementIdShortPaths: targetInformation.submodelElementIdShortPaths,
            };
            break;
        case 'concept-description':
            targetInformationFormModel.conceptDescription = {
                conceptDescriptionIds: targetInformation.conceptDescriptionIds,
            };
            break;
        case 'aas-registry':
            targetInformationFormModel.aasRegistry = { aasIds: targetInformation.aasIds };
            break;
        case 'submodel-registry':
            targetInformationFormModel.submodelRegistry = { submodelIds: targetInformation.submodelIds };
            break;
        case 'aas-discovery-service':
            targetInformationFormModel.aasDiscoveryService = {
                aasIds: targetInformation.aasIds,
                assetIds: targetInformation.assetIds,
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
                aasIds: formModel.aasEnvironment?.aasIds || [],
                submodelIds: formModel.aasEnvironment?.submodelIds || [],
            };
        case 'aas':
            return {
                '@type': 'aas',
                aasIds: formModel.aas?.aasIds || [],
            };
        case 'submodel':
            return {
                '@type': 'submodel',
                submodelIds: formModel.submodel?.submodelIds || [],
                submodelElementIdShortPaths: formModel.submodel?.submodelElementIdShortPaths || [],
            };
        case 'concept-description':
            return {
                '@type': 'concept-description',
                conceptDescriptionIds: formModel.conceptDescription?.conceptDescriptionIds || [],
            };
        case 'aas-registry':
            return {
                '@type': 'aas-registry',
                aasIds: formModel.aasRegistry?.aasIds || [],
            };
        case 'submodel-registry':
            return {
                '@type': 'submodel-registry',
                submodelIds: formModel.submodelRegistry?.submodelIds || [],
            };
        case 'aas-discovery-service':
            return {
                '@type': 'aas-discovery-service',
                aasIds: formModel.aasDiscoveryService?.aasIds || [],
                assetIds: formModel.aasDiscoveryService?.assetIds || [],
            };
        default:
            throw new Error(`Unknown target type: ${type}`);
    }
};
