'use client';

import { Box, Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * Boundary for an unknown `[view]` segment (the dispatcher calls `notFound()`
 * when a view key isn't registered). Co-located so `notFound()` resolves here
 * — the nearest boundary — instead of the root `[locale]/not-found.tsx`, which
 * renders a full `<html>` document and would nest illegally inside this route's
 * layout. Rendered inside {@link AasViewerLayout}, so the header and switcher stay.
 *
 * Mirrors the look of {@link NoSearchResult} (heading + description + home
 * button) but reports the missing *view* rather than a missing AAS.
 */
export default function ViewNotFound() {
    const params = useParams<{ view: string }>();
    const t = useTranslations('pages.aasViewer.viewNotFound');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                alignItems: 'center',
                width: '100%',
                mt: 3,
                mb: 6,
            }}
        >
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
                {t('header')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {t('description', { view: params.view })}
            </Typography>
            <Button variant="contained" startIcon={<ArrowForward />} href="/">
                {t('toHomeButton')}
            </Button>
        </Box>
    );
}
