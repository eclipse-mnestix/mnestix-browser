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

    // Overlay-localization slot: these files are intentionally EMPTY ({}) in OSS.
    // An overlay/bundler layer replaces them wholesale at merge time, and its keys
    // resolve through this same provider — no second translator needed. Last layer
    // wins, so the overlay can also override OSS keys deliberately.
    const overlayMessages = (await import(`./locale/${locale}.json`)).default;

    const messages = {
        ...(await import(`../locale/${locale}.json`)).default,
        ...pluginMessages,
        ...overlayMessages,
    };
    return {
        locale,
        messages,
    };
});
