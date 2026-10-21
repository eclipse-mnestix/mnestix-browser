import type { UserPagesConfig } from 'components/user-pages/userPages.types';
import { userPagesRegistry } from './UserPagesRegistry';

/**
 * Returns the user-plugin page registry used by the `/pages/<key>` dispatcher and by
 * `MainMenu`.
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this whole
 * file and spreads the OSS registry so upstream entries keep flowing in, e.g.
 *
 *     return {
 *         menu: [...userPagesRegistry.menu, 'alerts'],
 *         pages: { ...userPagesRegistry.pages, alerts: { label: '...', component: AlertsPage } },
 *     };
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
