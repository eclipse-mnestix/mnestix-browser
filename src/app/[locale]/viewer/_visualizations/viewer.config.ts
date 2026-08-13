import type { ComponentType } from 'react';
import { DefaultViewer } from './DefaultViewer';
import { ProductViewer } from './ProductViewer';

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
 *
 */
export type AasViewerConfig = {
    default: string;
    switchable: string[];
    views: Record<string, AasView>;
};

/** The env flags that gate optional views. Both `publicEnvs` (server) and
 *  `useEnv()` (client) satisfy this shape structurally. */
type ViewerFlags = { EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG?: boolean };

/**
 * Builds the viewer registry for the given feature flags. Optional views are
 * included only when their flag is on, so a deployment can toggle them via env
 * without a rebuild. Call with `publicEnvs` in server components and `useEnv()`
 * in client components.
 */
export function getAasViewerConfig(flags: ViewerFlags): AasViewerConfig {
    const views: Record<string, AasView> = {
        default: { label: 'pages.aasViewer.views.default', component: DefaultViewer },
    };
    const switchable = ['default'];

    if (flags.EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG) {
        views.product = { label: 'pages.aasViewer.views.product', component: ProductViewer };
        switchable.push('product');
    }

    return { default: 'default', switchable, views };
}
