import { requireAdmin, requireRole, getAuthError, AuthorizationError } from './authGuard';
import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { getServerSession } from 'next-auth';
import { envs } from 'lib/env/MnestixEnv';

jest.mock('next-auth');
jest.mock('lib/env/MnestixEnv');
jest.mock('components/authentication/authConfig');

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedEnvs = envs as jest.Mocked<typeof envs>;

function sessionWithRoles(roles: string[]) {
    return {
        accessToken: '',
        idToken: '',
        user: { roles, mnestixRole: roles[0], allowedRoutes: [] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
}

describe('requireAdmin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = false;
    });

    it('resolves without a session when the authentication feature flag is off', async () => {
        mockedGetServerSession.mockResolvedValue(null);
        await expect(requireAdmin()).resolves.toBeUndefined();
    });

    it('throws AuthorizationError with status 401 when auth is on and there is no session', async () => {
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
        mockedGetServerSession.mockResolvedValue(null);
        await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
        await expect(requireAdmin()).rejects.toBeInstanceOf(AuthorizationError);
    });

    it('throws AuthorizationError with status 403 when the session role is not admin', async () => {
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['mnestix-user']));
        await expect(requireAdmin()).rejects.toMatchObject({ status: 403 });
    });

    it('resolves when auth is on and the session has the admin role', async () => {
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['mnestix-admin']));
        await expect(requireAdmin()).resolves.toBeUndefined();
    });
});

describe('requireRole', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
    });

    it('resolves when the session holds one of several allowed roles', async () => {
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['mnestix-user']));
        await expect(requireRole(MnestixRole.MnestixAdmin, MnestixRole.MnestixUser)).resolves.toBeUndefined();
    });

    it('throws 403 when the session holds none of the allowed roles', async () => {
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['guest']));
        await expect(requireRole(MnestixRole.MnestixAdmin, MnestixRole.MnestixUser)).rejects.toMatchObject({
            status: 403,
        });
    });
});

describe('getAuthError', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
    });

    it('returns undefined when authentication is disabled', async () => {
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = false;
        mockedGetServerSession.mockResolvedValue(null);
        await expect(getAuthError([MnestixRole.MnestixAdmin])).resolves.toBeUndefined();
    });

    it('returns 401 when there is no session', async () => {
        mockedGetServerSession.mockResolvedValue(null);
        await expect(getAuthError([MnestixRole.MnestixAdmin])).resolves.toEqual({ status: 401, message: 'Unauthorized' });
    });

    it('returns 403 when the session lacks an allowed role', async () => {
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['mnestix-user']));
        await expect(getAuthError([MnestixRole.MnestixAdmin])).resolves.toEqual({ status: 403, message: 'Forbidden' });
    });

    it('returns undefined when the session has an allowed role', async () => {
        mockedGetServerSession.mockResolvedValue(sessionWithRoles(['mnestix-admin']));
        await expect(getAuthError([MnestixRole.MnestixAdmin])).resolves.toBeUndefined();
    });
});
