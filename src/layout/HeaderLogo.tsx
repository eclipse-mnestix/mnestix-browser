import { Box, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MnestixLogo } from 'components/basics/MnestixLogo';
export function HeaderLogo() {
    const theme = useTheme();
    const navigate = useRouter();

    const goToHome = () => {
        navigate.push('/');
    };

    return (
        <Box data-testid="header-logo" onClick={goToHome} sx={{ height: '100%', cursor: 'pointer' }}>
            {theme?.productLogo?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo can be an arbitrary url which conflicts with https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
                <img height="100%" src={theme.productLogo.logo} alt={'default Mnestix logo'} />
            ) : (
                <MnestixLogo />
            )}
        </Box>
    );
}
