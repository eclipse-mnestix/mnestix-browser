'use client';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export function GoToListCard() {
    const theme = useTheme();
    const t = useTranslations('pages.dashboard');

    return (
        <Box
            display="flex"
            flex={1}
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            sx={{ px: 3, py: 4, gap: 1, height: '100%', width: '100%' }}
        >
            <Box
                sx={{
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: '8px',
                    width: '64px',
                    height: '64px',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ArrowOutwardIcon sx={{ color: 'white' }} />
            </Box>
            <Typography textAlign="center" variant="h4">
                {t('listCardHeader')}
            </Typography>
            <Typography color="text.secondary" textAlign="center">
                {t('listBtnLabel')}
            </Typography>
        </Box>
    );
}
