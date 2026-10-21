import { describe, expect, it } from '@jest/globals';
import { getUserPagesConfig } from './pages.config';
import { userPagesRegistry } from './UserPagesRegistry';

describe('getUserPagesConfig', () => {
    // Subset, not equality: a customization overriding this file spreads the OSS
    // registry and adds its own entries, and this spec must keep passing in such a
    // build.
    it('exposes every OSS-registered page', () => {
        const config = getUserPagesConfig();

        expect(Object.keys(config)).toEqual(expect.arrayContaining(Object.keys(userPagesRegistry)));
    });
});
