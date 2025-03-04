import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'de'];

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale)) notFound();

    // Load Localization messages from the user-plugin folder.
    let pluginMessages = {};
    try {
        pluginMessages = (await import(`./user-plugins/locale/${locale}.json`)).default;
    } catch {
        console.error('Plugin localization messages not found');
    }

    const messages = { ...(await import(`./locale/${locale}.json`)).default, ...pluginMessages };
    return {
        messages,
    };
});
