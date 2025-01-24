import React from 'react';
import { useAuth } from 'lib/hooks/UseAuth';
import { useEnv } from 'app/env/provider';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import Roles from 'components/authentication/Roles';
import { NotAllowedPrompt } from 'components/authentication/NotAllowedPrompt';

export function PrivateRoute({ currentRoute, children }: { currentRoute: string; children: React.JSX.Element }) {
    const auth = useAuth();
    const env = useEnv();
    const isAdmin = auth.getAccount()?.user.isAdmin;
    const allowedRoutes = isAdmin ? Roles.mnestixAdmin : Roles.mnestixUser;
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
