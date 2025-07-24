'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export function DummyComponentNextIntl() {
    const t = useTranslations('components.dummyComponent');
    return <Box data-testid="test-text">{t('dummyText')}</Box>;
}
