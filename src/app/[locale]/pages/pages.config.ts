import type { UserPagesConfig } from 'components/user-pages/userPages.types';
import { userPagesRegistry } from './UserPagesRegistry';

/**
 * Returns the user-plugin page *component* registry used by the `/pages/<key>`
 * dispatcher.
 *
 * Server-only: only import this from the dispatcher (a Server Component). Importing
 * it from a Client Component (e.g. `MainMenu`) would pull every registered page's
 * implementation into the client module graph, including pages never shown in the
 * menu — breaking the build the moment a page uses a server-only module. `MainMenu`
 * instead reads menu metadata from the separate `getUserPagesMenuConfig()`.
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this whole
 * file and spreads the OSS registry so upstream entries keep flowing in, e.g.
 *
 *     return { ...userPagesRegistry, alerts: AlertsPage };
 *
 * The shared type comes from the read-only `components/user-pages/userPages.types`
 * module — do not redeclare it here.
 *
 * Mirrors `app/[locale]/viewer/_components/submodel/submodel.config.ts`: OSS
 * contributors register stock pages in `UserPagesRegistry.ts` instead; this file
 * stays a thin indirection on purpose.
 */
export function getUserPagesConfig(): UserPagesConfig {
    return userPagesRegistry;
}
