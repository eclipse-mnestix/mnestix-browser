'use client';

import { Box } from '@mui/material';
import { NotificationContextProvider } from 'components/contexts/NotificationContext';
import { LayoutRoot } from 'layout/LayoutRoot';
import { CustomThemeProvider } from 'layout/theme/CustomThemeProvider';
import { Internationalization } from 'lib/i18n/Internationalization';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { withBasePath } from 'lib/basePathHelpers';
import { EnvProvider } from 'app/EnvProvider';
import { InvalidSessionHandler } from 'components/authentication/InvalidSessionHandler';
import { AasStoreProvider } from 'stores/AasStore';
import ErrorBoundary from 'components/basics/ErrorBoundary';
import { useTranslations } from 'next-intl';
import { HealthCheckProvider } from 'components/contexts/HealthCheckContext';

export type ClientLayoutProps = {
    children: ReactNode;
};

// When setting up Mnestix in a kiosk mode it will run long without interaction
// for this case we refetch the session every 5 minutes.
// This does not refresh the session but will trigger a logout if the session is invalid.
const FIVE_MIN = 5 * 60;

export const ClientLayout = ({ children }: Readonly<ClientLayoutProps>) => {
    const t = useTranslations('navigation');
    return (
        <EnvProvider>
            {/* basePath: next-auth v4's client does not inherit Next.js basePath —
                without this prop every client call (session, csrf, providers,
                signIn, signOut) hits /api/auth and 404s when BASE_PATH is set. */}
            <SessionProvider
                refetchInterval={FIVE_MIN}
                refetchOnWindowFocus={true}
                basePath={withBasePath('/api/auth')}
            >
                <InvalidSessionHandler />
                <Internationalization>
                    <CustomThemeProvider>
                        <NotificationContextProvider>
                            <HealthCheckProvider>
                                <AasStoreProvider>
                                    <LayoutRoot>
                                        <ErrorBoundary message={t('errors.generic')}>
                                            <Box data-testid="notifications" sx={{
                                                flexGrow: 1
                                            }}>
                                                {children}
                                            </Box>
                                        </ErrorBoundary>
                                    </LayoutRoot>
                                </AasStoreProvider>
                            </HealthCheckProvider>
                        </NotificationContextProvider>
                    </CustomThemeProvider>
                </Internationalization>
            </SessionProvider>
        </EnvProvider>
    );
};
