import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from 'i18n/routing';
import { v4 as uuidv4 } from 'uuid';
import { envs } from 'lib/env/MnestixEnv';

// next-intl does also provide methods for navigation (useRouter etc.) but we
// use the middleware as MUI does not use these methods
const i18nMiddleware = createMiddleware(routing);

// paths where we do not need localized path
const unlocalizedPaths = ['/api', '/_next/static', '/_next/image', '/favicon.ico', '/LocationMarkers'];

const unlocalizedPathsRegex = RegExp(
    `^(${unlocalizedPaths.map((str) => `(${str.startsWith('/') ? str : '/' + str})`).join('|')})(/?$|/.*)`,
);

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    //paths which should be redirected to 404 page if feature flag is disabled
    if (!envs.AAS_LIST_FEATURE_FLAG && pathname.includes('list')) {
        return NextResponse.rewrite(new URL('/404', req.url));
    }
    if (!envs.COMPARISON_FEATURE_FLAG && pathname.includes('compare')) {
        return NextResponse.rewrite(new URL('/404', req.url));
    }

    // Generate a unique correlation ID for tracking requests
    const correlationId = uuidv4();
    req.headers.set('x-correlation-id', correlationId);

    if (req.nextUrl.pathname.match(unlocalizedPathsRegex)) {
        return NextResponse.next();
    }

    const { locales, defaultLocale } = routing;
    const locale = pathname.split('/')[1] as (typeof locales)[number];

    // if a non-existing language (for example 'es') is used, redirect to default language
    // and remove 'es' from the url.
    if (locale.length === 2 && !locales.includes(locale)) {
        const newPathname = pathname.replace(`/${locale}`, '');
        const newUrl = new URL(`/${defaultLocale}${newPathname}`, req.url);

        return NextResponse.redirect(newUrl);
    }

    return i18nMiddleware(req);
}
