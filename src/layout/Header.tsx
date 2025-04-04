import { AppBar, Box, styled, Toolbar } from '@mui/material';
import MainMenu from './menu/MainMenu';
import { HeaderLogo } from './HeaderLogo';

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
                </Toolbar>
            </AppBar>
            <Offset />
        </>
    );
}
