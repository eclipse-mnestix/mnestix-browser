import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export function FilterContainer() {
    const t = useTranslations('pages.catalog');

    return (
        <>
            <Typography variant="h6" fontWeight={600}>
                {t('filter')}
            </Typography>
            <Typography color="text.secondary" marginTop={'1rem'}>
                ECLASS
            </Typography>
            <Typography color="text.secondary" marginTop={'1rem'}>
                VEC
            </Typography>
            <Typography color="text.secondary" marginTop={'1rem'}>
                Manufacturer Product Family and Designation
            </Typography>
        </>
    );
}
