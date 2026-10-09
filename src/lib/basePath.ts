/**
 * Path prefix under which the app is served (e.g. '/viewer', '' for root).
 * Single source of truth for next.config.ts (basePath) and src/proxy.ts.
 * NOTE: baked into the client bundles at `yarn build` time — changing this
 * requires a rebuild, it cannot be changed at runtime.
 */
export const BASE_PATH: string = '';
