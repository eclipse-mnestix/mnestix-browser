import type { UserPagesConfig } from 'components/user-pages/userPages.types';

/**
 * This represents the registry of top-level user-plugin page *components*, keyed by
 * URL path relative to `/pages/`. If you want to register your own page, add it here
 * instead of editing the dispatcher route. A detailed description on how to create
 * custom pages can be found in the wiki.
 *
 * Server-only: only the `/pages/<key>` dispatcher (a Server Component) imports this.
 * Menu metadata (label/icon) lives in the separate, client-safe
 * `UserPagesMenuRegistry.ts` so that `MainMenu` (a Client Component) never pulls page
 * implementations into the client module graph.
 *
 * Empty by default — OSS does not ship any stock pages today. Mirrors
 * `SubmodelCustomVisualizationMap.ts`: this is where OSS contributors would register
 * their own stock pages, keeping `pages.config.ts` a thin indirection.
 */
export const userPagesRegistry: UserPagesConfig = {};
