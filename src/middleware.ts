import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from 'i18n/routing';

const i18nMiddleware = createMiddleware(routing);

// paths where we do not need localized path
const unlocalizedPaths = ['/api', '/_next/static', '/_next/image', '/favicon.ico', '/LocationMarkers'];

const unlocalizedPathsRegex = RegExp(
    `^(${unlocalizedPaths.map((str) => `(${str.startsWith('/') ? str : '/' + str})`).join('|')})(/?$|/.*)`,
);

// next-intl does also provide methods for navigation (useRouter etc.) but we
// use the middleware as MUI does not use these methods
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    //paths which should be redirected to 404 page if feature flag is disabled
    if (process.env.AAS_LIST_FEATURE_FLAG === 'false' && pathname.includes('list')) {
        return NextResponse.rewrite(new URL('/404', req.url));
    }
    if (process.env.COMPARISON_FEATURE_FLAG === 'false' && pathname.includes('compare')) {
        return NextResponse.rewrite(new URL('/404', req.url));
    }

    if (req.nextUrl.pathname.match(unlocalizedPathsRegex)) {
        return NextResponse.next();
    }
    return i18nMiddleware(req);
}