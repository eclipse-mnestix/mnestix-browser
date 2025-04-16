'use server';

import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { authOptions } from 'components/authentication/authConfig';
import { getServerSession } from 'next-auth';
import { RbacRulesService } from './RbacRulesService';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { envs } from 'lib/env/MnestixEnv';
import { createRequestLogger, logInfo, logWarn } from 'lib/util/Logger';
import { headers } from 'next/headers';
import baseLogger from 'lib/util/Logger';

async function validateRequest(logger: typeof baseLogger) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return wrapErrorCode(ApiResultStatus.UNAUTHORIZED, 'Unauthorized');
    }

    if (!session.user.roles.includes(MnestixRole.MnestixAdmin)) {
        logWarn(logger, 'validateRequest', 'User is not authorized to access this resource');
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }
    
    // TODO MNES-1633 validate on app startup (logged in validation)
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
    const logger = createRequestLogger(await headers());
    const invalid = await validateRequest(logger);
    if (invalid) {
        return invalid;
    }
    logInfo(logger, 'createRbacRule', 'Creating new RBAC rule', { New_rule: newRule.role });
    const client = RbacRulesService.createService(logger);
    const res = await client.createRule(newRule);
    return res;
}

/**
 * Get all rbac rules
 */
export async function getRbacRules() {
    const logger = createRequestLogger(await headers());
    const invalid = await validateRequest(logger);
    if (invalid) {
        return invalid;
    }
    logInfo(logger, 'getRbacRules', 'Querying all RBAC rules');
    const client = RbacRulesService.createService(logger);
    const rules = await client.getRules();
    return rules;
}

/**
 * Deletes a rule.
 */
export async function deleteRbacRule(idShort: string) {
    const logger = createRequestLogger(await headers());
    const invalid = await validateRequest(logger);
    if (invalid) {
        return invalid;
    }
    logInfo(logger, 'deleteRbacRule', 'Deleting RBAC rule', { Rule_idShort: idShort });
    const client = RbacRulesService.createService(logger);
    const res = await client.delete(idShort);
    return res;
}

/**
 * Deletes a rule and creates a new rule with new idShort.
 */
export async function deleteAndCreateRbacRule(idShort: string, rule: BaSyxRbacRule) {
    const logger = createRequestLogger(await headers());
    const invalid = await validateRequest(logger);
    if (invalid) {
        return invalid;
    }
    logInfo(logger, 'deleteAndCreateRbacRule', 'Deleting and creating RBAC rule', {
        Rule_idShort: idShort,
        New_rule: rule.role,
    });
    const client = RbacRulesService.createService(logger);
    const res = await client.deleteAndCreate(idShort, rule);
    return res;
}
