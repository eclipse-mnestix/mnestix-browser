'use client';
import { Box, styled, Typography } from '@mui/material';
import { NotificationOutlet } from 'components/basics/NotificationOutlet';
import { Header } from './Header';
import React, { ReactNode } from 'react';
import { BottomNavigation } from '@mui/material';
import { BottomNavigationAction } from '@mui/material';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useEnv } from 'app/env/provider';
import { ExternalLink } from 'layout/menu/ExternalLink';
import { messages } from 'lib/i18n/localization';
import { FormattedMessage } from 'react-intl';

const StyledBox = styled(Box)(() => ({
        // toolbar min-height is 56px
        marginTop: 56,
        '@media(min-width:600px)': {
            // toolbar min-height is 64px
            marginTop: 64,
        },
}));

type Props = {
    children: ReactNode;
};

export function LayoutRoot({ children }: Props) {
    const env = useEnv();
    const imprintString = env.IMPRINT_URL;
    const dataPrivacyString = env.DATA_PRIVACY_URL;
    const copyrightString = `Copyright © ${new Date().getFullYear()} XITASO GmbH`;

    return (
        <Box display="flex" height="100%" flexDirection="column">
            <Box display="flex" flex={1} flexDirection="column">
                <StyledBox flex={1} display="flex">
                    <Header />
                    {children}
                </StyledBox>
                <Paper  elevation={3}>
                <BottomNavigation sx={{ bottom: 0, left: 0, right: 0 , position: 'fixed', backgroundColor: 'transparent' }}>
                    <Typography color="text.secondary" fontSize="small" sx={{ margin: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {copyrightString}
                    </Typography>

                    <Typography fontSize="small" sx={{ display: 'flex', maxWidth: '150px', alignItems: 'center', justifyContent: 'center' }}>
                        <Link
                            href={dataPrivacyString}
                            target="_blank"
                        >
                            <FormattedMessage {...messages.mnestix.dataPrivacy} />
                        </Link>
                    </Typography>

                    <Typography color="text.secondary" fontSize="small" sx={{ margin: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      |
                    </Typography>

                    <Typography  fontSize="small" sx={{ display: 'flex', maxWidth: '150px', alignItems: 'center', justifyContent: 'center' }}>
                        <Link
                            href={imprintString}
                            target="_blank"
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FormattedMessage {...messages.mnestix.imprint} />
                        </Link>
                    </Typography>

                </BottomNavigation>
                </Paper>
                <NotificationOutlet />
            </Box>
        </Box>
    );
}
