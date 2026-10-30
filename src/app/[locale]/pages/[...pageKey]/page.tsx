import { notFound } from 'next/navigation';
import { getUserPagesConfig } from 'app/[locale]/pages/pages.config';

type UserPluginPageProps = {
    params: Promise<{ pageKey: string[] }>;
};

/**
 * Catch-all dispatcher for `/pages/<key>` (and `/pages/<key>/<sub-key>/...` for
 * sub-pages). Looks the joined `pageKey` segments up in {@link getUserPagesConfig}
 * and renders its registered component. Unknown keys resolve to a 404.
 *
 * Mirrors the AAS viewer's `[base64AasId]/[view]/page.tsx` dispatcher: a pure routing
 * shell with no content of its own, so customizations never need to add a Next.js
 * route per page — they only add a registry entry.
 */
export default async function UserPluginPage({ params }: UserPluginPageProps) {
    const { pageKey } = await params;
    const key = pageKey.join('/');
    const pages = getUserPagesConfig();
    // Object.hasOwn guards against keys like "toString"/"constructor"/"__proto__" that
    // resolve to inherited Object.prototype members instead of a registered page —
    // those would pass a plain truthiness check but have no `component`, causing a
    // render error instead of the intended 404.
    const PageComponent = Object.hasOwn(pages, key) ? pages[key] : undefined;

    if (!PageComponent) {
        notFound();
        return null;
    }

    return <PageComponent />;
}
