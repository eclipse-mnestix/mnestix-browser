import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { Entity } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import CloseIcon from '@mui/icons-material/Close';

type EntityDetailsModalProps = {
    readonly entity: Entity;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function EntityDetailsDialog(props: EntityDetailsModalProps) {
    const entity = props.entity;

    return (
        <Dialog open={props.open} onClose={props.handleClose}>

                <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            <DialogContent data-testid="bom-info-popup" style={{ padding: '40px' }}>
                <Typography variant="h3" sx={{ mb: 2, mr: 4 }}>
                    {entity.idShort}
                </Typography>
                <DataRow title="idShort" hasDivider={false}>
                    {entity.idShort}
                </DataRow>
                <DataRow title="asset">
                    {entity.globalAssetId || <FormattedMessage {...messages.mnestix.notAvailable} />}
                </DataRow>
                <DataRow title="entityType">
                    {entity.entityType || <FormattedMessage {...messages.mnestix.notAvailable} />}
                </DataRow>
            </DialogContent>
        </Dialog>
    );
}
