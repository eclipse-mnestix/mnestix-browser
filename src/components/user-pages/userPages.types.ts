import type { ComponentType, ReactElement } from 'react';

/**
 * Public contract for user-plugin pages. Part of the `src/components/**` public API
 * surface: customizations IMPORT these types but never override this file. The
 * overridable registry factories live in `src/app/[locale]/pages/pages.config.ts`
 * (page components) and `src/app/[locale]/pages/pages.menu.config.ts` (menu metadata).
 *
 * Mirrors the `submodel.types` / `SubmodelVisualizationMap` pattern used for submodel
 * visualizations, one level up: instead of registering a visualization for a submodel
 * inside the AAS detail page, this registers whole top-level pages mounted under
 * `/pages/<key>`.
 *
 * Menu metadata and page components are deliberately split into two independent
 * registries instead of one: `MainMenu` is a Client Component, and importing a
 * registry that holds the actual page components would pull every registered page
 * (including ones never shown in the menu) into the client module graph — breaking
 * the build the moment a page uses a server-only module (e.g. `next/headers`). Keeping
 * `UserPagesMenuConfig` free of component references means `MainMenu` never needs to
 * import the component registry at all.
 */

/**
 * Menu metadata for a single user-plugin page. `label` is either an i18n key
 * (resolved via next-intl `t.has()` fallback, see `MainMenu`) or a raw display
 * string.
 */
export type UserPageMenuEntry = {
    label: string;
    icon?: ReactElement;
};

/**
 * Client-safe registry of user-plugin pages shown in `MainMenu`. Contains metadata
 * only (label/icon) — never page components — so it can be imported from Client
 * Components without pulling page implementations into the client bundle.
 * - `entries`: menu metadata keyed by the same page key used in {@link UserPagesConfig}.
 * - `menu`: keys (must exist in `entries`) rendered as top-level `MainMenu` entries,
 *   in order. Sub-pages are deliberately left out of `menu` and linked to from within
 *   their parent page's own component instead — exactly like `AasViewerConfig.views`
 *   vs `switchable`.
 */
export type UserPagesMenuConfig = {
    menu: string[];
    entries: Record<string, UserPageMenuEntry>;
};

/**
 * Server-only registry of user-plugin page components, keyed by their URL path
 * relative to `/pages/`. The key may contain `/` to express a sub-page (e.g.
 * `alerts/history`), since the dispatcher route is a catch-all — there's no separate
 * nesting mechanism, a sub-page is just a registry entry whose key has a `/` in it.
 * Only ever imported by the `/pages/<key>` dispatcher (a Server Component) — never by
 * `MainMenu` or anything else reachable from a Client Component.
 */
export type UserPagesConfig = Record<string, ComponentType>;
