import { describe, expect, it } from '@jest/globals';
import { getUserPagesConfig } from './pages.config';
import { userPagesRegistry } from './UserPagesRegistry';

describe('getUserPagesConfig', () => {
    // Subset, not equality: a customization overriding this file spreads the OSS
    // registry and adds its own entries, and this spec must keep passing in such a
    // build.
    it('exposes every OSS-registered page', () => {
        const config = getUserPagesConfig();

        expect(config.menu).toEqual(expect.arrayContaining(userPagesRegistry.menu));
        expect(Object.keys(config.pages)).toEqual(expect.arrayContaining(Object.keys(userPagesRegistry.pages)));
    });

    it('keeps every menu entry reachable (invariant: menu keys must be registered pages)', () => {
        const config = getUserPagesConfig();

        for (const key of config.menu) {
            expect(config.pages[key]).toBeDefined();
        }
    });
});
