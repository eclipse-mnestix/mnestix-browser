'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export function DummyComponentNextIntl() {
    const t = useTranslations('common.labels');
    return (
        <Box data-testid="test-text">
            {t('aasId')}
        </Box>
    );
}
