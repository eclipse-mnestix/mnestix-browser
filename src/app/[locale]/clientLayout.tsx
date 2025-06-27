'use client';

import { Box } from '@mui/material';
import { NotificationContextProvider } from 'components/contexts/NotificationContext';
import { LayoutRoot } from 'layout/LayoutRoot';
import { CustomThemeProvider } from 'layout/theme/CustomThemeProvider';
import { Internationalization } from 'lib/i18n/Internationalization';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { EnvProvider } from 'app/EnvProvider';
import { InvalidSessionHandler } from 'components/authentication/InvalidSessionHandler';
import { AasStoreProvider } from 'stores/AasStore';

export type ClientLayoutProps = {
    children: ReactNode;
};

// When setting up Mnestix in a kiosk mode it will run long without interaction
// for this case we refetch the session every 5 minutes.
// This does not refresh the session but will trigger a logout if the session is invalid.
const FIVE_MIN = 5 * 60;

export const ClientLayout = ({ children }: Readonly<ClientLayoutProps>) => {
    return (
        <EnvProvider>
            <SessionProvider refetchInterval={FIVE_MIN} refetchOnWindowFocus={true}>
                <InvalidSessionHandler />
                <Internationalization>
                    <CustomThemeProvider>
                        <NotificationContextProvider>
                            <AasStoreProvider>
                                <LayoutRoot>
                                    <Box flexGrow={1} data-testid="notifications">
                                        {children}
                                    </Box>
                                </LayoutRoot>
                            </AasStoreProvider>
                        </NotificationContextProvider>
                    </CustomThemeProvider>
                </Internationalization>
            </SessionProvider>
        </EnvProvider>
    );
};
