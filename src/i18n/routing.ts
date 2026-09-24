import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'de', 'es', 'nl'],
    defaultLocale: 'en',
});

// Locale-aware navigation APIs. Prefer these over next/navigation and
// next/link so internal hrefs keep the current locale in the URL.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
