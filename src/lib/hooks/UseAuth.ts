import { useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { sessionLogOut } from 'lib/api/infrastructure';
import AllowedRoutes, { MnestixRole } from 'components/authentication/AllowedRoutes';
import { useEnv } from 'app/EnvProvider';

export function useAuth() {
    const { data: session, status } = useSession();
    const env = useEnv();

    const bearerToken = useMemo(() => {
        return session ? 'Bearer ' + session.accessToken : '';
    }, [session]);

    const account = useMemo((): Session | null => {
        if (!session || !session.user) {
            return session;
        }

        // Determine role and allowed routes
        const isAdmin = session.user.roles?.find((role) => role === MnestixRole.MnestixAdmin);
        const mnestixRole = isAdmin ? MnestixRole.MnestixAdmin : MnestixRole.MnestixUser;
        const allowedRoutes = isAdmin ? AllowedRoutes.mnestixAdmin : AllowedRoutes.mnestixUser;

        // Return a new session object with computed properties
        return {
            ...session,
            user: {
                ...session.user,
                mnestixRole,
                allowedRoutes,
            },
        };
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
            return account;
        },
        isLoggedIn: status === 'authenticated',
    };
}
