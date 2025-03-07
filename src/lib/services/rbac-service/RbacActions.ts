'use server';

import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { authOptions } from 'components/authentication/authConfig';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { RbacRulesService } from './RbacRolesService';

export async function getRbacRules() {
    const session = await getServerSession(authOptions);
    if (!session?.user.roles.includes(MnestixRole.MnestixAdmin)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const client = RbacRulesService.create();
    const roles = await client.getRules();
    return roles;
}
