import { rbacRuleActions, rbacRuleTargets, type BaSyxRbacRule } from 'lib/types/RbacServiceData';

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

// TODO MNES-1605 add typing for submodelElement
/* eslint-disable @typescript-eslint/no-explicit-any */
export function submodelToRule(submodelElement: any): BaSyxRbacRule {
    const role = submodelElement.value.find((e: any) => e.idShort === 'role')?.value;
    const actions = submodelElement.value.find((e: any) => e.idShort === 'action')?.value.map((e: any) => e.value) || [];

    if (actions.length > 1) {
        throw new RuleParseError(' is allowed');
    }
    const action: (typeof rbacRuleActions)[number] = actions[0];

    if (!rbacRuleActions.includes(action)) {
        throw new RuleParseError(
            `Invalid action: '${action}' is not allowed for the rule with idShort: '${submodelElement.idShort}'.`
        );
    }

    const targetInformationElement = submodelElement.value.find((e: any) => e.idShort === 'targetInformation');
    const targetType: keyof typeof rbacRuleTargets = targetInformationElement?.value.find(
        (e: any) => e.idShort === '@type'
    )?.value;

    if (!Object.keys(rbacRuleTargets).includes(targetType)) {
        throw new RuleParseError(`Invalid target type: ${targetType}`);
    }

    const targets: [string, string[]][] = targetInformationElement?.value
        .filter((e: { idShort: string; }) => e.idShort !== '@type')
        .map((elem: { idShort: string; value: string[]; }) => {
            const values = (typeof elem.value === 'string' ? [elem.value] : elem.value).map((item: any) => item.value);
            return [elem.idShort, values];
        });

    const invalidTargets = targets.filter(
        ([id]) =>
            //@ts-expect-error typescript does not support computed keys
            !rbacRuleTargets[targetType].includes(id)
    );
    if (invalidTargets.length > 0) {
        throw new RuleParseError(`Invalid target(s): ${invalidTargets.map(([id]) => id).join(', ')}`);
    }

    return {
        idShort: submodelElement.idShort,
        role,
        action: action,
        targetInformation: {
            '@type': targetType,
            ...Object.fromEntries(targets),
        } as BaSyxRbacRule['targetInformation'],
    };
}

