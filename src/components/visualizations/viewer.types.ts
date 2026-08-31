import type { ComponentType } from 'react';

/**
 * Public contract for AAS visualizations. Part of the `src/components/**` public
 * API surface: customizations IMPORT these types but never override this file.
 * The overridable registry factory lives in
 * `src/app/[locale]/viewer/_visualizations/viewer.config.ts`.
 */

/**
 * A single AAS visualization. `label` is either an i18n key (resolved via
 * next-intl `t.has()` fallback) or a raw display string. `component` is a
 * self-contained, zero-prop view that reads data from `useCurrentAasContext()`.
 */
export type AasView = {
    label: string;
    component: ComponentType;
};

/**
 * Registry of AAS visualizations shown on the viewer page.
 * - `default`: the view key the bare `/viewer/<id>` URL redirects to.
 * - `switchable`: keys shown in the user-facing view switcher (Tabs).
 * - `views`: all registered views; a key may be renderable by direct URL
 *   without appearing in `switchable`.
 */
export type AasViewerConfig = {
    default: string;
    switchable: string[];
    views: Record<string, AasView>;
};

/** The env flags that gate optional views. Both `publicEnvs` (server) and
 *  `useEnv()` (client) satisfy this shape structurally. */
export type ViewerFlags = { EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG?: boolean };
