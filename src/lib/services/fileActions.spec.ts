import { fetchFileServerSide } from './fileActions';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { getInfrastructureByName } from './database/infrastructureDatabaseActions';
import { mnestixFetch } from 'lib/api/infrastructure';
import { RepositoryWithInfrastructure } from './database/InfrastructureMappedTypes';

jest.mock('lib/util/securityHelpers/repositoryFetchGuard', () => ({
    assertEgressAllowed: jest.fn(),
    securityHeadersForUrl: jest.fn(),
}));
jest.mock('./database/infrastructureDatabaseActions', () => ({
    getInfrastructureByName: jest.fn(),
    getInfrastructuresIncludingDefault: jest.fn(),
}));
jest.mock('lib/api/infrastructure', () => ({
    mnestixFetch: jest.fn(),
}));

const mockedAssertEgressAllowed = assertEgressAllowed as jest.MockedFunction<typeof assertEgressAllowed>;
const mockedSecurityHeadersForUrl = securityHeadersForUrl as jest.MockedFunction<typeof securityHeadersForUrl>;
const mockedGetInfrastructureByName = getInfrastructureByName as jest.MockedFunction<typeof getInfrastructureByName>;
const mockedMnestixFetch = mnestixFetch as jest.MockedFunction<typeof mnestixFetch>;

const DEFAULT_REPO: RepositoryWithInfrastructure = {
    url: 'http://backend:8081/files/x',
    infrastructureName: 'Default Infrastructure',
};

describe('fetchFileServerSide', () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAssertEgressAllowed.mockResolvedValue(undefined);
        mockedSecurityHeadersForUrl.mockResolvedValue(null);
        mockedGetInfrastructureByName.mockResolvedValue(undefined);
        fetchMock.mockResolvedValue({ isSuccess: true, result: new Blob(['x']) });
        mockedMnestixFetch.mockReturnValue({ fetch: fetchMock });
    });

    it('returns a failure and makes no outbound fetch when egress is blocked', async () => {
        mockedAssertEgressAllowed.mockRejectedValue(new Error('Egress blocked'));
        const repository: RepositoryWithInfrastructure = { ...DEFAULT_REPO, url: 'http://169.254.169.254/x' };

        const result = await fetchFileServerSide(repository);

        expect(result.isSuccess).toBe(false);
        expect(mockedMnestixFetch).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('attaches no credentials (null header) for a non-configured host', async () => {
        mockedSecurityHeadersForUrl.mockResolvedValue(null);
        const repository: RepositoryWithInfrastructure = { ...DEFAULT_REPO, url: 'http://attacker.example/loot' };

        await fetchFileServerSide(repository);

        expect(mockedMnestixFetch).toHaveBeenCalledWith(null);
        expect(fetchMock).toHaveBeenCalledWith('http://attacker.example/loot');
    });

    it('attaches the security header for a configured host and returns the result', async () => {
        mockedSecurityHeadersForUrl.mockResolvedValue({ 'X-API-KEY': 'secret' });

        const result = await fetchFileServerSide(DEFAULT_REPO);

        expect(mockedMnestixFetch).toHaveBeenCalledWith({ 'X-API-KEY': 'secret' });
        expect(result.isSuccess).toBe(true);
    });
});
