import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';

type AddAasModalProps = {
    readonly onSubmit: (result: string) => Promise<void>;
    readonly onClose: () => void;
    readonly open: boolean;
};

export function CompareAasAddDialog(props: AddAasModalProps) {
    const t = useTranslations('pages');

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth={true}
            data-testid="compare-aas-aad-dialog"
        >
            <DialogCloseButton handleClose={props.onClose} />
            <DialogContent style={{ paddingLeft: '60px', paddingRight: '60px' }}>
                <Box display="flex" flexDirection="column" gap="20px">
                    <Typography variant="h2" textAlign="center" margin="30px 0">
                        {t('compare.addAnother')}:
                    </Typography>
                    <Box>
                        <Typography color="text.secondary" textAlign="center">
                            {t('dashboard.scanIdLabel')}
                        </Typography>
                        <QrScanner onScan={props.onSubmit} size={400} />
                        <Typography color="text.secondary" textAlign="center" sx={{ mb: 2, fontSize: '14px' }}>
                            {t('dashboard.enterManuallyLabel')}
                        </Typography>
                    </Box>
                </Box>
                <Box paddingY="20px">
                    <ManualAasInput onSubmit={props.onSubmit} />
                </Box>
            </DialogContent>
        </Dialog>
    );
}
