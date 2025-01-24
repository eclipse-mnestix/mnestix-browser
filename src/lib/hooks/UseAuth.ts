import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { sessionLogOut } from 'lib/api/infrastructure';
import { useEnv } from 'app/env/provider';

export function useAuth(): Auth {
    const [bearerToken, setBearerToken] = useState<string>('');
    const { data: session, status } = useSession();
    const env = useEnv();

    useAsyncEffect(async () => {
        if (session) {
            setBearerToken('Bearer ' + session.accessToken);
        } else {
            // TODO forward to login
        }
    }, [session]);

    const providerType = env.KEYCLOAK_ENABLED ? 'keycloak' : 'azure-ad';

    return {
        getBearerToken: (): string => {
            return bearerToken;
        },
        login: (): void => {
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
            if (session) {
                session.user.isAdmin = !!(
                    session.user.role && session.user.role.find((role) => role === 'mnestix-admin')
                );
            }
            return session;
        },
        isLoggedIn: status === 'authenticated',
    };
}

export interface Auth {
    getBearerToken: () => string;
    login: () => void;
    logout: () => void;
    getAccount: () => Session | null;
    isLoggedIn: boolean;
}
