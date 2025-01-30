import { Button } from '@mui/material';
import { Login } from '@mui/icons-material';
import { useAuth } from 'lib/hooks/UseAuth';
import { useTranslations } from 'next-intl';

const SignInButton = () => {
    const auth = useAuth();
    const t = useTranslations('mainMenu');
    return (
        <Button
            sx={{ m: 2, mt: 3, minWidth: '200px' }}
            variant="contained"
            startIcon={<Login />}
            onClick={() => auth.login()}
            data-testid="sign-in-button"
        >
            {t('login')}
        </Button>
    );
};

export default SignInButton;
