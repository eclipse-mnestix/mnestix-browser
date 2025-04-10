'use client';
import { useTranslations } from 'use-intl';
import { Box, styled } from '@mui/material';
import { NotificationOutlet } from 'components/basics/NotificationOutlet';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReactNode, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useSession } from 'next-auth/react';

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
    const [prefSession, setPrefSession] = useState<Session | null>(null);
    const { data: session } = useSession();
    const t = useTranslations('validation.authentication');

    const notificationSpawner = useNotificationSpawner();

    useEffect(() => {
        if (prefSession && !session) {
            showSessionExpired();
        }
        setPrefSession(session);
    }, [session]);

    function showSessionExpired() {
        notificationSpawner.spawn({
            message: t('sessionExpired'),
            severity: 'warning',
        });
    }

    return (
        <Box display="flex" height="100%" flexDirection="column">
            <Box display="flex" flex={1} flexDirection="column">
                <StyledBox flex={1} display="flex">
                    <Header />
                    {children}
                </StyledBox>
                <Footer />
                <NotificationOutlet />
            </Box>
        </Box>
    );
}
