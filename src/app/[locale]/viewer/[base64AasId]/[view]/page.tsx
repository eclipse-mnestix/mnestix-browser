'use client';

import { notFound, useParams } from 'next/navigation';
import { aasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';

/**
 * Dynamic dispatcher for `/viewer/<id>/<view>`. Looks the `view` segment up in
 * {@link aasViewerConfig} and renders its registered component. Unknown views
 * resolve to a 404. AAS data comes from the context provided by the layout.
 */
export default function AasViewPage() {
    const params = useParams<{ view: string }>();
    const view = aasViewerConfig.views[params.view];

    if (!view) {
        notFound();
    }

    const ViewComponent = view.component;
    return <ViewComponent />;
}
