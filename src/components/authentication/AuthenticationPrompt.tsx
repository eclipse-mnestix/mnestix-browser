import { Box, Typography } from '@mui/material';
import AuthenticationLock from 'assets/authentication_lock.svg';
import SignInButton from 'components/authentication/SignInButton';
import { useTranslations } from 'next-intl';

type AuthenticationPromptProps = {
    isDefaultRepo?: boolean;
};

/**
 * Renders the prompt shown when authentication is required.
 * Displays admin guidance if the current repository is not the default and there is an authentication error.
 */
export function AuthenticationPrompt({ isDefaultRepo }: AuthenticationPromptProps) {
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
                {t('authenticationNeeded')}
            </Typography>
            <AuthenticationLock data-testid="authentication-prompt-lock" />
            {isDefaultRepo ? (
                <SignInButton />
            ) : (
                <Typography
                    variant="body1"
                    sx={{ mt: 3 }}
                    color="text.primary"
                    align="center"
                    data-testid="authentication-prompt-contact-admin"
                >
                    {t('nonDefaultRepositoryInfo')}
                </Typography>
            )}
        </Box>
    );
}
