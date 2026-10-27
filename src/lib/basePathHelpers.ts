import { BASE_PATH } from 'lib/basePath';

/**
 * Prefixes a root-absolute app path ('/api/...', '/404', ...) with BASE_PATH.
 * Needed for URLs that bypass Next's router (fetch, window.open, <a href>, img src)
 * and for middleware redirect/rewrite targets, which Next does not auto-prefix.
 * No-op when BASE_PATH is ''.
 *
 * Lives apart from basePath.ts on purpose: that file only holds the const so it
 * can be overridden per deployment (e.g. bundler overlay) without touching logic.
 */
export function withBasePath(pathname: string): string {
    if (!BASE_PATH) return pathname;
    return pathname === '/' ? BASE_PATH : `${BASE_PATH}${pathname}`;
}
