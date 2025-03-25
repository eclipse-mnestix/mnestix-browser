import { Box, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MnestixLogo } from 'components/basics/MnestixLogo';
import Image from 'next/image';
export function HeaderLogo() {
    const theme = useTheme();
    const navigate = useRouter();

    const goToHome = () => {
        navigate.push('/');
    };

    return (
        <Box data-testid="header-logo" onClick={goToHome} sx={{ height: '100%', cursor: 'pointer' }}>
            {theme?.productLogo?.logo ? (
                <Image width={0} height={0} src={theme.productLogo.logo} alt={'Logo'} style={{ width: '100%' }}/>
            ) : (
                <MnestixLogo />
            )}
        </Box>
    );
}
