import en from './locale/en.json';
import userPluginEn from './user-plugins/locale/en.json';

type Messages = typeof en & userPluginEn;

declare global {
    interface Window {
        Cypress: {
            scannerCallback: (string) => Promise<void>;
        };
    }

    // Use type safe message keys with `next-intl`, "no usages" is intended.
    interface IntlMessages extends Messages {}
}

export {};
