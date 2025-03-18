import { Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { DataRow } from 'components/basics/DataRow';

type SubmodelInfoDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly idShort: string | null | undefined;
    readonly id: string | undefined;
};

export function SubmodelInfoDialog(props: SubmodelInfoDialogProps) {
    const t = useTranslations('submodels');

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogCloseButton handleClose={props.onClose}/>
            <DialogContent style={{ padding: '40px' }}>
                <Typography variant="h2" color={'primary'}>
                    {props.idShort}
                </Typography>
                <DataRow title={t('idLabel')}>{props.id}</DataRow>
            </DialogContent>
        </Dialog>
    );
}
