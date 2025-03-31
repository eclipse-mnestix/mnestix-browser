import React from 'react';
import { useAuth } from 'lib/hooks/UseAuth';
import { useEnv } from 'app/EnvProvider';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import { NotAllowedPrompt } from 'components/authentication/NotAllowedPrompt';

export function PrivateRoute({ currentRoute, children }: { currentRoute: string; children: React.JSX.Element }) {
    const auth = useAuth();
    const env = useEnv();
    const allowedRoutes = auth.getAccount()?.user.allowedRoutes ?? [];
    const useAuthentication = env.AUTHENTICATION_FEATURE_FLAG;

    if (!useAuthentication) return <>{children}</>;

    if (useAuthentication && auth.isLoggedIn) {
        if (allowedRoutes.includes(currentRoute)) {
            return <>{children}</>;
        } else {
            return <NotAllowedPrompt />;
        }
    }
    return <AuthenticationPrompt />;
}
