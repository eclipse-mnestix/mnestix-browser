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
        mockGetUserPagesConfig.mockReturnValue({
            menu: ['alerts'],
            pages: { alerts: { label: 'Alerts', component: AlertsPage } },
        });

        const result = await UserPluginPage({ params: Promise.resolve({ pageKey: ['alerts'] }) });

        expect(result?.type).toBe(AlertsPage);
    });

    it('joins multi-segment keys so sub-pages resolve to their registry entry', async () => {
        const AlertHistoryPage = () => null;
        mockGetUserPagesConfig.mockReturnValue({
            menu: ['alerts'],
            pages: {
                alerts: { label: 'Alerts', component: () => null },
                'alerts/history': { label: 'Alert History', component: AlertHistoryPage },
            },
        });

        const result = await UserPluginPage({ params: Promise.resolve({ pageKey: ['alerts', 'history'] }) });

        expect(result?.type).toBe(AlertHistoryPage);
    });

    it('calls notFound (Next.js 404) for an unregistered key', async () => {
        mockGetUserPagesConfig.mockReturnValue({ menu: [], pages: {} });

        // next/navigation's notFound() throws a special digest error that Next's
        // router boundary catches; outside that boundary (as here) it just surfaces
        // as a rejected promise.
        await expect(UserPluginPage({ params: Promise.resolve({ pageKey: ['unknown'] }) })).rejects.toThrow(
            'NEXT_HTTP_ERROR_FALLBACK;404',
        );
    });
});
