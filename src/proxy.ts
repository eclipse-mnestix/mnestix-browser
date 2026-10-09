import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from 'i18n/routing';
import { envs } from 'lib/env/MnestixEnv';
import { BASE_PATH } from 'lib/basePath';

// With basePath set, req.nextUrl.pathname includes the prefix — strip it for the
// checks below and re-add it to redirect/rewrite targets.
function stripBasePath(pathname: string): string {
    return BASE_PATH && pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) || '/' : pathname;
}

function withBasePath(pathname: string): string {
    if (!BASE_PATH) return pathname;
    return pathname === '/' ? BASE_PATH : `${BASE_PATH}${pathname}`;
}

// next-intl does also provide methods for navigation (useRouter etc.) but we
// use the middleware as MUI does not use these methods
const i18nMiddleware = createMiddleware(routing);

// paths where we do not need localized path
const unlocalizedPaths = ['/api', '/_next/static', '/_next/image', '/favicon.ico', '/LocationMarkers', '/images'];

const unlocalizedPathsRegex = RegExp(
    `^(${unlocalizedPaths.map((str) => `(${str.startsWith('/') ? str : '/' + str})`).join('|')})(/?$|/.*)`,
);

export function proxy(req: NextRequest) {
    // Generate a unique correlation ID for tracking requests
    const correlationId = crypto.randomUUID();
    req.headers.set('x-correlation-id', correlationId);

    // Server actions require the response to stay untouched so that Next.js can
    // stream the expected RSC(React Server Components) payload. Any rewrite or redirect (including those
    // coming from the i18n middleware) changes the response shape and results in
    // the "An unexpected response was received from the server" error on the
    // client. When a server action is detected (Next.js sends the `next-action`
    // header), we simply let the request pass through while preserving the
    // correlation id for logging purposes.
    if (req.headers.has('next-action')) {
        const res = NextResponse.next();
        res.headers.set('x-correlation-id', correlationId);
        return res;
    }

    const pathname = stripBasePath(req.nextUrl.pathname);
    //paths which should be redirected to 404 page if feature flag is disabled
    if (!envs.AAS_LIST_FEATURE_FLAG && pathname.includes('list')) {
        return NextResponse.rewrite(new URL(withBasePath('/404'), req.url));
    }

    if (pathname.match(unlocalizedPathsRegex)) {
        return NextResponse.next();
    }

    const { locales, defaultLocale } = routing;
    const locale = pathname.split('/')[1] as (typeof locales)[number];

    // if a non-existing language (for example 'es') is used, redirect to default language
    // and remove 'es' from the url.
    if (locale.length === 2 && !locales.includes(locale)) {
        const newPathname = pathname.replace(`/${locale}`, '');
        const newUrl = new URL(withBasePath(`/${defaultLocale}${newPathname}`), req.url);

        return NextResponse.redirect(newUrl);
    }

    return i18nMiddleware(req);
}
