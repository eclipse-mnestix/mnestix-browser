import { Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export function NoSearchResult(props: { base64AasId: string }) {
    const t = useTranslations('components.noSearchResult');
    return (
        <>
            <Typography
                variant="h2"
                style={{
                    width: '90%',
                    margin: '0 auto',
                    marginTop: '10px',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    textAlign: 'center',
                    display: 'inline-block',
                }}
            >
                {t('header')}
            </Typography>
            <Typography color="text.secondary">{t('noDataFound', { name: props.base64AasId })}</Typography>
            <Button variant="contained" startIcon={<ArrowForward />} href="/">
                {t('toHomeButton')}
            </Button>
        </>
    );
}
