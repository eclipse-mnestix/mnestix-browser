import { expect } from '@jest/globals';

describe('MnestixEnv - External Links Parsing', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv } as NodeJS.ProcessEnv;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should parse valid external links JSON', async () => {
        const validLinks = [
            {
                label: 'Test Link',
                url: 'https://example.com',
                icon: 'OpenInNew',
                target: '_blank',
            },
        ];
        (process.env as Record<string, string>).EXTERNAL_LINKS = JSON.stringify(validLinks);

        // Re-import to get updated env
        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toEqual(validLinks);
        });
    });

    it('should return empty array for invalid JSON', async () => {
        (process.env as Record<string, string>).EXTERNAL_LINKS = 'invalid json{]';

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toEqual([]);
        });
    });

    it('should return empty array when EXTERNAL_LINKS is undefined', async () => {
        delete process.env.EXTERNAL_LINKS;

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toEqual([]);
        });
    });

    it('should filter out invalid link objects', async () => {
        const mixedLinks = [
            {
                label: 'Valid Link',
                url: 'https://example.com',
            },
            {
                label: 'Missing URL',
                // url is missing
            },
            {
                url: 'https://example2.com',
                // label is missing
            },
            {
                label: 'Another Valid Link',
                url: 'https://example3.com',
                icon: 'MenuBook',
            },
        ];
        (process.env as Record<string, string>).EXTERNAL_LINKS = JSON.stringify(mixedLinks);

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toHaveLength(2);
            expect(freshEnvs.EXTERNAL_LINKS[0]).toEqual({
                label: 'Valid Link',
                url: 'https://example.com',
            });
            expect(freshEnvs.EXTERNAL_LINKS[1]).toEqual({
                label: 'Another Valid Link',
                url: 'https://example3.com',
                icon: 'MenuBook',
            });
        });
    });

    it('should handle links with optional properties', async () => {
        const linksWithOptionals = [
            {
                label: 'Minimal Link',
                url: 'https://example.com',
            },
            {
                label: 'Full Link',
                url: 'https://example2.com',
                icon: 'OpenInNew',
                target: '_blank',
            },
        ];
        (process.env as Record<string, string>).EXTERNAL_LINKS = JSON.stringify(linksWithOptionals);

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toEqual(linksWithOptionals);
        });
    });

    it('should handle links with i18n labels', async () => {
        const linksWithI18n = [
            {
                label: {
                    en: 'Documentation',
                    de: 'Dokumentation',
                },
                url: 'https://docs.example.com',
                icon: 'MenuBook',
            },
            {
                label: {
                    en: 'Support',
                    de: 'Unterstützung',
                    fr: 'Soutien',
                },
                url: 'https://support.example.com',
            },
        ];
        (process.env as Record<string, string>).EXTERNAL_LINKS = JSON.stringify(linksWithI18n);

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toEqual(linksWithI18n);
        });
    });

    it('should filter out links with invalid i18n labels', async () => {
        const mixedI18nLinks = [
            {
                label: {
                    en: 'Valid Link',
                    de: 'Gültiger Link',
                },
                url: 'https://example.com',
            },
            {
                label: {
                    en: 'Invalid Link',
                    de: 123, // Invalid: not a string
                },
                url: 'https://invalid.com',
            },
            {
                label: 'String Link',
                url: 'https://string.com',
            },
        ];
        (process.env as Record<string, string>).EXTERNAL_LINKS = JSON.stringify(mixedI18nLinks);

        await jest.isolateModulesAsync(async () => {
            const { publicEnvs: freshEnvs } = await import('./MnestixEnv');
            expect(freshEnvs.EXTERNAL_LINKS).toHaveLength(2);
            expect(freshEnvs.EXTERNAL_LINKS[0].label).toEqual({
                en: 'Valid Link',
                de: 'Gültiger Link',
            });
            expect(freshEnvs.EXTERNAL_LINKS[1].label).toEqual('String Link');
        });
    });
});
