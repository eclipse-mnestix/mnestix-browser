import { ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { SubmodelElementCollection } from 'lib/api/aas/models';
import { envs } from 'lib/env/MnestixEnv';
import { RuleParseError, ruleToIdShort, ruleToSubmodelElement, submodelToRule } from './RuleHelpers';
import logger, { logResponseDebug, logResponseInfo, logResponseWarn } from 'lib/util/Logger';
import { BaSyxRbacRule, RbacRulesFetchResult } from 'lib/services/rbac-service/types/RbacServiceData';

const SEC_SUB_ID = 'SecuritySubmodel';
/**
 * Service for interacting with BaSyx Dynamic RBAC rules
 */
export class RbacRulesService {
    private constructor(
        private readonly securitySubmodelRepositoryClient: ISubmodelRepositoryApi,
        private readonly log: typeof logger = logger,
    ) {}

    static createService(log?: typeof logger): RbacRulesService {
        const baseUrl = envs.BASYX_RBAC_SEC_SM_API_URL;

        if (!baseUrl) {
            throw 'Security Submodel not configured! Check beforehand!';
        }
        const rbacRulesServiceLogger = log?.child({ Service: 'RbacRulesService' });
        return new RbacRulesService(SubmodelRepositoryApi.create(baseUrl, mnestixFetch()), rbacRulesServiceLogger);
    }

    static createNull(subRepoApi: ISubmodelRepositoryApi): RbacRulesService {
        return new RbacRulesService(subRepoApi);
    }

    async createRule(newRule: Omit<BaSyxRbacRule, 'idShort'>): Promise<ApiResponseWrapper<BaSyxRbacRule>> {
        const error = getRuleErrorOrUndefined(newRule);
        if (error) {
            return wrapErrorCode(ApiResultStatus.BAD_REQUEST, error);
        }

        const newIdShort = ruleToIdShort(newRule);
        if (!(await this.isIdShortUnique(newIdShort))) {
            return wrapErrorCode(
                ApiResultStatus.CONFLICT,
                'IdShort already exists. Role name, action and target type must be unique.',
            );
        }
        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const response = await this.securitySubmodelRepositoryClient.postSubmodelElement(
            SEC_SUB_ID,
            ruleSubmodelElement,
        );
        if (!response.isSuccess) {
            logResponseWarn(this.log, 'createRule', 'Failed to create Rule', response, {
                Rule: newRule.role,
                IdShort: newIdShort,
            });
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                'Failed to create Rule in SecuritySubmodel Repo',
            );
        }
        logResponseDebug(this.log, 'createRule', 'Rule created', response, {
            Rule: newRule.role,
            IdShort: newIdShort,
        });
        return wrapSuccess(submodelToRule(response.result));
    }

    /**
     * Get all rbac rules
     */
    async getRules(): Promise<ApiResponseWrapper<RbacRulesFetchResult>> {
        const response = await this.securitySubmodelRepositoryClient.getSubmodelById(SEC_SUB_ID);
        const secSM = response.result;
        if (!response.isSuccess) {
            logResponseWarn(this.log, 'getRules', 'Failed to get RBAC', response);
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to get RBAC');
        }
        if (!secSM || typeof secSM !== 'object') {
            logResponseWarn(this.log, 'getRules', 'Failed to get RBAC', response);
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
        logResponseDebug(this.log, 'getRules', 'Fetched RBAC rules', response, {
            Roles: roles.length,
            Warnings: warnings,
        });
        return wrapSuccess({ rules: roles, warnings: warnings });
    }

    /**
     * Deletes a rule and creates a new rule with new idShort
     */
    async deleteAndCreate(
        idShort: string,
        newRule: Omit<BaSyxRbacRule, 'idShort'>,
    ): Promise<ApiResponseWrapper<BaSyxRbacRule>> {
        const errorMsg = getRuleErrorOrUndefined(newRule);
        if (errorMsg) {
            return wrapErrorCode(ApiResultStatus.BAD_REQUEST, errorMsg);
        }

        const newIdShort = ruleToIdShort(newRule);
        if (idShort !== newIdShort && !(await this.isIdShortUnique(newIdShort))) {
            return wrapErrorCode(
                ApiResultStatus.CONFLICT,
                'IdShort already exists. Role name, action and target type must be unique.',
            );
        }

        const deleteRes = await this.securitySubmodelRepositoryClient.deleteSubmodelElementByPath(SEC_SUB_ID, idShort);
        if (!deleteRes.isSuccess) {
            if (deleteRes.errorCode === ApiResultStatus.NOT_FOUND) {
                logResponseInfo(this.log, 'deleteAndCreate', 'Failed to delete Rule', deleteRes, {
                    Rule: idShort,
                });
                return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'Rule not found in SecuritySubmodel. Try reloading.');
            }
            logResponseWarn(this.log, 'deleteAndCreate', 'Failed to delete Rule', deleteRes, {
                Rule: idShort,
            });
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                'Failed to delete Rule in SecuritySubmodel Repo due to unknown error.',
            );
        }

        const ruleSubmodelElement = ruleToSubmodelElement(newIdShort, newRule);

        const response = await this.securitySubmodelRepositoryClient.postSubmodelElement(
            SEC_SUB_ID,
            ruleSubmodelElement,
        );
        if (!response.isSuccess) {
            logResponseWarn(this.log, 'createRule', 'Failed to create Rule', response, {
                Rule: newRule.role,
                IdShort: newIdShort,
            });
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to set Rule in SecuritySubmodel Repo');
        }
        logResponseDebug(this.log, 'createRule', 'Rule created', response, {
            Rule: newRule.role,
            IdShort: newIdShort,
        });
        return wrapSuccess(submodelToRule(response.result));
    }

    /**
     * Deletes a rule
     */
    async delete(idShort: string): Promise<ApiResponseWrapper<undefined>> {
        const response = await this.securitySubmodelRepositoryClient.deleteSubmodelElementByPath(SEC_SUB_ID, idShort);
        if (response.isSuccess) {
            logResponseDebug(this.log, 'delete', 'Rule deleted', response, { Rule: idShort });
            return wrapSuccess(undefined);
        }
        if (response.errorCode === ApiResultStatus.NOT_FOUND) {
            logResponseInfo(this.log, 'delete', 'Rule not found', response, { Rule: idShort });
            return wrapErrorCode(ApiResultStatus.NOT_FOUND, 'Rule not found in SecuritySubmodel');
        }
        logResponseWarn(this.log, 'delete', 'Failed to delete Rule', response, { Rule: idShort });
        return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Failed to set Rule in SecuritySubmodel Repo');
    }

    private async isIdShortUnique(idShort: string) {
        const rules = await this.getRules();
        if (!rules.isSuccess) {
            return false;
        }

        return !rules.result.rules.find((e) => e.idShort === idShort);
    }
}

function getRuleErrorOrUndefined(rule: Omit<BaSyxRbacRule, 'idShort'>) {
    if (rule.role.length > 1000) {
        return 'Role name is too long';
    }
    return undefined;
}
