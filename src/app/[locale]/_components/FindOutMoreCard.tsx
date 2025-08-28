'use client';

import { Box, Link, Typography, useTheme } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslations } from 'next-intl';

export function FindOutMoreCard() {
    const t = useTranslations('pages.dashboard');
    const theme = useTheme();

    return (
        <Box display="flex" flexDirection="column" sx={{ m: 2 }} alignItems="center">
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
            <hr style={{ width: '85%', margin: '16px 0 0 0' }} />
            <Typography align="center">
                <Link
                    href="https://mnestix.io"
                    target="_blank"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}
                >
                    <span>mnestix.io </span>
                    <OpenInNew fontSize="small" />
                </Link>
            </Typography>
        </Box>
    );
}
