'use client';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useEnv } from 'app/EnvProvider';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export const GoToListCard = () => {
    const isMobile = useIsMobile();
    const env = useEnv();
    const navigate = useRouter();
    const t = useTranslations('pages.dashboard');
    const theme = useTheme();

    return (
        <>
            {!isMobile && env.AAS_LIST_FEATURE_FLAG && (
                <Box display="flex" flexDirection="column" sx={{ m: 2 }} alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 1,
                            width: '50px',
                            height: '50px',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ArrowOutwardIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h5">{t('listCardHeader')}</Typography>
                    <Typography color="text.secondary" textAlign="center">
                        {t('listBtnLabel')}
                    </Typography>
                    <Box display="flex" mt={1}>
                        <Button variant="text" data-testid="aasList-Button-Home" onClick={() => navigate.push('/list')}>
                            {t('listBtnText')}
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};
