import { Button } from '@mui/material';
import { Login } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import { useAuth } from 'lib/hooks/UseAuth';

const SignInButton = () => {
    const auth = useAuth();
    return (
        <Button
            sx={{ m: 2, mt: 3, minWidth: '200px' }}
            variant="contained"
            startIcon={<Login />}
            onClick={() => auth.login()}
            data-testid="sign-in-button"
        >
            <FormattedMessage {...messages.mnestix.login} />
        </Button>
    );
};

export default SignInButton;
