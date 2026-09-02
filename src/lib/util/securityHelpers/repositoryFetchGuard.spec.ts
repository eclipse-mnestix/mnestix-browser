import { assertEgressAllowed, securityHeadersForUrl } from './repositoryFetchGuard';
import { createSecurityHeaders } from './SecurityConfiguration';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';

jest.mock('./SecurityConfiguration', () => ({
    createSecurityHeaders: jest.fn(),
}));

function makeInfra(overrides: Partial<InfrastructureConnection> = {}): InfrastructureConnection {
    return {
        name: 'Default Infrastructure',
        isDefault: true,
        discoveryUrls: [],
        aasRegistryUrls: [],
        aasRepositoryUrls: [],
        submodelRepositoryUrls: [],
        submodelRegistryUrls: [],
        conceptDescriptionRepositoryUrls: [],
        serializationEndpointUrls: [],
        ...overrides,
    };
}

describe('assertEgressAllowed', () => {
    const lookup = jest.fn();
    const getInfrastructures = jest.fn();
    const deps = { lookup, getInfrastructures };

    beforeEach(() => {
        jest.clearAllMocks();
        getInfrastructures.mockResolvedValue([]);
    });

    it('rejects a non-http(s) scheme', async () => {
        await expect(assertEgressAllowed('file:///etc/passwd', 'Default Infrastructure', deps)).rejects.toThrow();
    });

    it('rejects the cloud-metadata address given as an IP literal, without a DNS lookup', async () => {
        await expect(
            assertEgressAllowed('http://169.254.169.254/latest/meta-data/', 'Default Infrastructure', deps),
        ).rejects.toThrow();
        expect(lookup).not.toHaveBeenCalled();
    });

    it('rejects a hostname that resolves to an internal IP', async () => {
        lookup.mockResolvedValue([{ address: '10.0.0.5' }]);
        await expect(assertEgressAllowed('http://intranet.example/x', 'Default Infrastructure', deps)).rejects.toThrow();
        expect(lookup).toHaveBeenCalledWith('intranet.example');
    });

    it('allows a configured internal hostname without a DNS lookup', async () => {
        getInfrastructures.mockResolvedValue([makeInfra({ aasRepositoryUrls: ['http://backend:8081'] })]);
        lookup.mockRejectedValue(new Error('DNS should not be consulted for a configured host'));
        await expect(
            assertEgressAllowed('http://backend:8081/shells', 'Default Infrastructure', deps),
        ).resolves.toBeUndefined();
        expect(lookup).not.toHaveBeenCalled();
    });

    it('allows a configured internal IP literal without a DNS lookup', async () => {
        getInfrastructures.mockResolvedValue([makeInfra({ aasRepositoryUrls: ['http://10.0.0.5:8081'] })]);
        await expect(
            assertEgressAllowed('http://10.0.0.5:8081/shells', 'Default Infrastructure', deps),
        ).resolves.toBeUndefined();
        expect(lookup).not.toHaveBeenCalled();
    });

    it('allows a public host that resolves to a public IP', async () => {
        lookup.mockResolvedValue([{ address: '93.184.216.34' }]);
        await expect(
            assertEgressAllowed('http://cdn.public.example/f.pdf', 'Default Infrastructure', deps),
        ).resolves.toBeUndefined();
    });

    it('rejects a host that resolves to a mix of public and internal IPs', async () => {
        lookup.mockResolvedValue([{ address: '93.184.216.34' }, { address: '10.0.0.5' }]);
        await expect(assertEgressAllowed('http://rebind.example/x', 'Default Infrastructure', deps)).rejects.toThrow();
    });

    it('rejects (fails closed) when DNS resolution errors', async () => {
        lookup.mockRejectedValue(new Error('ENOTFOUND'));
        await expect(assertEgressAllowed('http://nope.example/x', 'Default Infrastructure', deps)).rejects.toThrow();
    });

    it.each([
        ['http://127.0.0.1:8081/shells', 'loopback'],
        ['http://10.0.0.5/internal', 'RFC1918'],
    ])('rejects the internal IP literal %s (%s)', async (url) => {
        await expect(assertEgressAllowed(url, 'Default Infrastructure', deps)).rejects.toThrow();
        expect(lookup).not.toHaveBeenCalled();
    });
});

describe('securityHeadersForUrl', () => {
    const mockedCreateSecurityHeaders = createSecurityHeaders as jest.MockedFunction<typeof createSecurityHeaders>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockedCreateSecurityHeaders.mockResolvedValue({ 'X-API-KEY': 'secret' });
    });

    it('returns the infrastructure security headers for a configured host', async () => {
        const infrastructure = makeInfra({ aasRepositoryUrls: ['http://backend:8081'] });
        const result = await securityHeadersForUrl('http://backend:8081/shells/x', infrastructure);
        expect(result).toEqual({ 'X-API-KEY': 'secret' });
    });

    it.each([['http://attacker.example/loot'], ['http://cdn.public.example/f.pdf']])(
        'returns null (no credentials) for the non-configured host %s',
        async (url) => {
            const infrastructure = makeInfra({ aasRepositoryUrls: ['http://backend:8081'] });
            const result = await securityHeadersForUrl(url, infrastructure);
            expect(result).toBeNull();
            expect(mockedCreateSecurityHeaders).not.toHaveBeenCalled();
        },
    );

    it('matches on host only — a different port on a configured host still gets credentials', async () => {
        const infrastructure = makeInfra({ aasRepositoryUrls: ['http://backend:8081'] });
        const result = await securityHeadersForUrl('http://backend:9999/x', infrastructure);
        expect(result).toEqual({ 'X-API-KEY': 'secret' });
    });

    it('returns null when the infrastructure is undefined', async () => {
        const result = await securityHeadersForUrl('http://backend:8081/x', undefined);
        expect(result).toBeNull();
    });
});
