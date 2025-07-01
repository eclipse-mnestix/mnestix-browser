export const rbacRuleActions = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXECUTE'] as const;

export const rbacRuleTargets = {
    'aas-environment': ['aasIds', 'submodelIds'],
    aas: ['aasIds'],
    submodel: ['submodelIds', 'submodelElementIdShortPaths'],
    'concept-description': ['conceptDescriptionIds'],
    'aas-registry': ['aasIds'],
    'submodel-registry': ['submodelIds'],
    'aas-discovery-service': ['aasIds', 'assetIds'],
} as const;

export type TargetInformation = { '@type': 'aas-environment'; aasIds: string[]; submodelIds: string[]; } |
{ '@type': 'aas'; aasIds: string[]; } |
{ '@type': 'submodel'; submodelIds: string[]; submodelElementIdShortPaths: string[]; } |
{ '@type': 'concept-description'; conceptDescriptionIds: string[]; } |
{ '@type': 'aas-registry'; aasIds: string[]; } |
{ '@type': 'submodel-registry'; submodelIds: string[]; } |
{ '@type': 'aas-discovery-service'; aasIds: string[]; assetIds: string[]; };

export type BaSyxRbacRule = {
    idShort: string;
    targetInformation: TargetInformation;
    role: string;
    action: (typeof rbacRuleActions)[number];
};
export type RbacRulesFetchResult = {
    rules: BaSyxRbacRule[];
    warnings: string[][];
};

