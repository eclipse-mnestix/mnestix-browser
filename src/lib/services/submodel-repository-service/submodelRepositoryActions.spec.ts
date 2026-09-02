import { getAttachmentFromSubmodelElement } from './submodelRepositoryActions';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { getInfrastructureByName } from '../database/infrastructureDatabaseActions';
import { mnestixFetch } from 'lib/api/infrastructure';
import { SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';

jest.mock('lib/util/securityHelpers/repositoryFetchGuard', () => ({
    assertEgressAllowed: jest.fn(),
    securityHeadersForUrl: jest.fn(),
}));
jest.mock('../database/infrastructureDatabaseActions', () => ({
    getInfrastructureByName: jest.fn(),
    getInfrastructuresIncludingDefault: jest.fn(),
}));
jest.mock('lib/api/infrastructure', () => ({ mnestixFetch: jest.fn() }));
jest.mock('lib/api/basyx-v3/api', () => ({ SubmodelRepositoryApi: { create: jest.fn() } }));
jest.mock('next/headers', () => ({ headers: jest.fn().mockResolvedValue({}) }));
jest.mock('lib/util/Logger', () => ({ createRequestLogger: jest.fn(), logInfo: jest.fn() }));

const mockedAssertEgressAllowed = assertEgressAllowed as jest.MockedFunction<typeof assertEgressAllowed>;
const mockedSecurityHeadersForUrl = securityHeadersForUrl as jest.MockedFunction<typeof securityHeadersForUrl>;
const mockedGetInfrastructureByName = getInfrastructureByName as jest.MockedFunction<typeof getInfrastructureByName>;
const mockedMnestixFetch = mnestixFetch as jest.MockedFunction<typeof mnestixFetch>;
const mockedCreate = SubmodelRepositoryApi.create as jest.MockedFunction<typeof SubmodelRepositoryApi.create>;

const DEFAULT_REPO: RepositoryWithInfrastructure = {
    url: 'http://backend:8081/submodels/s/submodel-elements/e/attachment',
    infrastructureName: 'Default Infrastructure',
};

describe('getAttachmentFromSubmodelElement', () => {
    const getAttachment = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAssertEgressAllowed.mockResolvedValue(undefined);
        mockedSecurityHeadersForUrl.mockResolvedValue(null);
        mockedGetInfrastructureByName.mockResolvedValue(undefined);
        getAttachment.mockResolvedValue({ isSuccess: true, result: new Blob(['x']) });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockedCreate.mockReturnValue({ getAttachmentFromSubmodelElement: getAttachment } as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockedMnestixFetch.mockReturnValue({ fetch: jest.fn() } as any);
    });

    it('returns a failure and makes no outbound fetch when egress is blocked', async () => {
        mockedAssertEgressAllowed.mockRejectedValue(new Error('Egress blocked'));
        const repository: RepositoryWithInfrastructure = { ...DEFAULT_REPO, url: 'http://169.254.169.254/x' };

        const result = await getAttachmentFromSubmodelElement('s', 'e', repository);

        expect(result.isSuccess).toBe(false);
        expect(mockedCreate).not.toHaveBeenCalled();
        expect(mockedMnestixFetch).not.toHaveBeenCalled();
        expect(getAttachment).not.toHaveBeenCalled();
    });

    it('attaches no credentials (null header) for a non-configured host', async () => {
        mockedSecurityHeadersForUrl.mockResolvedValue(null);
        const repository: RepositoryWithInfrastructure = { ...DEFAULT_REPO, url: 'http://attacker.example/x' };

        await getAttachmentFromSubmodelElement('s', 'e', repository);

        expect(mockedMnestixFetch).toHaveBeenCalledWith(null);
    });

    it('attaches the security header for a configured host', async () => {
        mockedSecurityHeadersForUrl.mockResolvedValue({ 'X-API-KEY': 'secret' });

        const result = await getAttachmentFromSubmodelElement('s', 'e', DEFAULT_REPO);

        expect(mockedMnestixFetch).toHaveBeenCalledWith({ 'X-API-KEY': 'secret' });
        expect(result.isSuccess).toBe(true);
    });
});
