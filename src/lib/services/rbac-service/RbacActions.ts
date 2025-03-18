'use server';

import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { authOptions } from 'components/authentication/authConfig';
import { getServerSession } from 'next-auth';
import { RbacRulesService } from './RbacRulesService';
import { ApiResultStatus, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

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
    const roles = await client.getRules(securitySubmodel);
    return roles;
}
