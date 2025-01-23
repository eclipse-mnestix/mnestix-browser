import NextAuth, { DefaultSession, User } from 'next-auth';
import { authOptions } from 'authConfig';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken: string;
        idToken: string;
        user: {
            role: string[];
        } & User;
    }
}
