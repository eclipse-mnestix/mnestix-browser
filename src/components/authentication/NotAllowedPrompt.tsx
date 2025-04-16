import { Box, Typography } from '@mui/material';
import AuthenticationLock from 'assets/authentication_lock.svg';
import { useTranslations } from 'next-intl';

export function NotAllowedPrompt() {
    const t = useTranslations('components.authentication');
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                width: 'auto',
                m: 3,
                mt: 5,
            }}
        >
            <Typography variant="h2" sx={{ mb: 2 }} color="primary" align="center">
                {t('contactAdmin')}
            </Typography>
            <AuthenticationLock data-testid="not-allowed-prompt-lock" />
        </Box>
    );
}
