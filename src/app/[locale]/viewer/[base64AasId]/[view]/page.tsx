'use client';

import { notFound, useParams } from 'next/navigation';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { useEnv } from 'app/EnvProvider';

/**
 * Dynamic dispatcher for `/viewer/<id>/<view>`. Looks the `view` segment up in
 * {@link getAasViewerConfig} and renders its registered component. Unknown views
 * resolve to a 404. AAS data comes from the context provided by the layout.
 */
export default function AasViewPage() {
    const params = useParams<{ view: string }>();
    const env = useEnv();
    const view = getAasViewerConfig(env).views[params.view];

    if (!view) {
        notFound();
    }

    const ViewComponent = view.component;
    return <ViewComponent />;
}
