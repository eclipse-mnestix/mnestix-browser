'use client';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type AssetNotFoundProps = {
    id?: string | null;
};

export default function AssetNotFound({ id }: AssetNotFoundProps) {
    const navigate = useRouter();
    const t = useTranslations('components.assetNotFound');

    return (
        <>
            <Typography variant="h1" color="primary" align="center" sx={{ mt: 2 }}>
                {t('header')}
            </Typography>
            <Typography align="center" sx={{ mt: 2 }}>
                {t('text', { id: id ?? '' })}
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => navigate.push('/')}>
                        {t('toHome')}
                    </Button>
                </Box>
            </Typography>
        </>
    );
}
