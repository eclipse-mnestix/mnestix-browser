import { performServerFetch, performServerFetchRaw } from './serverFetch';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue({}) }));
jest.mock('lib/util/Logger', () => ({
    createRequestLogger: () => ({ debug: jest.fn(), warn: jest.fn(), error: jest.fn() }),
}));

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

function redirectResponse(status = 302): Response {
    return { type: 'default', status, statusText: 'Found', headers: new Headers({ location: 'http://169.254.169.254/' }) } as unknown as Response;
}
function okResponse(): Response {
    return {
        type: 'default',
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        text: async () => '{"ok":true}',
    } as unknown as Response;
}

describe('performServerFetch redirect handling', () => {
    beforeEach(() => jest.clearAllMocks());

    it('does not let fetch auto-follow redirects (redirect: manual)', async () => {
        fetchMock.mockResolvedValue(okResponse());
        await performServerFetch('http://backend:8081/x');
        expect(fetchMock).toHaveBeenCalledWith('http://backend:8081/x', expect.objectContaining({ redirect: 'manual' }));
    });

    it('returns a FORBIDDEN failure instead of following a redirect', async () => {
        fetchMock.mockResolvedValue(redirectResponse(302));
        const result = await performServerFetch('http://attacker.example/redir');
        expect(result.isSuccess).toBe(false);
        expect((result as { errorCode: ApiResultStatus }).errorCode).toBe(ApiResultStatus.FORBIDDEN);
    });

    it('treats an opaque redirect as a failure', async () => {
        fetchMock.mockResolvedValue({ type: 'opaqueredirect', status: 0, headers: new Headers() } as unknown as Response);
        const result = await performServerFetch('http://attacker.example/redir');
        expect(result.isSuccess).toBe(false);
    });

    it('raw variant throws instead of following a redirect', async () => {
        fetchMock.mockResolvedValue(redirectResponse(307));
        await expect(performServerFetchRaw('http://attacker.example/redir')).rejects.toThrow();
    });
});
