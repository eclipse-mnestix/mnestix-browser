import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { sessionLogOut } from 'lib/api/infrastructure';
import AllowedRoutes, { MnestixRole } from 'components/authentication/AllowedRoutes';
import { useEnv } from 'app/EnvProvider';

export function useAuth() {
    const [bearerToken, setBearerToken] = useState<string>('');
    const { data: session, status } = useSession();
    const env = useEnv();

    useAsyncEffect(async () => {
        if (session) {
            setBearerToken('Bearer ' + session.accessToken);
        }
    }, [session]);

    const providerType = env.KEYCLOAK_ENABLED ? 'keycloak' : 'azure-ad';

    return {
        getBearerToken: (): string => {
            return bearerToken;
        },
        login: () => {
            signIn(providerType).catch((e) => {
                console.error(e);
            });
        },
        logout: async (): Promise<void> => {
            await sessionLogOut(env.KEYCLOAK_ENABLED).then(() =>
                signOut({ callbackUrl: '/' }).catch((e) => {
                    console.error(e);
                }),
            );
        },
        getAccount: (): Session | null => {
            if (session && session.user) {
                // MnestixUser is the default role for a logged-in user
                session.user.mnestixRole = MnestixRole.MnestixUser;
                session.user.allowedRoutes = AllowedRoutes.mnestixUser;

                if (session.user.roles && session.user.roles.find((role) => role === MnestixRole.MnestixAdmin)) {
                    session.user.mnestixRole = MnestixRole.MnestixAdmin;
                    session.user.allowedRoutes = AllowedRoutes.mnestixAdmin;
                }
            }
            return session;
        },
        isLoggedIn: status === 'authenticated',
    };
}
