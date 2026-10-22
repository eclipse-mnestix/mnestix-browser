import { describe, expect, it } from '@jest/globals';
import { getUserPagesMenuConfig } from './pages.menu.config';
import { userPagesMenuRegistry } from './UserPagesMenuRegistry';

describe('getUserPagesMenuConfig', () => {
    // Subset, not equality: a customization overriding this file spreads the OSS
    // registry and adds its own entries, and this spec must keep passing in such a
    // build.
    it('exposes every OSS-registered menu entry', () => {
        const config = getUserPagesMenuConfig();

        expect(config.menu).toEqual(expect.arrayContaining(userPagesMenuRegistry.menu));
        expect(Object.keys(config.entries)).toEqual(expect.arrayContaining(Object.keys(userPagesMenuRegistry.entries)));
    });

    it('keeps every menu entry reachable (invariant: menu keys must be registered entries)', () => {
        const config = getUserPagesMenuConfig();

        for (const key of config.menu) {
            expect(Object.hasOwn(config.entries, key)).toBe(true);
        }
    });
});
