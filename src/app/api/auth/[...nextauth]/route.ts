import NextAuth, { DefaultSession, User } from 'next-auth';
import { authOptions } from 'components/authentication/authConfig';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken: string;
        idToken: string;
        user: {
            roles: string[];
            mnestixRole: MnestixRole;
            allowedRoutes: string[];
        } & User;
    }
}
