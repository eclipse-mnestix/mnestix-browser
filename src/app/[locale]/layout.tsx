import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { ClientLayout } from 'app/[locale]/clientLayout';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from 'i18n/routing';
import { notFound } from 'next/navigation';

export type LocalizedIndexLayoutProps = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
    title: 'Mnestix',
    description: 'AAS made easy',
};

export default async function RootLayout({ children, params }: Readonly<LocalizedIndexLayoutProps>) {
    const messages = await getMessages();
    const { locale } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body>
                <AppRouterCacheProvider>
                    <NextIntlClientProvider messages={messages}>
                        <ClientLayout>
                            <div id="root">{children}</div>
                        </ClientLayout>
                    </NextIntlClientProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
