'use server';

import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { authOptions } from 'components/authentication/authConfig';
import { getServerSession } from 'next-auth';
import { BaSyxRbacRule, RbacRulesService } from './RbacRulesService';
import { wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { envs } from 'lib/env/MnestixEnv';

async function requestInvalid() {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles || !session?.user.roles?.includes(MnestixRole.MnestixAdmin)) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }
    // TODO MNES-1633 validate on app startup
    const baseUrl = envs.SEC_SM_API_URL;
    if (!baseUrl) {
        return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Security Submodel not configured!');
    }
    return undefined;
}

/**
 * Create a rule
 */
export async function createRbacRule(newRule: Omit<BaSyxRbacRule, 'idShort'>) {
    const invalid = await requestInvalid();
    if (invalid) {
        return invalid;
    }
    const client = RbacRulesService.createService();
    const res = await client.createRule(newRule);
    return res;
}

/**
 * Get all rbac rules
 */
export async function getRbacRules() {
    const invalid = await requestInvalid();
    if (invalid) {
        return invalid;
    }

    const client = RbacRulesService.createService();
    const rules = await client.getRules();
    return rules;
}

/**
 * Deletes a rule.
 */
export async function deleteRbacRule(idShort: string) {
    const invalid = await requestInvalid();
    if (invalid) {
        return invalid;
    }

    const client = RbacRulesService.createService();
    const res = await client.delete(idShort);
    return res;
}

/**
 * Deletes a rule and creates a new rule with new idShort.
 */
export async function deleteAndCreateRbacRule(idShort: string, rule: BaSyxRbacRule) {
    const invalid = await requestInvalid();
    if (invalid) {
        return invalid;
    }

    const client = RbacRulesService.createService();
    const res = await client.deleteAndCreate(idShort, rule);
    return res;
}
