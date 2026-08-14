import { describe, expect, it, beforeEach } from '@jest/globals';
import { screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';

// Mutable holders so each test can set the route params / registry the switcher
// reads. `mockState` is referenced only lazily inside the factories, so it is safe
// against jest's hoisting of these mock calls.
const mockState: { params: Record<string, string>; config: unknown } = {
    params: { base64AasId: 'abc' },
    config: undefined,
};

jest.mock('next/navigation', () => ({
    useParams: () => mockState.params,
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock('../_visualizations/viewer.config', () => ({
    getAasViewerConfig: () => mockState.config,
}));

jest.mock('../../../EnvProvider', () => ({ useEnv: () => ({}) }));

// Imported after the mocks so the switcher binds to the mocked modules.
import { AasViewSwitcher } from './AasViewSwitcher';

describe('AasViewSwitcher', () => {
    beforeEach(() => {
        mockState.params = { base64AasId: 'abc' };
    });

    it('hides the switcher when only one view is switchable', () => {
        mockState.config = {
            default: 'default',
            switchable: ['default'],
            views: { default: { label: 'Default', component: () => null } },
        };

        CustomRender(<AasViewSwitcher />);

        expect(screen.queryByTestId('aas-view-switcher')).not.toBeInTheDocument();
    });

    it('renders a tab per switchable view when there is more than one', () => {
        mockState.config = {
            default: 'default',
            switchable: ['default', 'product'],
            views: {
                default: { label: 'Default', component: () => null },
                product: { label: 'Product', component: () => null },
            },
        };

        CustomRender(<AasViewSwitcher />);

        expect(screen.getByTestId('aas-view-switcher')).toBeInTheDocument();
        expect(screen.getByTestId('aas-view-tab-default')).toBeInTheDocument();
        expect(screen.getByTestId('aas-view-tab-product')).toBeInTheDocument();
    });

    it('hides the switcher when the current view is not part of the switchable set', () => {
        // A direct-URL-only view: registered and rendered, but intentionally not switchable.
        mockState.params = { base64AasId: 'abc', view: 'hidden' };
        mockState.config = {
            default: 'default',
            switchable: ['default', 'product'],
            views: {
                default: { label: 'Default', component: () => null },
                product: { label: 'Product', component: () => null },
                hidden: { label: 'Hidden', component: () => null },
            },
        };

        CustomRender(<AasViewSwitcher />);

        expect(screen.queryByTestId('aas-view-switcher')).not.toBeInTheDocument();
    });
});
