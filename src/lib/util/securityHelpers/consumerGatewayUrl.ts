import { envs } from 'lib/env/MnestixEnv';

/**
 * Rewrites a raw provider URL so that requests are routed through the Factory-X
 * Consumer Gateway (forward proxy). The gateway expects the form
 * `${CONSUMER_GATEWAY_URL}/external/<provider_host>/<provider_path>` and performs
 * the RFC 8693 token exchange before forwarding the request to the provider.
 *
 * This is only applied to infrastructures using the `STS` security type and is
 * derived at load time, so the raw provider URLs remain stored unchanged.
 *
 * The transformation is idempotent: URLs that already point at the gateway are
 * returned unchanged. If the gateway URL is not configured or the input is not a
 * valid absolute URL, the original value is returned untouched.
 *
 * @param rawUrl The raw provider endpoint URL (e.g. `https://registry.provider.com/context`)
 * @returns The gateway-prefixed URL, or the original value when no rewrite applies
 */
export function applyConsumerGatewayPrefix(rawUrl: string): string {
    const gateway = envs.CONSUMER_GATEWAY_URL;
    if (!gateway || !rawUrl) {
        return rawUrl;
    }

    // Idempotency: already routed through the gateway.
    if (rawUrl.startsWith(`${gateway}/external/`)) {
        return rawUrl;
    }

    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return rawUrl;
    }

    const host = parsed.host; // includes port if present
    const pathAndQuery = `${parsed.pathname}${parsed.search}`;
    // Drop a bare "/" path; otherwise keep the path but trim a trailing slash so
    // service-appended segments (e.g. "/shells") join cleanly.
    const normalizedPath = pathAndQuery === '/' ? '' : pathAndQuery.replace(/\/$/, '');

    return `${gateway}/external/${host}${normalizedPath}`;
}
