import type { ComponentType, ReactElement } from 'react';

/**
 * Public contract for user-plugin pages. Part of the `src/components/**` public API
 * surface: customizations IMPORT these types but never override this file. The
 * overridable registry factory lives in `src/app/[locale]/pages/pages.config.ts`.
 *
 * Mirrors the `submodel.types` / `SubmodelVisualizationMap` pattern used for submodel
 * visualizations, one level up: instead of registering a visualization for a submodel
 * inside the AAS detail page, this registers whole top-level pages mounted under
 * `/pages/<key>`.
 */

/**
 * A single user-plugin page. `label` is either an i18n key (resolved via next-intl
 * `t.has()` fallback, see `MainMenu`) or a raw display string. `component` is a
 * self-contained, zero-prop page component.
 */
export type UserPage = {
    label: string;
    component: ComponentType;
    /**
     * Menu icon. Only read for keys listed in {@link UserPagesConfig.menu} — pages
     * reachable only by direct URL (sub-pages, detail pages) don't need one.
     */
    icon?: ReactElement;
};

/**
 * Registry of user-plugin pages shown under `/pages/<key>`.
 * - `pages`: every registered page, keyed by its URL path relative to `/pages/`. The
 *   key may contain `/` to express a sub-page (e.g. `alerts/history`), since the
 *   dispatcher route is a catch-all — there's no separate nesting mechanism, a
 *   sub-page is just a registry entry whose key has a `/` in it.
 * - `menu`: keys (must exist in `pages`) rendered as top-level `MainMenu` entries, in
 *   order. Sub-pages are deliberately left out of `menu` and linked to from within
 *   their parent page's own component instead — exactly like `AasViewerConfig.views`
 *   vs `switchable`.
 */
export type UserPagesConfig = {
    menu: string[];
    pages: Record<string, UserPage>;
};
