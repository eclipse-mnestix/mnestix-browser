import net from 'net';
import dns from 'dns';
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
    return new URL(url).hostname.replace(/^\[|\]$/g, '');
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

/** Every hostname configured on an infrastructure, across all of its connection URL lists (host-only, port/scheme ignored). */
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

function isInternalIp(ip: string): boolean {
    const family = net.isIP(ip);
    if (family === 4) return isInternalIpv4(ip);
    if (family === 6) return isInternalIpv6(ip);
    return false;
}

function isInternalIpv4(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
    const [a, b] = parts;
    if (a === 0) return true; // "this" network
    if (a === 127) return true; // loopback
    if (a === 10) return true; // RFC1918
    if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
    if (a === 192 && b === 168) return true; // RFC1918
    if (a === 169 && b === 254) return true; // link-local (incl. metadata 169.254.169.254)
    return false;
}

function isInternalIpv6(ip: string): boolean {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::') return true; // loopback / unspecified
    // IPv4-mapped/embedded addresses: classify by the embedded IPv4. Node's URL parser normalizes
    // e.g. [::ffff:169.254.169.254] to the hex form [::ffff:a9fe:a9fe], so both forms must be decoded.
    const embedded = embeddedIpv4(lower);
    if (embedded) return isInternalIpv4(embedded);
    const first = parseInt(lower.split(':')[0] || '0', 16);
    if (first >= 0xfe80 && first <= 0xfebf) return true; // link-local fe80::/10
    if (first >= 0xfc00 && first <= 0xfdff) return true; // unique local fc00::/7
    return false;
}

/** Extracts the embedded IPv4 (as dotted-quad) from an IPv4-mapped IPv6 address, in either dotted or hex form. */
function embeddedIpv4(lower: string): string | null {
    const dotted = lower.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
    if (dotted) return dotted[1];
    const hex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
        const hi = parseInt(hex[1], 16);
        const lo = parseInt(hex[2], 16);
        return `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
    }
    return null;
}

type GuardDeps = {
    lookup: (hostname: string) => Promise<Array<{ address: string }>>;
    getInfrastructures: () => Promise<InfrastructureConnection[]>;
};

const defaultDeps: GuardDeps = {
    lookup: (hostname) => dns.promises.lookup(hostname, { all: true }),
    getInfrastructures: getInfrastructuresIncludingDefault,
};
