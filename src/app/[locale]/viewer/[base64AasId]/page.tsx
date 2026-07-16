import { redirect } from 'next/navigation';
import { aasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';

type ViewerPageProps = {
    params: Promise<{ base64AasId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Bare `/viewer/<id>` entry point. Redirects to the configured default view
 * under the `[view]` segment, preserving `repoUrl` / `infrastructure` params.
 */
export default async function ViewerPage({ params, searchParams }: ViewerPageProps) {
    const { base64AasId } = await params;
    const sp = await searchParams;

    const query = new URLSearchParams();
    if (typeof sp.repoUrl === 'string') query.set('repoUrl', sp.repoUrl);
    if (typeof sp.infrastructure === 'string') query.set('infrastructure', sp.infrastructure);
    const suffix = query.toString() ? `?${query.toString()}` : '';

    redirect(`/viewer/${base64AasId}/${aasViewerConfig.default}${suffix}`);
}
