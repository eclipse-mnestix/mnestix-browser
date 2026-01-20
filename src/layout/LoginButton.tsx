import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { Box, Button, Typography } from '@mui/material';
import { AccountCircle, AdminPanelSettings, Login, Logout } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { useAuth } from 'lib/hooks/UseAuth';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

export default function LoginButton(props: { isLoggedIn: boolean; name: string; mnestixRole: MnestixRole }) {
    const auth = useAuth();
    const t = useTranslations('navigation.mainMenu');
    const isMobile = useIsMobile();

    const buttonSx = {
        color: 'background.default',
        textTransform: 'none',
        fontWeight: 700,
        px: 1.5,
        py: 0.5,
        minWidth: 0,
        '& .MuiButton-startIcon': {
            color: 'background.default',
            marginRight: 0.5,
        },

        '&:hover': {
            backgroundColor: (theme: { palette: { background: { default: string } } }) =>
                alpha(theme.palette.background.default, 0.12),
        },
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            {props.isLoggedIn ? (
                <>
                    <Box
                        component="span"
                        display="inline-flex"
                        alignItems="center"
                        gap={0.75}
                        data-testid="user-info-box"
                        sx={{
                            color: 'background.default',
                            maxWidth: isMobile ? 32 : 180,
                        }}
                    >
                        {props.mnestixRole === MnestixRole.MnestixAdmin ? (
                            <AdminPanelSettings data-testid="admin-icon" fontSize="small" />
                        ) : (
                            <AccountCircle data-testid="user-icon" fontSize="small" />
                        )}
                        {!isMobile && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'background.default',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: 140,
                                }}
                            >
                                {props.name}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        startIcon={<Logout data-testid="logout-button" />}
                        onClick={() => auth.logout()}
                        sx={buttonSx}
                    >
                        {t('logout')}
                    </Button>
                </>
            ) : (
                <Button
                    startIcon={<Login data-testid="login-button" />}
                    onClick={() => auth.login()}
                    sx={buttonSx}
                >
                    {t('login')}
                </Button>
            )}
        </Box>
    );
}
