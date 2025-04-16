'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DifferenceSymbol } from 'components/basics/DifferenceSymbol';

export function DummyComponent() {
    const t = useTranslations('components.dummyComponent');

    return (
        <Box data-testid="test-text">
            <DifferenceSymbol />
            {t('dummyText')}
        </Box>
    );
}
