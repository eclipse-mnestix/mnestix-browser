import { OpenInNew } from '@mui/icons-material';
import { Box, Divider, Link, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { DashboardInput } from './_components/DashboardInput';
import { GoToListButton } from './_components/GoToListButton';

export default async function page() {
    const t = await getTranslations('dashboard');

    return (
        <Box sx={{ p: 2, m: 'auto' }}>
            <Typography data-testid="welcome-text" variant="h1" color="primary" align="center" sx={{ mt: 2 }}>
                {t('welcome-text')}
            </Typography>
            <Typography variant="h3" align="center">
                {t('digitalTwinMadeEasy-text')}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <DashboardInput />
            <GoToListButton />
            <Typography align="center" sx={{ mt: 4 }}>
                {t('findOutMore-text')}:
            </Typography>
            <Typography align="center">
                <Link
                    href="https://mnestix.io"
                    target="_blank"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <span>mnestix.io</span>
                    <OpenInNew fontSize="small" />
                </Link>
            </Typography>
        </Box>
    );
}
