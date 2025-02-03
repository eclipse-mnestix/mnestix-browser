import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';

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
