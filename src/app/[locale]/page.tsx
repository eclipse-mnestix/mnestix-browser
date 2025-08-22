import { Box, Card, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { DashboardInput } from './_components/DashboardInput';
import { GoToListButton } from './_components/GoToListButton';
import { FindOutMoreCard } from 'app/[locale]/_components/FindOutMoreCard';

export default async function page() {
    const t = await getTranslations('pages.dashboard');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
            <Box sx={{ maxWidth: 1000, textAlign: 'left', p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography data-testid="welcome-text" variant="h1" color="primary" sx={{ mt: 2 }}>
                        {t('welcomeText')}
                    </Typography>
                    <Typography variant="h3">{t('digitalTwinMadeEasyText')}</Typography>
                </Box>

                <Grid container spacing={2} alignItems="stretch">
                    <Grid size={{ md: 6, xs: 12 }}>
                        <Card>
                            <DashboardInput />
                        </Card>
                    </Grid>
                    <Grid size={{ md: 3, xs: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <GoToListButton />
                        </Card>
                    </Grid>
                    <Grid size={{ md: 3, xs: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <FindOutMoreCard />
                        </Card>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Card sx={{ width: '100%' }}>
                            <Box width="100%" height="200px">
                                test
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
