import type { UserPagesMenuConfig } from 'components/user-pages/userPages.types';

/**
 * This represents the registry of top-level user-plugin *menu entries* (label/icon
 * metadata only, no components). Client-safe: imported by `MainMenu` (a Client
 * Component). The matching page component must be registered separately in
 * `UserPagesRegistry.ts`.
 *
 * Empty by default — OSS does not ship any stock pages today. Mirrors
 * `UserPagesRegistry.ts`/`SubmodelCustomVisualizationMap.ts`.
 */
export const userPagesMenuRegistry: UserPagesMenuConfig = {
    menu: [],
    entries: {},
};
