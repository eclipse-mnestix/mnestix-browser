import React, { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';
import enMessages from 'locale/en.json';
import deMessages from 'locale/de.json';
import { NotificationContextProvider } from 'components/contexts/NotificationContext';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface WrapperProps {
    children: ReactNode;
}

const messages: { [key: string]: typeof enMessages } = {
    en: enMessages,
    de: deMessages,
};

const loadMessages = (locale: 'en' | 'de') => {
    return messages[locale] || messages['en'];
};

/**
 * Custom Render method for UI Component testing.
 * Wraps the component with needed Providers.
 */
export const CustomRender = (
    ui: ReactNode,
    {
        locale = 'en',
        session = undefined,
        ...renderOptions
    }: { locale?: 'en' | 'de'; session?: Session | null } & RenderOptions = {},
) => {
    const messages = loadMessages(locale);
    const Wrapper: React.FC<WrapperProps> = ({ children }) =>
        session !== undefined ? (
            <SessionProvider refetchOnWindowFocus={false} session={session}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <NotificationContextProvider>{children}</NotificationContextProvider>
                </NextIntlClientProvider>
            </SessionProvider>
        ) : (
            <NextIntlClientProvider locale={locale} messages={messages}>
                <NotificationContextProvider>{children}</NotificationContextProvider>
            </NextIntlClientProvider>
        );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};
