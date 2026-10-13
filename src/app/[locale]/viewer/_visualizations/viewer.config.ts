import type { AasView, AasViewerConfig, ViewerFlags } from 'components/visualizations/viewer.types';
import { DefaultViewer } from './DefaultViewer';
import { ProductViewer } from './ProductViewer';

/**
 * Builds the viewer registry for the given feature flags. Optional views are
 * included only when their flag is on, so a deployment can toggle them via env
 * without a rebuild. Call with `publicEnvs` in server components and `useEnv()`
 * in client components.
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this
 * whole file to register its own views. The shared types come from the read-only
 * `components/visualizations/viewer.types` module — do not redeclare them here.
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
