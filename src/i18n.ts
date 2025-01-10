import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'de'];

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale)) notFound();

    const pluginMessages = (await import(`./user-plugins/locale/${locale}.json`)).default;
    const messages = { ...(await import(`./locale/${locale}.json`)).default, ...pluginMessages };
    return {
        messages,
    };
});
