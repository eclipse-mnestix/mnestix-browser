'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export function DummyComponentReactIntl() {
    const t = useTranslations('common');
    return (
        <Box data-testid="test-text">
            {t('labels.aasId')}
        </Box>
    );
}
