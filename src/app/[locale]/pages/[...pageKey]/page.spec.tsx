import { describe, expect, it } from '@jest/globals';

jest.mock('../pages.config', () => ({
    getUserPagesConfig: jest.fn(),
}));

import UserPluginPage from './page';
import { getUserPagesConfig } from '../pages.config';

const mockGetUserPagesConfig = getUserPagesConfig as jest.Mock;

describe('UserPluginPage dispatcher', () => {
    it('renders the registered component for a single-segment key', async () => {
        const AlertsPage = () => null;
        mockGetUserPagesConfig.mockReturnValue({ alerts: AlertsPage });

        const result = await UserPluginPage({ params: Promise.resolve({ pageKey: ['alerts'] }) });

        expect(result?.type).toBe(AlertsPage);
    });

    it('joins multi-segment keys so sub-pages resolve to their registry entry', async () => {
        const AlertHistoryPage = () => null;
        mockGetUserPagesConfig.mockReturnValue({
            alerts: () => null,
            'alerts/history': AlertHistoryPage,
        });

        const result = await UserPluginPage({ params: Promise.resolve({ pageKey: ['alerts', 'history'] }) });

        expect(result?.type).toBe(AlertHistoryPage);
    });

    it('calls notFound (Next.js 404) for an unregistered key', async () => {
        mockGetUserPagesConfig.mockReturnValue({});

        // next/navigation's notFound() throws a special digest error that Next's
        // router boundary catches; outside that boundary (as here) it just surfaces
        // as a rejected promise.
        await expect(UserPluginPage({ params: Promise.resolve({ pageKey: ['unknown'] }) })).rejects.toThrow(
            'NEXT_HTTP_ERROR_FALLBACK;404',
        );
    });

    // Security/correctness regression: a plain `pages[key]` lookup on even an empty
    // registry object resolves these keys to inherited Object.prototype members
    // (e.g. `({}).toString`), which pass a truthiness check but aren't a component —
    // rendering that as JSX throws instead of producing the documented 404.
    describe('inherited Object.prototype keys', () => {
        it.each(['toString', 'constructor', '__proto__', 'hasOwnProperty', 'valueOf'])(
            'calls notFound instead of rendering an inherited member for key "%s"',
            async (key) => {
                mockGetUserPagesConfig.mockReturnValue({});

                await expect(UserPluginPage({ params: Promise.resolve({ pageKey: [key] }) })).rejects.toThrow(
                    'NEXT_HTTP_ERROR_FALLBACK;404',
                );
            },
        );
    });
});
