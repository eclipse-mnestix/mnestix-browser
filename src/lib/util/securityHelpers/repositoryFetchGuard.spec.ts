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
        ['http://172.16.0.1/x', 'RFC1918 172.16/12'],
        ['http://192.168.1.1/x', 'RFC1918 192.168/16'],
        ['http://100.64.1.1/x', 'carrier-grade NAT 100.64/10'],
        ['http://255.255.255.255/x', 'broadcast'],
        ['http://0.0.0.1/x', 'unspecified 0.0.0.0/8'],
        ['http://224.0.0.1/x', 'multicast 224/4'],
        ['http://240.0.0.1/x', 'reserved 240/4'],
    ])('rejects the internal IP literal %s (%s)', async (url) => {
        await expect(assertEgressAllowed(url, 'Default Infrastructure', deps)).rejects.toThrow();
        expect(lookup).not.toHaveBeenCalled();
    });

    it.each([
        ['http://[::1]/x', 'IPv6 loopback'],
        ['http://[fe80::1]/x', 'IPv6 link-local'],
        ['http://[fc00::1]/x', 'IPv6 ULA'],
        ['http://[::ffff:169.254.169.254]/latest/meta-data/', 'IPv4-mapped metadata (dotted)'],
        ['http://[::ffff:a9fe:a9fe]/latest/meta-data/', 'IPv4-mapped metadata (hex)'],
        ['http://[::ffff:127.0.0.1]/x', 'IPv4-mapped loopback (dotted)'],
        ['http://[::ffff:7f00:1]/x', 'IPv4-mapped loopback (hex)'],
        ['http://[::127.0.0.1]:9000/x', 'IPv4-compatible loopback (dotted)'],
        ['http://[::7f00:1]:9000/x', 'IPv4-compatible loopback (hex)'],
        ['http://[::169.254.169.254]/latest/meta-data/', 'IPv4-compatible metadata (dotted)'],
        ['http://[::a9fe:a9fe]/latest/meta-data/', 'IPv4-compatible metadata (hex)'],
        ['http://[::10.0.0.5]/x', 'IPv4-compatible RFC1918'],
        ['http://[64:ff9b::7f00:1]/x', 'NAT64 (rfc6052) — non-unicast'],
        ['http://[ff02::1]/x', 'IPv6 multicast'],
        ['http://[2002:7f00:1::]/x', '6to4 transition range'],
        ['http://[2001:0:1::]/x', 'Teredo transition range'],
        ['http://[2001:db8::1]/x', 'IPv6 reserved (documentation) range'],
    ])('rejects the internal IPv6 literal %s (%s)', async (url) => {
        await expect(assertEgressAllowed(url, 'Default Infrastructure', deps)).rejects.toThrow();
        expect(lookup).not.toHaveBeenCalled();
    });

    it.each([
        ['http://[2606:2800:220:1:248:1893:25c8:1946]/x', 'IPv6'],
        ['http://93.184.216.34/f.pdf', 'IPv4'],
    ])('allows a genuinely public %s literal without a DNS lookup', async (url) => {
        await expect(assertEgressAllowed(url, 'Default Infrastructure', deps)).resolves.toBeUndefined();
        expect(lookup).not.toHaveBeenCalled();
    });

    it('matches a configured host case-insensitively', async () => {
        getInfrastructures.mockResolvedValue([makeInfra({ aasRepositoryUrls: ['http://backend:8081'] })]);
        lookup.mockRejectedValue(new Error('DNS should not be consulted for a configured host'));
        await expect(
            assertEgressAllowed('http://BACKEND:8081/shells', 'Default Infrastructure', deps),
        ).resolves.toBeUndefined();
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

    it('gives credentials to every configured spelling of the same backend (service name AND IP)', async () => {
        const infrastructure = makeInfra({ aasRepositoryUrls: ['http://backend:8081', 'http://10.0.0.5:8081'] });
        await expect(securityHeadersForUrl('http://backend:8081/x', infrastructure)).resolves.toEqual({
            'X-API-KEY': 'secret',
        });
        await expect(securityHeadersForUrl('http://10.0.0.5:8081/x', infrastructure)).resolves.toEqual({
            'X-API-KEY': 'secret',
        });
    });

    it('matches a configured host case-insensitively', async () => {
        const infrastructure = makeInfra({ aasRepositoryUrls: ['http://Backend:8081'] });
        const result = await securityHeadersForUrl('http://BACKEND:8081/x', infrastructure);
        expect(result).toEqual({ 'X-API-KEY': 'secret' });
    });

    it('returns null when the infrastructure is undefined', async () => {
        const result = await securityHeadersForUrl('http://backend:8081/x', undefined);
        expect(result).toBeNull();
    });
});
