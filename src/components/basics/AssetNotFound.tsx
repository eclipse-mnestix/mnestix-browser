'use client';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type AssetNotFoundProps = {
    id?: string | null;
};

export default function AssetNotFound(props: AssetNotFoundProps) {
    const { id } = props;
    const navigate = useRouter();
    const t = useTranslations('common');

    return (
        <>
            <Typography variant="h1" color="primary" align="center" sx={{ mt: 2 }}>
                {t('messages.cannotLoadAasId.header')}
            </Typography>
            <Typography align="center" sx={{ mt: 2 }}>
                {t('messages.cannotLoadAasId.text', { id })}
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => navigate.push('/')}>
                        {t('actions.toHome')}
                    </Button>
                </Box>
            </Typography>
        </>
    );
}
