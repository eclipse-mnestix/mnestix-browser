import net from 'net';
import dns from 'dns';
import ipaddr from 'ipaddr.js';
import { isValidUrl } from 'lib/util/UrlUtil';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';
import { getInfrastructuresIncludingDefault } from 'lib/services/database/infrastructureDatabaseActions';
import { createSecurityHeaders } from './SecurityConfiguration';

export class EgressNotAllowedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EgressNotAllowedError';
    }
}

export async function assertEgressAllowed(url: string, infrastructureName: string, deps = defaultDeps): Promise<void> {
    if (!isValidUrl(url)) {
        throw new EgressNotAllowedError(`Egress blocked: unsupported URL scheme for "${url}".`);
    }

    const host = hostnameOf(url);

    const infrastructures = await deps.getInfrastructures();
    const infrastructure = infrastructures.find((infra) => infra.name === infrastructureName);
    if (infrastructure && configuredHostnames(infrastructure).has(host)) {
        // Operator-configured host (public or private) is trusted by definition — no DNS needed.
        return;
    }

    if (net.isIP(host)) {
        if (isInternalIp(host)) {
            throw new EgressNotAllowedError(`Egress blocked: "${host}" is an internal address.`);
        }
        return;
    }

    let addresses: Array<{ address: string }>;
    try {
        addresses = await deps.lookup(host);
    } catch {
        // Fail closed: if we cannot resolve the host, we cannot prove it is safe.
        throw new EgressNotAllowedError(`Egress blocked: could not resolve "${host}".`);
    }

    if (addresses.some((entry) => isInternalIp(entry.address))) {
        throw new EgressNotAllowedError(`Egress blocked: "${host}" resolves to an internal address.`);
    }
}

/**
 * The infrastructure's security headers, but only when `url`'s host is one of that infrastructure's
 * configured hosts. Otherwise `null` — so credentials never attach to an unconfigured (e.g. attacker) host.
 */
export async function securityHeadersForUrl(
    url: string,
    infrastructure: InfrastructureConnection | undefined,
): Promise<Record<string, string> | null> {
    if (!infrastructure) return null;
    if (!configuredHostnames(infrastructure).has(hostnameOf(url))) return null;
    return createSecurityHeaders(infrastructure);
}

function hostnameOf(url: string): string {
    // Lowercased so host matching is case-insensitive (DNS hostnames are). This is the single seam
    // through which every host — configured or requested — is derived, so both sides always agree.
    return new URL(url).hostname.replace(/^\[|\]$/g, '').toLowerCase();
}

const CONFIGURED_URL_FIELDS: Array<keyof InfrastructureConnection> = [
    'discoveryUrls',
    'aasRegistryUrls',
    'aasRepositoryUrls',
    'submodelRepositoryUrls',
    'submodelRegistryUrls',
    'conceptDescriptionRepositoryUrls',
    'serializationEndpointUrls',
];

/**
 * Every hostname configured on an infrastructure, across all of its connection URL lists (host-only,
 * port/scheme ignored, case-insensitive). Matching is deliberately literal per host string: if the same
 * backend is reachable under multiple spellings (e.g. a service name AND an IP), each spelling that
 * should carry credentials must be listed on the infrastructure — otherwise the unlisted spelling is
 * treated as an unconfigured (potentially attacker) host and gets no credentials.
 */
function configuredHostnames(infrastructure: InfrastructureConnection): Set<string> {
    const hosts = new Set<string>();
    for (const field of CONFIGURED_URL_FIELDS) {
        const urls = infrastructure[field] as string[];
        for (const configuredUrl of urls) {
            if (!isValidUrl(configuredUrl)) continue;
            hosts.add(hostnameOf(configuredUrl));
        }
    }
    return hosts;
}

/**
 * True for any address that is not a normal public unicast address — loopback, private (RFC1918),
 * link-local (incl. the cloud-metadata 169.254.169.254), unique-local, carrier-grade NAT, multicast,
 * broadcast, reserved, and the IPv6 transition ranges (IPv4-mapped, NAT64, 6to4, Teredo). ipaddr.js's
 * range() does the classification: everything except "unicast" is refused. We only add the one thing
 * it does not flag — an IPv4 embedded in IPv6 — which must be judged by that embedded IPv4 instead.
 */
function isInternalIp(ip: string): boolean {
    let addr: ReturnType<typeof ipaddr.parse>;
    try {
        addr = ipaddr.parse(ip);
    } catch {
        return false;
    }
    if (addr instanceof ipaddr.IPv6) {
        // ipaddr.js does not treat IPv4-in-IPv6 as internal on its own: the IPv4-mapped form
        // (::ffff:a.b.c.d) it labels "ipv4Mapped", and the deprecated IPv4-compatible form
        // (::a.b.c.d, which Node normalizes to e.g. ::7f00:1) it reports as plain "unicast".
        // Both carry the IPv4 in the final two hextets — decode it and classify by that instead.
        const { parts } = addr;
        const embedsIpv4 = parts.slice(0, 5).every((h) => h === 0) && (parts[5] === 0 || parts[5] === 0xffff);
        if (embedsIpv4) {
            const embedded = new ipaddr.IPv4([
                (parts[6] >> 8) & 0xff,
                parts[6] & 0xff,
                (parts[7] >> 8) & 0xff,
                parts[7] & 0xff,
            ]);
            return embedded.range() !== 'unicast';
        }
    }
    return addr.range() !== 'unicast';
}

type GuardDeps = {
    lookup: (hostname: string) => Promise<Array<{ address: string }>>;
    getInfrastructures: () => Promise<InfrastructureConnection[]>;
};

const defaultDeps: GuardDeps = {
    lookup: (hostname) => dns.promises.lookup(hostname, { all: true }),
    getInfrastructures: getInfrastructuresIncludingDefault,
};
