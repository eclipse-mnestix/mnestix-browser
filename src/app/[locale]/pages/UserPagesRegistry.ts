import type { UserPagesConfig } from 'components/user-pages/userPages.types';

/**
 * This represents the registry of top-level user-plugin pages. If you want to register
 * your own page, add it here instead of editing the dispatcher route or `MainMenu`.
 * A detailed description on how to create custom pages can be found in the wiki.
 *
 * Empty by default — OSS does not ship any stock pages today. Mirrors
 * `SubmodelCustomVisualizationMap.ts`: this is where OSS contributors would register
 * their own stock pages, keeping `pages.config.ts` a thin indirection.
 */
export const userPagesRegistry: UserPagesConfig = {
    menu: [],
    pages: {},
};
