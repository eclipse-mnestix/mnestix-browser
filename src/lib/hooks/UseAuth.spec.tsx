import { beforeEach, describe, expect, it } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { useAuth } from './UseAuth';

// next-auth's browser client bypasses Next's router with plain fetch() calls and
// a raw `window.location.href` redirect, so anything it sends must already carry
// the basePath. These tests pin BASE_PATH to '/viewer' to assert exactly that.
jest.mock('../basePath', () => ({ BASE_PATH: '/viewer' }));
jest.mock('../../app/EnvProvider', () => ({ useEnv: () => ({ KEYCLOAK_ENABLED: true }) }));
jest.mock('../api/sessionLogOut', () => ({ sessionLogOut: jest.fn().mockResolvedValue(undefined) }));
jest.mock('next-auth/react');

import { signIn, signOut, useSession } from 'next-auth/react';
import { sessionLogOut } from 'lib/api/sessionLogOut';

const signInMock = signIn as unknown as jest.Mock;
const signOutMock = signOut as unknown as jest.Mock;
const useSessionMock = useSession as unknown as jest.Mock;

// Captured by a harness component on every render; read back after CustomRender
// mounts it (same pattern as useAasViewerActions.spec).
let auth: ReturnType<typeof useAuth>;

function renderAuth() {
    function Harness() {
        auth = useAuth();
        return <></>;
    }
    CustomRender(<Harness />);
    return auth;
}

describe('useAuth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSessionMock.mockReturnValue({ data: null, status: 'unauthenticated' });
        signOutMock.mockResolvedValue(undefined);
        signInMock.mockResolvedValue(undefined);
    });

    it('signs in via the keycloak provider', () => {
        renderAuth();
        auth.login();
        expect(signInMock).toHaveBeenCalledWith('keycloak');
    });

    it('terminates the keycloak session and redirects below the basePath on logout', async () => {
        renderAuth();

        // No act() needed: every external call is mocked and no React state is touched.
        await auth.logout();

        expect(sessionLogOut).toHaveBeenCalledWith(true);
        // The callbackUrl is used by next-auth for a raw `window.location.href`
        // redirect — without the basePath prefix it would leave the app.
        expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/viewer' });
    });
});
