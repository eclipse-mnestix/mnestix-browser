import en from './locale/en.json';
import userPluginEn from './user-plugins/locale/en.json';

type Messages = typeof en & typeof userPluginEn;

declare global {
    interface Window {
        Cypress: {
            scannerCallback: (string: string) => Promise<void>;
        };
    }

    // Use type safe message keys with `next-intl`; intl uses this, do not delete
    type IntlMessages = Messages;
}

export {};
