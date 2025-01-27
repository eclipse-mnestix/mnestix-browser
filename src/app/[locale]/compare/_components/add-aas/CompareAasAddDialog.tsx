import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QrScanner } from 'app/[locale]/_components/QrScanner';
import { ManualAasInput } from 'app/[locale]/_components/ManualAasInput';
import { useTranslations } from 'next-intl';

type AddAasModalProps = {
    readonly onSubmit: (result: string) => Promise<void>;
    readonly onClose: () => void;
    readonly open: boolean;
};

export function CompareAasAddDialog(props: AddAasModalProps) {
    const t = useTranslations();

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth={true}
            data-testid="compare-aas-aad-dialog"
        >
            <IconButton
                aria-label="close"
                onClick={props.onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
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
