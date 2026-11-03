import type { UserPagesMenuConfig } from 'components/user-pages/userPages.types';
import { userPagesMenuRegistry } from './UserPagesMenuRegistry';

/**
 * Returns the user-plugin *menu metadata* registry used by `MainMenu`.
 *
 * Client-safe: contains label/icon metadata only, never page components, so
 * `MainMenu` (a Client Component) can import it without pulling page
 * implementations into the client module graph. The matching page component is
 * registered separately via `getUserPagesConfig()` (server-only).
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this whole
 * file and spreads the OSS registry so upstream entries keep flowing in, e.g.
 *
 *     return {
 *         menu: [...userPagesMenuRegistry.menu, 'alerts'],
 *         entries: { ...userPagesMenuRegistry.entries, alerts: { label: '...' } },
 *     };
 *
 * The shared type comes from the read-only `components/user-pages/userPages.types`
 * module — do not redeclare it here.
 */
export function getUserPagesMenuConfig(): UserPagesMenuConfig {
    return userPagesMenuRegistry;
}
