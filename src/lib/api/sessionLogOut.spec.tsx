import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { sessionLogOut } from './sessionLogOut';

// Regression test: the logout fetch must carry the basePath prefix. A plain
// fetch() gets no prefix from Next.js, so without it the route is not found and
// the Keycloak SSO session is never terminated (the user only *looks* logged out).
jest.mock('../basePath', () => ({ BASE_PATH: '/viewer' }));

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

describe('sessionLogOut', () => {
    beforeEach(() => {
        fetchMock.mockReset();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('fetches the logout route below the basePath', async () => {
        fetchMock.mockResolvedValue(undefined);
        await sessionLogOut(true);
        expect(fetchMock).toHaveBeenCalledWith('/viewer/api/auth/logout', { method: 'GET' });
    });

    it('does not fetch the logout route when keycloak is disabled', async () => {
        await sessionLogOut(false);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('swallows fetch errors so the local sign-out still proceeds', async () => {
        fetchMock.mockRejectedValue(new Error('network down'));
        await expect(sessionLogOut(true)).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalled();
    });
});
