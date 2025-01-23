import React from 'react';
import { useAuth } from 'lib/hooks/UseAuth';
import { useEnv } from 'app/env/provider';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';

export function PrivateRoute({ children }: { children: React.JSX.Element }) {
    const auth = useAuth();
    const env = useEnv();
    const useAuthentication = env.AUTHENTICATION_FEATURE_FLAG;

    return <>{!useAuthentication || auth.isLoggedIn ? <>{children}</> : <AuthenticationPrompt />}</>;
}
