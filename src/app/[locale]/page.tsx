import { Box, Card, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { DashboardInput } from './_components/DashboardInput';
import { GoToListButton } from './_components/GoToListButton';
import { FindOutMoreCard } from 'app/[locale]/_components/FindOutMoreCard';

export default async function page() {
    const t = await getTranslations('pages.dashboard');

    return (
        <Box sx={{ p: 2, m: 'auto' }}>
            <Box sx={{ mb: 2 }}>
                <Typography data-testid="welcome-text" variant="h1" color="primary" sx={{ mt: 2 }}>
                    {t('welcomeText')}
                </Typography>
                <Typography variant="h3">{t('digitalTwinMadeEasyText')}</Typography>
            </Box>

            <Grid container spacing={2} alignItems="stretch">
                <Grid size={4}>
                    <Card>
                        <DashboardInput />
                    </Card>
                </Grid>
                <Grid size={2}>
                    <Card sx={{ height: '100%' }}>
                        <GoToListButton />
                    </Card>
                </Grid>
                <Grid size={2}>
                    <Card sx={{ height: '100%' }}>
                        <FindOutMoreCard />
                    </Card>
                </Grid>
                <Grid size={8}>
                    <Card>
                        <DashboardInput />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
