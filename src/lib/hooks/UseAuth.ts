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
                // Determine role and allowed routes based on user roles
                const isAdmin = session.user.roles?.find((role) => role === MnestixRole.MnestixAdmin);
                const mnestixRole = isAdmin ? MnestixRole.MnestixAdmin : MnestixRole.MnestixUser;
                const allowedRoutes = isAdmin ? AllowedRoutes.mnestixAdmin : AllowedRoutes.mnestixUser;

                // Return a new session object with the computed properties
                return {
                    ...session,
                    user: {
                        ...session.user,
                        mnestixRole,
                        allowedRoutes,
                    },
                };
            }
            return session;
        },
        isLoggedIn: status === 'authenticated',
    };
}
