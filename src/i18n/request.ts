import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    // Load Localization messages from the user-plugin folder.
    let pluginMessages = {};
    try {
        pluginMessages = (await import(`../user-plugins/locale/${locale}.json`)).default;
    } catch {
        console.error('Plugin localization messages not found');
    }

    const messages = { ...(await import(`../locale/${locale}.json`)).default, ...pluginMessages };
    return {
        locale,
        messages,
    };
});
