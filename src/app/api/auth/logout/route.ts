import { getServerSession } from 'next-auth';
import { authOptions } from 'components/authentication/authConfig';
import { NextResponse } from 'next/server';
import { envs } from 'lib/env/MnestixEnv';

export async function GET() {
    const session = await getServerSession(authOptions);
    const redirectUri = process.env.NEXTAUTH_URL || '';
    const endSessionUrl = envs.KEYCLOAK_ENABLED
        ? `${envs.KEYCLOAK_ISSUER}/realms/${envs.KEYCLOAK_REALM}/protocol/openid-connect/logout`
        : '';
    try {
        if (session) {
            const idToken = session.idToken;

            const url = `${endSessionUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;

            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) {
                console.error('Failed to log out from Keycloak:', response.statusText);
                return new NextResponse('Failed to log out', { status: 500 });
            }

            return NextResponse.redirect(redirectUri);
        }

        return new NextResponse('Unauthorized', { status: 401 });
    } catch (err) {
        console.error('Error logging out:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
