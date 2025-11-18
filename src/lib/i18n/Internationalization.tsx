import { PropsWithChildren, useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useLocale } from 'next-intl';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale/de';
import { es } from 'date-fns/locale/es';
import { Locale } from 'date-fns';

const bundledLocales: Record<string, Locale | undefined> = {
    en: undefined,
    de,
    es,
};

/**
 * Configures and injects the internationalization context.
 */
export function Internationalization(props: PropsWithChildren<unknown>) {
    const locale = useLocale();

    const dateAdapterLocale = useMemo(() => {
        const adapterLocale = bundledLocales[locale];
        if (!adapterLocale && locale !== 'en') {
            console.warn(`No bundled locale for ${locale}`);
        }
        return adapterLocale;
    }, [locale]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateAdapterLocale}>
            {props.children}
        </LocalizationProvider>
    );
}
