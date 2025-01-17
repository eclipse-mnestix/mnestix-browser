import { getTranslations } from 'next-intl/server';
import { Typography } from '@mui/material';

export default async function AasListHeader() {
    const t = await getTranslations('aas-list');

    return (
        <>
            <Typography variant="h2" color="text.primary" textAlign="left" marginBottom={2}>
                {t('header')}
            </Typography>
        </>
    );
}
