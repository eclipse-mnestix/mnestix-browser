import { PropsWithChildren } from 'react';
import 'moment/locale/de';
import { defaultLanguage, translationLists } from './localization';
import moment from 'moment';
import { IntlProvider } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useLocale } from 'next-intl';

moment.locale(defaultLanguage);

// Configures and injects the internationalization context.
export function Internationalization(props: PropsWithChildren<unknown>) {
    const locale = useLocale();
    return (
        <LocalizationProvider dateAdapter={AdapterMoment} dateLibInstance={moment} adapterLocale={defaultLanguage}>
            <IntlProvider defaultLocale={defaultLanguage} locale={locale} messages={translationLists[locale]}>
                {props.children}
            </IntlProvider>
        </LocalizationProvider>
    );
}
