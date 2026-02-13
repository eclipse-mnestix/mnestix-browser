/**
 * Example middleware extension for Enterprise Edition route gating
 * This shows how you could add EE route protection to your existing middleware.
 *
 * Add this logic to your src/middleware.ts file after the feature flag checks
 * and before the i18nMiddleware call.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if the current build includes Enterprise Edition features
 */
function isEnterpriseEdition(): boolean {
    return process.env.EDITION === 'ee';
}

/**
 * Check if user has valid EE license/entitlement
 * This is a simplified example - implement your actual license validation
 */
function hasEnterpriseAccess(req: NextRequest): boolean {
    // Example: Check for valid license key in headers or JWT token
    const licenseKey = req.headers.get('x-license-key') || process.env.MNX_EE_LICENSE_KEY;

    // In a real implementation, you would:
    // 1. Validate the license key against your licensing service
    // 2. Check user permissions from JWT token
    // 3. Verify subscription status
    // 4. Check organization entitlements

    return Boolean(licenseKey && licenseKey.startsWith('ee-'));
}

/**
 * Add this function to your existing middleware before i18nMiddleware call:
 */
export function enterpriseMiddleware(req: NextRequest): NextResponse | null {
    const { pathname } = req.nextUrl;

    // Check if this is an EE route (routes under /ee/)
    const isEERoute = pathname.includes('/ee/');

    if (isEERoute) {
        // If EE route but not EE edition build, return 404
        if (!isEnterpriseEdition()) {
            return NextResponse.rewrite(new URL('/404', req.url));
        }

        // If EE edition but user doesn't have access, redirect to unauthorized
        if (!hasEnterpriseAccess(req)) {
            // You could redirect to login, show upgrade prompt, or return 403
            return NextResponse.rewrite(new URL('/unauthorized', req.url));
        }
    }

    return null; // Continue with normal middleware flow
}

/**
 * Integration example for your existing middleware.ts:
 *
 * Add this after your existing feature flag checks:
 */

/*
export function middleware(req: NextRequest) {
    // ... existing correlation ID and server action handling ...

    const { pathname } = req.nextUrl;
    
    // ... existing feature flag checks ...
    
    // ADD THIS: Enterprise Edition route gating
    const eeResult = enterpriseMiddleware(req);
    if (eeResult) {
        return eeResult;
    }
    
    // ... rest of existing middleware logic ...
    
    return i18nMiddleware(req);
}
*/

/**
 * Environment Variables for EE:
 *
 * EDITION=ee                     # Enables EE features in build
 * MNX_EE_LICENSE_KEY=ee-xxx      # Enterprise license key
 * MNX_EE_API_ENDPOINT=xxx        # EE licensing service endpoint
 */
