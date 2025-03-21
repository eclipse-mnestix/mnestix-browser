'use server';

import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { authOptions } from 'components/authentication/authConfig';
import { getServerSession } from 'next-auth';
import { BaSyxRbacRule, RbacRulesService } from './RbacRulesService';
import { wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export async function createRbacRule(newRule: Omit<BaSyxRbacRule, 'idShort'>) {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles || !session?.user.roles?.includes(MnestixRole.MnestixAdmin)) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }

    const securitySubmodel = process.env.SEC_SM_API_URL ?? '';
    if (!securitySubmodel || securitySubmodel === '') {
        return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Security Submodel not configured!');
    }

    const client = RbacRulesService.create();
    const res = await client.createRule(securitySubmodel, newRule);
    return res;
}

export async function getRbacRules() {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles || !session?.user.roles?.includes(MnestixRole.MnestixAdmin)) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }

    const securitySubmodel = process.env.SEC_SM_API_URL ?? '';
    if (!securitySubmodel || securitySubmodel === '') {
        return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Security Submodel not configured!');
    }

    const client = RbacRulesService.create();
    const rules = await client.getRules(securitySubmodel);
    return rules;
}

export async function deleteRbacRule(idShort: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles || !session?.user.roles?.includes(MnestixRole.MnestixAdmin)) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }

    const securitySubmodel = process.env.SEC_SM_API_URL ?? '';
    if (!securitySubmodel || securitySubmodel === '') {
        return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Security Submodel not configured!');
    }

    const client = RbacRulesService.create();
    const res = await client.delete(securitySubmodel, idShort);
    return res;
}

/**
 * @returns newIdShort
 */
export async function deleteAndCreateRbacRule(idShort: string, rule: BaSyxRbacRule) {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles || !session?.user.roles?.includes(MnestixRole.MnestixAdmin)) {
        return wrapErrorCode(ApiResultStatus.FORBIDDEN, 'Forbidden');
    }

    const securitySubmodel = process.env.SEC_SM_API_URL ?? '';
    if (!securitySubmodel || securitySubmodel === '') {
        return wrapErrorCode(ApiResultStatus.BAD_REQUEST, 'Security Submodel not configured!');
    }

    const client = RbacRulesService.create();
    const res = await client.deleteAndCreate(securitySubmodel, idShort, rule);
    return res;
}
