import { notFound } from 'next/navigation';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { publicEnvs } from 'lib/env/MnestixEnv';

type AasViewPageProps = {
    params: Promise<{ view: string }>;
};

/**
 * Dynamic dispatcher for `/viewer/<id>/<view>`. Looks the `view` segment up in
 * {@link getAasViewerConfig} and renders its registered component. Unknown views
 * resolve to a 404. AAS data comes from the context provided by the layout.
 *
 * A pure Server Component dispatcher: no interactivity of its own, so it reads
 * config from `publicEnvs` (not the client `useEnv()`) and can use the
 * server-only `notFound()` cleanly.
 */
export default async function AasViewPage({ params }: AasViewPageProps) {
    const { view: viewKey } = await params;
    const view = getAasViewerConfig(publicEnvs).views[viewKey];

    if (!view) {
        notFound();
    }

    const ViewComponent = view.component;
    return <ViewComponent />;
}
