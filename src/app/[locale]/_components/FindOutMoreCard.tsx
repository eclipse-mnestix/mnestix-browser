'use client';

import { Box, Typography, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslations } from 'next-intl';

export function FindOutMoreCard() {
    const t = useTranslations('pages.dashboard');
    const theme = useTheme();

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
                <DownloadIcon sx={{ color: 'white' }} />
            </Box>
            <Typography align="center" variant="h4">
                {t('findOutMoreHeader')}
            </Typography>
            <Typography align="center" color="text.secondary">
                {t('findOutMoreText')}
            </Typography>
        </Box>
    );
}
