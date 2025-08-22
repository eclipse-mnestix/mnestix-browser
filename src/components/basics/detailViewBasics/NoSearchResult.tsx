import { Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useShowError } from 'lib/hooks/UseShowError';

export function NoSearchResult(props: { base64AasId: string }) {
    const { showError } = useShowError();
    let aas_id: string;
    try {
        aas_id = safeBase64Decode(props.base64AasId);
    } catch (error) {
        showError(
            new Error(`Failed to decode base64 AAS ID: ${error instanceof Error ? error.message : String(error)}`),
        );
        // If we cannot decode we show the encoded variant
        aas_id = props.base64AasId;
    }

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
            <Typography color="text.secondary">{t('noDataFound', { name: aas_id })}</Typography>
            <Button variant="contained" startIcon={<ArrowForward />} href="/">
                {t('toHomeButton')}
            </Button>
        </>
    );
}
