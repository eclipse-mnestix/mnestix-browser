import { Dialog, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { DataRow } from 'components/basics/DataRow';
import { Reference } from '@aas-core-works/aas-core3.0-typescript/types';

type SubmodelInfoDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly idShort: string | null | undefined;
    readonly semanticId: Reference | null | undefined;
    readonly id: string | undefined;
    readonly repositoryUrl?: string;
};

export function SubmodelInfoDialog(props: SubmodelInfoDialogProps) {
    const t = useTranslations('pages.aasViewer.submodels');

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogCloseButton handleClose={props.onClose} />
            <DialogContent style={{ padding: '40px' }}>
                <Typography variant="h2" color={'primary'} marginBottom={'1em'}>
                    {props.idShort}
                </Typography>
                <DataRow title={t('idLabel')} hasDivider={false}>
                    {props.id}
                </DataRow>
                <DataRow title={t('semanticIdLabel')} hasDivider={false}>
                    {props.semanticId?.keys?.map((el) => el.value).join(', ') || '-'}
                </DataRow>
                <DataRow title={t('repositoryUrlLabel')} hasDivider={false}>
                    {props.repositoryUrl}
                </DataRow>
            </DialogContent>
        </Dialog>
    );
}
