'use client';
import { Box, Button, Typography } from '@mui/material';
import { useEnv } from 'app/EnvProvider';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const GoToListButton = () => {
    const isMobile = useIsMobile();
    const env = useEnv();
    const navigate = useRouter();
    const t = useTranslations('pages.dashboard');

    return (
        <>
            {!isMobile && env.AAS_LIST_FEATURE_FLAG && (
                <Box display="flex" flexDirection="column">
                    <Typography color="text.secondary" textAlign="center" sx={{ mb: 2, mt: 6 }}>
                        {t('listBtnLabel')}
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            data-testid="aasList-Button-Home"
                            onClick={() => navigate.push('/list')}
                        >
                            {t('listBtnText')}
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};
