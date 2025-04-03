'use client';

import { Box } from '@mui/material';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { NotificationContextProvider } from 'components/contexts/NotificationContext';
import { LayoutRoot } from 'layout/LayoutRoot';
import { CustomThemeProvider } from 'layout/theme/CustomThemeProvider';
import { Internationalization } from 'lib/i18n/Internationalization';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { EnvProvider } from 'app/EnvProvider';

export type ClientLayoutProps = {
    children: ReactNode;
};

export const ClientLayout = ({ children }: Readonly<ClientLayoutProps>) => {
    return (
        <EnvProvider>
            <SessionProvider>
                <Internationalization>
                    <CustomThemeProvider>
                        <CurrentAasContextProvider>
                            <NotificationContextProvider>
                                <LayoutRoot>
                                    <Box flexGrow={1} data-testid="notifications">
                                        {children}
                                    </Box>
                                </LayoutRoot>
                            </NotificationContextProvider>
                        </CurrentAasContextProvider>
                    </CustomThemeProvider>
                </Internationalization>
            </SessionProvider>
        </EnvProvider>
    );
};
