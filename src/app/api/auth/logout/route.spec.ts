import { GET } from 'app/api/auth/logout/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));
jest.mock('components/authentication/authConfig', () => ({
    authOptions: {},
}));
jest.mock('lib/env/MnestixEnv', () => ({
    envs: {
        KEYCLOAK_ENABLED: true,
        KEYCLOAK_ISSUER: 'https://keycloak.example.com',
        KEYCLOAK_REALM: 'test-realm',
    },
}));

const getServerSessionMock = getServerSession as jest.Mock;

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const END_SESSION_URL = 'https://keycloak.example.com/realms/test-realm/protocol/openid-connect/logout';

describe('GET /api/auth/logout', () => {
    const originalNextAuthUrl = process.env.NEXTAUTH_URL;

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.mockResolvedValue({ ok: true } as unknown as Response);
        getServerSessionMock.mockResolvedValue({ idToken: 'id-token' });
    });

    afterEach(() => {
        if (originalNextAuthUrl === undefined) {
            delete process.env.NEXTAUTH_URL;
        } else {
            process.env.NEXTAUTH_URL = originalNextAuthUrl;
        }
    });

    it('terminates the keycloak session and redirects to the app root below a basePath', async () => {
        // NEXTAUTH_URL points at the auth endpoint base (app root + '/api/auth');
        // the post-logout redirect must land on the app root, not on the API path.
        process.env.NEXTAUTH_URL = 'https://host.example.com/viewer/api/auth';

        const response = await GET();

        expect(fetchMock).toHaveBeenCalledWith(
            `${END_SESSION_URL}?id_token_hint=id-token&post_logout_redirect_uri=https://host.example.com/viewer`,
            { method: 'GET' },
        );
        expect(response.status).toBe(307);
        expect(response.headers.get('location')).toBe('https://host.example.com/viewer');
    });

    it('keeps the plain app root when NEXTAUTH_URL has no path (no basePath)', async () => {
        process.env.NEXTAUTH_URL = 'https://host.example.com';

        const response = await GET();

        expect(fetchMock).toHaveBeenCalledWith(
            `${END_SESSION_URL}?id_token_hint=id-token&post_logout_redirect_uri=https://host.example.com`,
            { method: 'GET' },
        );
        // NextResponse.redirect normalizes via `new URL()`, which appends the
        // trailing slash to a bare origin — same target, normalized form.
        expect(response.headers.get('location')).toBe('https://host.example.com/');
    });

    it('returns 401 without contacting keycloak when there is no session', async () => {
        getServerSessionMock.mockResolvedValue(null);

        const response = await GET();

        expect(response.status).toBe(401);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
