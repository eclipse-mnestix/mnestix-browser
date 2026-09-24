import { createNavigation } from 'next-intl/navigation';
import { routing } from 'i18n/routing';

// Locale-aware navigation APIs for client components. Prefer these over
// next/navigation and next/link so internal hrefs keep the current locale
// in the URL. Kept separate from i18n/routing because that module is also
// consumed by the Edge proxy and server request config, which must not
// depend on the client navigation APIs.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
