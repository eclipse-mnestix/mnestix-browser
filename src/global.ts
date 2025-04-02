import { IntlMessages } from 'i18n/messages';

declare module 'next-intl' {
    interface AppConfig {
        Messages: IntlMessages;
    }
}
