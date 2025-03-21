import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { z, ZodError } from 'zod';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';

const SEC_SUB_ID = 'SecuritySubmodel';
export type RbacRolesFetchResult = {
    roles: BaSyxRbacRule[];
    warnings: string[][];
};

/**
 * Service for interacting with BaSyx Dynamic RBAC rules
 */
export class RbacRulesService {
    private constructor(private readonly securitySubmodelRepositoryClient: ISubmodelRepositoryApi) {}

    static createService(): RbacRulesService {
        const baseUrl = process.env.SEC_SM_API_URL;

        if (!baseUrl) {
            throw 'Security Submodel not configured! Check beforehand!';
        }

        return new RbacRulesService(SubmodelRepositoryApi.create(baseUrl, mnestixFetch()));
    }

    async createRule(newRule: Omit<BaSyxRbacRule, 'idShort'>): Promise<ApiResponseWrapper<BaSyxRbacRule>> {
        const newIdShort = ruleToIdShort(newRule);
        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const { isSuccess, result } = await this.securitySubmodelRepositoryClient.postSubmodelElementByPath(
            SEC_SUB_ID,
            ruleSubmodelElement,
        );
        if (!isSuccess) {
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                'Failed to create Rule in SecuritySubmodel Repo',
            );
        }
        return wrapSuccess(submodelToRule(result));
    }

    static createNull(submodel: Submodel, reachable = ServiceReachable.Yes): RbacRulesService {
        return new RbacRulesService(SubmodelRepositoryApi.createNull('', [submodel], reachable));
    }

    /**
     * Get all rbac rules
     */
    async getRules(): Promise<ApiResponseWrapper<RbacRolesFetchResult>> {
        const { isSuccess, result: secSM } = await this.securitySubmodelRepositoryClient.getSubmodelById(SEC_SUB_ID);
        if (!isSuccess) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to get RBAC');
        }
        if (!secSM || typeof secSM !== 'object') {
            return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Submodel in wrong Format');
        }

        const parsedRoles =
            secSM.submodelElements
                ?.filter((e) => (e as SubmodelElementCollection).value)
                .map((roleElement) => {
                    try {
                        return roleSpec.parse(submodelToRule(roleElement));
                    } catch (err) {
                        if (err instanceof ZodError) {
                            return { error: err.errors.map((e) => e.message) };
                        }
                        if (err instanceof ParseError) {
                            return { error: `SubmodelElement ${roleElement?.idShort} was not parsable to RBAC rule` };
                        }
                        throw err;
                    }
                }) ?? [];
        const roles = parsedRoles.filter((r): r is BaSyxRbacRule => !('error' in r));
        const warnings = parsedRoles.filter((r): r is { error: string[] } => 'error' in r).map((e) => e.error);

        return wrapSuccess({ roles: roles, warnings: warnings });
    }

    /**
     * Deletes a rule and creates a new rule with new idShort
     */
    async deleteAndCreate(idShort: string, newRule: BaSyxRbacRule): Promise<ApiResponseWrapper<BaSyxRbacRule>> {
        const { isSuccess: isSuccessDelete } = await this.securitySubmodelRepositoryClient.deleteSubmodelElementByPath(
            SEC_SUB_ID,
            idShort,
        );
        if (isSuccessDelete) {
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                // todo 404
                'Failed to delete Rule in SecuritySubmodel Repo',
            );
        }

        const newIdShort = ruleToIdShort(newRule);
        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const { isSuccess, result } = await this.securitySubmodelRepositoryClient.postSubmodelElementByPath(
            SEC_SUB_ID,
            ruleSubmodelElement,
        );
        if (!isSuccess) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to set Rule in SecuritySubmodel Repo');
        }
        return wrapSuccess(submodelToRule(result));
    }

    /**
     * Deletes a rule
     */
    async delete(idShort: string): Promise<ApiResponseWrapper<undefined>> {
        const { isSuccess } = await this.securitySubmodelRepositoryClient.deleteSubmodelElementByPath(
            SEC_SUB_ID,
            idShort,
        );
        if (isSuccess) {
            return wrapSuccess(undefined);
        }
        return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to set Rule in SecuritySubmodel Repo');
    }
}

// TODO MNES-1605
/* eslint-disable @typescript-eslint/no-explicit-any */
function submodelToRule(submodelElement: any): BaSyxRbacRule {
    try {
        const role = submodelElement.value.find((e: any) => e.idShort === 'role')?.value;
        const actions =
            submodelElement.value.find((e: any) => e.idShort === 'action')?.value.map((e: any) => e.value) || [];

        const targetInformationElement = submodelElement.value.find((e: any) => e.idShort === 'targetInformation');
        const targetType = targetInformationElement?.value.find((e: any) => e.idShort === '@type')?.value;

        const targets = targetInformationElement?.value
            .filter((e: any) => e.idShort !== '@type')
            .reduce((acc: Record<string, string[] | string>, elem: any) => {
                const values =
                    typeof elem.value === 'string' ? [elem.value] : elem.value.map((item: any) => item.value);
                acc[elem.idShort] = values.length === 1 ? values[0] : values;
                return acc;
            }, {});

        return {
            idShort: submodelElement.idShort,
            role,
            action: actions,
            targetInformation: {
                '@type': targetType,
                ...targets,
            },
        };
    } catch (err) {
        throw new ParseError(err);
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// TODO MNES-1605
function ruleToSubmodelElement(idShort: string, rule: Omit<BaSyxRbacRule, 'idShort'>) {
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
                value: rule.action.map((e) => ({
                    modelType: 'Property',
                    valueType: 'xs:string',
                    value: e,
                })),
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
                        value: 'aas',
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

function ruleToIdShort(rule: Omit<BaSyxRbacRule, 'idShort'>) {
    const targetClass = BASYX_TARGET_CLASSES[rule.targetInformation['@type']];
    const str = `${rule.role}${rule.action.toSorted().join('+')}${targetClass}`;
    return btoa(str);
}

class ParseError extends Error {}

const strOrArray = z.union([z.string(), z.array(z.string())]);
const actions = z.union([
    z.literal('READ'),
    z.literal('CREATE'),
    z.literal('UPDATE'),
    z.literal('DELETE'),
    z.literal('EXECUTE'),
]);
const roleSpec = z.object({
    idShort: z.string(),
    targetInformation: z.discriminatedUnion('@type', [
        z
            .object({
                '@type': z.literal('aas-environment'),
                aasIds: strOrArray,
                submodelIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas'),
                aasIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('submodel'),
                submodelIds: strOrArray,
                submodelElementIdShortPaths: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('concept-description'),
                conceptDescriptionIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas-registry'),
                aasIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('submodel-registry'),
                submodelIds: strOrArray,
            })
            .strict(),
        z
            .object({
                '@type': z.literal('aas-discovery-service'),
                aasIds: strOrArray,
                assetIds: strOrArray,
            })
            .strict(),
    ]),
    role: z.string(),
    action: z.array(actions),
});

export type BaSyxRbacRule = z.infer<typeof roleSpec>;
