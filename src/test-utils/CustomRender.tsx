import React, { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render } from '@testing-library/react';
import enMessages from 'locale/en.json';
import deMessages from 'locale/de.json';
import { NotificationContextProvider } from 'components/contexts/NotificationContext';

interface WrapperProps {
    children: ReactNode;
}

const messages: { [key: string]: typeof enMessages } = {
    en: enMessages,
    de: deMessages,
};

const loadMessages = (locale: string) => {
    return messages[locale] || messages['en'];
};

/**
 * Custom Render method for UI Component testing.
 * Wraps the component with needed Providers.
 * @param ui
 * @param locale
 * @param renderOptions
 */
export const CustomRender = (ui: ReactNode, { locale = 'en', ...renderOptions } = {}) => {
    const messages = loadMessages(locale);
    const Wrapper: React.FC<WrapperProps> = ({ children }) => (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <NotificationContextProvider>{children}</NotificationContextProvider>
        </NextIntlClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};
