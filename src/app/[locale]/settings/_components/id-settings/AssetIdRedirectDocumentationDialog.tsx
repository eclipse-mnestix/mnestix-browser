import { Dialog, DialogContent, DialogProps, Divider, styled, Typography } from '@mui/material';
import documentationI40AppPng from 'assets/settings/docu-i40-app.png';
import documentationBrowserPng from 'assets/settings/docu-browser.png';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';

const StyledImg = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: theme.palette.grey['300'],
    backgroundColor: theme.palette.grey['100'],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
}));

interface AssetIdRedirectDocumentationDialogProps extends DialogProps {
    onClose: () => void;
}

export function AssetIdRedirectDocumentationDialog(props: AssetIdRedirectDocumentationDialogProps) {
    const t = useTranslations('pages.settings.idStructure');
    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="lg">
            <DialogCloseButton handleClose={props.onClose} />
            <DialogContent sx={{ pb: 6 }}>
                <Typography variant="h2" sx={{ mb: 5 }} data-testid="asset-id-redirect-documentation-dialog">
                    {t('assetIdDocumentation.title')}
                </Typography>
                <Typography variant="h3" sx={{ mt: 3, mb: 1 }}>
                    {t('assetIdDocumentation.industry40Heading')}
                </Typography>
                <Typography>{t('assetIdDocumentation.industry40Text')}</Typography>
                <StyledImg src={documentationI40AppPng.src} />
                <Divider sx={{ my: 4 }} />
                <Typography variant="h3" sx={{ mt: 3, mb: 1 }}>
                    {t('assetIdDocumentation.dnsHeading')}
                </Typography>
                <Typography>{t('assetIdDocumentation.dnsText')}</Typography>
                <StyledImg src={documentationBrowserPng.src} />
                <Typography variant="h4" sx={{ mb: 1 }}>
                    {t('assetIdDocumentation.exampleHeading')}
                </Typography>
                <Typography>
                    <strong>{t('assetIdDocumentation.assetId')}</strong>
                    http://aas.example.com/assetid1
                </Typography>
                <Typography>
                    <strong>{t('assetIdDocumentation.redirectsTo')}</strong>
                    https://your-mnestix-instance.com/asset/http%3A%2F%2Faas.example.com%2Fassetid1
                </Typography>
                <Typography>
                    <strong>{t('assetIdDocumentation.endResult')}</strong>
                    https://your-mnestix-instance.com/viewer/[base64 encoded AAS ID]
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
