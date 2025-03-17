import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'app/[locale]/_components/DialogCloseButton';

type SubmodelInfoDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly idShort: string | null | undefined ;
    readonly id: string | undefined;
};

export function SubmodelInfoDialog(props: SubmodelInfoDialogProps) {
    const t = useTranslations('submodels');

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogCloseButton handleClose={props.onClose} />
            <DialogContent style={{ padding: '40px' }}>
                <Box display="flex" flexDirection="column" gap="20px">
                    <Typography variant="h2" color={'primary'}>
                        {props.idShort}
                    </Typography>
                    <Box>
                        <Typography color="text.secondary">
                            {t('idLabel')} {props.id}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
