import { describe, expect, it, jest } from '@jest/globals';

// The view components pull in the whole submodel/next-intl tree; the registry
// logic under test only needs their identity, so stub them out.
jest.mock('./DefaultViewer', () => ({ DefaultViewer: () => null }));
jest.mock('./ProductViewer', () => ({ ProductViewer: () => null }));

import { getAasViewerConfig } from './viewer.config';

describe('getAasViewerConfig', () => {
    it('exposes only the default view when the product-view flag is off', () => {
        const config = getAasViewerConfig({ EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG: false });

        expect(config.default).toBe('default');
        expect(config.switchable).toEqual(['default']);
        expect(Object.keys(config.views)).toEqual(['default']);
    });

    it('adds the product view as a switchable tab when the flag is on', () => {
        const config = getAasViewerConfig({ EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG: true });

        expect(config.switchable).toEqual(['default', 'product']);
        expect(config.views.product).toBeDefined();
    });

    it('keeps default reachable (invariant: default must be a registered view)', () => {
        for (const flag of [true, false]) {
            const config = getAasViewerConfig({ EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG: flag });
            expect(config.views[config.default]).toBeDefined();
        }
    });
});
