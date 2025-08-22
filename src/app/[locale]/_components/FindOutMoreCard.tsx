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
                    borderRadius: 1,
                    width: '50px',
                    height: '50px',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <DownloadIcon sx={{ color: 'white' }} />
            </Box>
            <Typography align="center" variant="h5">
                {t('findOutMoreText')}:
            </Typography>
            <Typography align="center">{t('findOutMoreText')}:</Typography>
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
