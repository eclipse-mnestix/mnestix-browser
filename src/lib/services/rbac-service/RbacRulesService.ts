import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { envs } from 'lib/env/MnestixEnv';
import { RuleParseError, ruleToIdShort, ruleToSubmodelElement } from './RuleHelpers';

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
        const baseUrl = envs.SEC_SM_API_URL;

        if (!baseUrl) {
            throw 'Security Submodel not configured! Check beforehand!';
        }

        return new RbacRulesService(SubmodelRepositoryApi.create(baseUrl, mnestixFetch()));
    }

    async createRule(newRule: Omit<BaSyxRbacRule, 'idShort'>): Promise<ApiResponseWrapper<BaSyxRbacRule>> {
        const newIdShort = ruleToIdShort(newRule);
        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const { isSuccess, result } = await this.securitySubmodelRepositoryClient.postSubmodelElement(
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

    static createNull(subRepoApi: ISubmodelRepositoryApi): RbacRulesService {
        return new RbacRulesService(subRepoApi);
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
                ?.filter((e) => (e as SubmodelElementCollection | undefined)?.value)
                .map((roleElement) => {
                    try {
                        return submodelToRule(roleElement);
                    } catch (err) {
                        if (err instanceof RuleParseError) {
                            if (err.message) {
                                return { error: [err.message] };
                            }
                            return { error: [`SubmodelElement ${roleElement?.idShort} was not parsable to RBAC rule`] };
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
        const deleteRes = await this.securitySubmodelRepositoryClient.deleteSubmodelElementByPath(SEC_SUB_ID, idShort);
        if (!deleteRes.isSuccess) {
            if (deleteRes.errorCode === ApiResultStatus.NOT_FOUND) {
                return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'Rule not found in SecuritySubmodel. Try reloading.');
            }
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                'Failed to delete Rule in SecuritySubmodel Repo due to unknown error.',
            );
        }

        const newIdShort = ruleToIdShort(newRule);
        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const { isSuccess, result } = await this.securitySubmodelRepositoryClient.postSubmodelElement(
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

// TODO MNES-1605 add typing for submodelElement
/* eslint-disable @typescript-eslint/no-explicit-any */
export function submodelToRule(submodelElement: any): BaSyxRbacRule {
    const role = submodelElement.value.find((e: any) => e.idShort === 'role')?.value;
    const actions =
        submodelElement.value.find((e: any) => e.idShort === 'action')?.value.map((e: any) => e.value) || [];

    if (actions.length > 1) {
        throw new RuleParseError(' is allowed');
    }
    const action: (typeof rbacRuleActions)[number] = actions[0];

    if (!rbacRuleActions.includes(action)) {
        throw new RuleParseError(
            `Invalid action: '${action}' is not allowed for the rule with idShort: '${submodelElement.idShort}'.`,
        );
    }

    const targetInformationElement = submodelElement.value.find((e: any) => e.idShort === 'targetInformation');
    const targetType: keyof typeof rbacRuleTargets = targetInformationElement?.value.find(
        (e: any) => e.idShort === '@type',
    )?.value;

    if (!Object.keys(rbacRuleTargets).includes(targetType)) {
        throw new RuleParseError(`Invalid target type: ${targetType}`);
    }

    const targets: [string, string[]][] = targetInformationElement?.value
        .filter((e: { idShort: string }) => e.idShort !== '@type')
        .map((elem: { idShort: string; value: string[] }) => {
            const values = (typeof elem.value === 'string' ? [elem.value] : elem.value).map((item: any) => item.value);
            return [elem.idShort, values];
        });

    const invalidTargets = targets.filter(
        ([id]) =>
            //@ts-expect-error typescript does not support computed keys
            !rbacRuleTargets[targetType].includes(id),
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

/* eslint-enable @typescript-eslint/no-explicit-any */

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

export type TargetInformation =
    | { '@type': 'aas-environment'; aasIds: string[]; submodelIds: string[] }
    | { '@type': 'aas'; aasIds: string[] }
    | { '@type': 'submodel'; submodelIds: string[]; submodelElementIdShortPaths: string[] }
    | { '@type': 'concept-description'; conceptDescriptionIds: string[] }
    | { '@type': 'aas-registry'; aasIds: string[] }
    | { '@type': 'submodel-registry'; submodelIds: string[] }
    | { '@type': 'aas-discovery-service'; aasIds: string[]; assetIds: string[] };

export type BaSyxRbacRule = {
    idShort: string;
    targetInformation: TargetInformation;
    role: string;
    action: (typeof rbacRuleActions)[number];
};
