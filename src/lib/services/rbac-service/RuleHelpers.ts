import type { BaSyxRbacRule } from './RbacRulesService';

// TODO MNES-1605
export function ruleToSubmodelElement(idShort: string, rule: Omit<BaSyxRbacRule, 'idShort'>) {
    const targets = Object.entries(rule.targetInformation).filter(([k]) => k !== '@type');

    return {
        modelType: 'SubmodelElementCollection',
        idShort,
        value: [
            {
                modelType: 'Property',
                value: rule.role,
                valueType: 'xs:string',
                idShort: 'role',
            },
            {
                modelType: 'SubmodelElementList',
                idShort: 'action',
                orderRelevant: true,
                typeValueListElement: 'Property',
                value: {
                    modelType: 'Property',
                    valueType: 'xs:string',
                    value: rule.action,
                },
            },
            {
                modelType: 'SubmodelElementCollection',
                idShort: 'targetInformation',
                value: [
                    ...targets.map(([key, value]) => ({
                        modelType: 'SubmodelElementList',
                        idShort: key,
                        orderRelevant: true,
                        typeValueListElement: 'Property',
                        value:
                            typeof value === 'string'
                                ? [{ value, modelType: 'Property', valueType: 'xs:string' }]
                                : value.map((targetId) => ({
                                      modelType: 'Property',
                                      value: targetId,
                                      valueType: 'xs:string',
                                  })),
                    })),
                    {
                        modelType: 'Property',
                        value: rule.targetInformation['@type'],
                        valueType: 'xs:string',
                        idShort: '@type',
                    },
                ],
            },
        ],
    };
}

const BASYX_TARGET_CLASSES: Record<BaSyxRbacRule['targetInformation']['@type'], string> = {
    aas: 'org.eclipse.digitaltwin.basyx.aasrepository.feature.authorization.AasTargetInformation',
    submodel: 'org.eclipse.digitaltwin.basyx.submodelrepository.feature.authorization.SubmodelTargetInformation',
    'aas-environment':
        'org.eclipse.digitaltwin.basyx.aasenvironment.feature.authorization.AasEnvironmentTargetInformation',
    'concept-description':
        'org.eclipse.digitaltwin.basyx.conceptdescriptionrepository.feature.authorization.ConceptDescriptionTargetInformation',
    'aas-discovery-service':
        'org.eclipse.digitaltwin.basyx.aasdiscoveryservice.feature.authorization.AasDiscoveryServiceTargetInformation',
    'aas-registry': 'org.eclipse.digitaltwin.basyx.aasregistry.feature.authorization.AasRegistryTargetInformation',
    'submodel-registry':
        'org.eclipse.digitaltwin.basyx.submodelregistry.feature.authorization.SubmodelRegistryTargetInformation',
};

export function ruleToIdShort(rule: Omit<BaSyxRbacRule, 'idShort'>) {
    const targetClass = BASYX_TARGET_CLASSES[rule.targetInformation['@type']];
    const str = `${rule.role}${rule.action}${targetClass}`;
    return btoa(str);
}

export class RuleParseError extends Error {}
