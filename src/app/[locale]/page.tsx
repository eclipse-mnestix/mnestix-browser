'use client';

import { Box, Card, Grid, Typography, useTheme } from '@mui/material';
import { GoToListCard } from 'app/[locale]/_components/GoToListCard';
import { FindOutMoreCard } from 'app/[locale]/_components/FindOutMoreCard';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { LocalizedError } from 'lib/util/LocalizedError';
import {
    performFullAasSearch,
    searchAasInInfrastructure,
} from 'lib/services/infrastructure-search-service/infrastructureSearchActions';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { useTranslations } from 'next-intl';
import { useShowError } from 'lib/hooks/UseShowError';
import { useAasStore } from 'stores/AasStore';
import { useRouter } from 'next/navigation';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { useEnv } from 'app/EnvProvider';

export default function () {
    const t = useTranslations('pages.dashboard');
    const { addAasData } = useAasStore();
    const { showError } = useShowError();
    const navigate = useRouter();
    const theme = useTheme();
    const isMobile = useIsMobile();
    const env = useEnv();

    const searchInput = async (
        searchString: string,
        error_message: string,
        onErrorCallback: (error: LocalizedError) => void,
        onSuccessCallback: () => void,
        infrastructureName?: string,
    ) => {
        try {
            const { isSuccess, result } = infrastructureName
                ? await searchAasInInfrastructure(searchString, infrastructureName)
                : await performFullAasSearch(searchString.trim());
            if (!(isSuccess && result)) {
                const error = new LocalizedError('navigation.errors.urlNotFound');
                showError(error);
                onErrorCallback(error);
            } else {
                onSuccessCallback();
                if (result.aas) {
                    addAasData({
                        aas: result.aas,
                        aasData: {
                            aasRepositoryOrigin: result.aasData?.aasRepositoryOrigin,
                            submodelDescriptors: result.aasData?.submodelDescriptors ?? [],
                            infrastructureName: result.aasData?.infrastructureName || null,
                        },
                    });
                }
                navigate.push(result.redirectUrl);
            }
        } catch (e) {
            showError(new Error(error_message));
            onErrorCallback(e instanceof LocalizedError ? e : new LocalizedError('navigation.errors.unexpectedError'));
            return;
        }
    };

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
                        <Card sx={{ backgroundColor: theme.palette.primary.main, borderRadius: '12px' }}>
                            <QrScanner searchInput={searchInput} />
                        </Card>
                    </Grid>
                    {!isMobile && env.AAS_LIST_FEATURE_FLAG && (
                        <Grid size={{ md: 3, xs: 6 }}>
                            <Card sx={{ height: '100%', borderRadius: '12px' }}>
                                <GoToListCard />
                            </Card>
                        </Grid>
                    )}
                    <Grid size={{ md: 3, xs: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: '12px' }}>
                            <FindOutMoreCard />
                        </Card>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Card sx={{ width: '100%', borderRadius: '12px' }}>
                            <ManualAasInput searchInput={searchInput} />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
