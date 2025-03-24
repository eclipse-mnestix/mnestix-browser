import { Dialog, DialogContent, DialogProps, Divider, styled, Typography } from '@mui/material';
import documentationI40AppPng from 'assets/settings/docu-i40-app.png';
import documentationBrowserPng from 'assets/settings/docu-browser.png';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
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
    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="lg">
            <DialogCloseButton handleClose={props.onClose}/>
            <DialogContent sx={{ pb: 6 }}>
                <Typography variant="h2" sx={{ mb: 5 }}>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.title} />
                </Typography>
                <Typography variant="h3" sx={{ mt: 3, mb: 1 }}>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.industry40Heading} />
                </Typography>
                <Typography>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.industry40Text} />
                </Typography>
                <StyledImg src={documentationI40AppPng.src} />
                <Divider sx={{ my: 4 }} />
                <Typography variant="h3" sx={{ mt: 3, mb: 1 }}>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.dnsHeading} />
                </Typography>
                <Typography>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.dnsText} />
                </Typography>
                <StyledImg src={documentationBrowserPng.src} />
                <Typography variant="h4" sx={{ mb: 1 }}>
                    <FormattedMessage {...messages.mnestix.assetIdDocumentation.exampleHeading} />
                </Typography>
                <Typography>
                    <strong>
                        <FormattedMessage {...messages.mnestix.assetId} />:{' '}
                    </strong>
                    http://aas.example.com/assetid1
                </Typography>
                <Typography>
                    <strong>
                        <FormattedMessage {...messages.mnestix.redirectsTo} />:{' '}
                    </strong>
                    https://your-mnestix-instance.com/asset/http%3A%2F%2Faas.example.com%2Fassetid1
                </Typography>
                <Typography>
                    <strong>
                        <FormattedMessage {...messages.mnestix.endResult} />:{' '}
                    </strong>
                    https://your-mnestix-instance.com/viewer/[base64 encoded AAS ID]
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
