import { Dialog, DialogContent, Typography } from '@mui/material';
import { Entity } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { useTranslations } from 'next-intl';

type EntityDetailsModalProps = {
    readonly entity: Entity;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function EntityDetailsDialog(props: EntityDetailsModalProps) {
    const entity = props.entity;
    const t = useTranslations('common');

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogCloseButton handleClose={props.handleClose} />
            <DialogContent data-testid="bom-info-popup" style={{ padding: '40px' }}>
                <Typography variant="h3" color={'primary'} sx={{ mb: 2, mr: 4 }}>
                    {entity.idShort}
                </Typography>
                <DataRow title="idShort" hasDivider={false}>
                    {entity.idShort}
                </DataRow>
                <DataRow title="asset">
                    {entity.globalAssetId || t('labels.notAvailable')}
                </DataRow>
                <DataRow title="entityType">
                    {entity.entityType || t('labels.notAvailable')}
                </DataRow>
            </DialogContent>
        </Dialog>
    );
}
