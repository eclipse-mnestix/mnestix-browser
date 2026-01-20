import { AppBar, Box, styled, Toolbar } from '@mui/material';
import MainMenu from './menu/MainMenu';
import { HeaderLogo } from './HeaderLogo';
import { LanguageSelector } from './LanguageSelector';
import BottomMenu from './menu/BottomMenu';
import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { useAuth } from 'lib/hooks/UseAuth';
//import LoginButton from './LoginButton';
import { useEnv } from 'app/EnvProvider';

const Offset = styled(Box)(({ theme }) => theme.mixins.toolbar);

const StyledLogoWrapper = styled(Box)(() => ({
    '.logo': {
        // toolbar min-height is 56px
        height: 32,
        margin: 10,
        '@media(min-width:600px)': {
            // toolbar min-height is 64px
            height: 36,
        },
    },
}));

export function Header() {
    const auth = useAuth();
    const env = useEnv();
    const useAuthentication = env.AUTHENTICATION_FEATURE_FLAG;
    const mnestixRole = auth.getAccount()?.user.mnestixRole ?? MnestixRole.MnestixGuest;
    const getAuthName = () => {
        const user = auth?.getAccount()?.user;
        if (!user) return;
        if (user.email) return user.email;
        if (user.name) return user.name;
        return;
    };
    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar disableGutters>
                    <MainMenu />
                    <StyledLogoWrapper
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                        marginRight="18%"
                        position="absolute"
                        alignSelf="center"
                    >
                        <Box className="logo">
                            <HeaderLogo />
                        </Box>
                    </StyledLogoWrapper>
                    {
                        // Change to ButtomMenu if new Button is not finished with first presentation
                        useAuthentication && <BottomMenu
                            mnestixRole={mnestixRole}
                            name={getAuthName() ?? ''}
                            isLoggedIn={auth.isLoggedIn}
                        />
                    }
                    <LanguageSelector />
                </Toolbar>
            </AppBar>
            <Offset />
        </>
    );
}
