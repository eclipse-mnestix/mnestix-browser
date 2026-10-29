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

    it('keeps every menu entry reachable (invariant: menu keys must have metadata and page components)', async () => {
        const config = getUserPagesMenuConfig();
        const { getUserPagesConfig } = await import('./pages.config');
        const pages = getUserPagesConfig();

        for (const key of config.menu) {
            expect(Object.hasOwn(config.entries, key)).toBe(true);
            expect(Object.hasOwn(pages, key)).toBe(true);
            expect(pages[key]).toBeTruthy();
        }
    });
});
