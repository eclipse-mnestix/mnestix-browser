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

export const aasViewerConfig: AasViewerConfig = {
    default: 'default',
    switchable: ['default', 'product'],
    views: {
        default: { label: 'pages.aasViewer.views.default', component: DefaultViewer },
        product: { label: 'pages.aasViewer.views.product', component: ProductViewer },
    },
};
