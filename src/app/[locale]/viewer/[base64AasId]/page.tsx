import { redirect } from 'next/navigation';
import { getAasViewerConfig } from 'app/[locale]/viewer/_visualizations/viewer.config';
import { publicEnvs } from 'lib/env/MnestixEnv';

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

    // A repeated query param (?repoUrl=a&repoUrl=b) arrives as an array; take the
    // first value rather than silently dropping the param.
    const firstValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

    const query = new URLSearchParams();
    const repoUrl = firstValue(sp.repoUrl);
    const infrastructure = firstValue(sp.infrastructure);
    if (repoUrl) query.set('repoUrl', repoUrl);
    if (infrastructure) query.set('infrastructure', infrastructure);
    const suffix = query.toString() ? `?${query.toString()}` : '';

    redirect(`/viewer/${base64AasId}/${getAasViewerConfig(publicEnvs).default}${suffix}`);
}
