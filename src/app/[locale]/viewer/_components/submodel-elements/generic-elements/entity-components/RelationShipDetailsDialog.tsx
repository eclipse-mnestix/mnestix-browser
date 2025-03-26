import { Box, Dialog, DialogContent, Tooltip, Typography } from '@mui/material';
import { RelationshipElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { DataRow } from 'components/basics/DataRow';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { RelationShipTypes } from 'lib/enums/RelationShipTypes.enum';
import { InfoOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

type RelationShipDetailsModalProps = {
    readonly relationship: RelationshipElement;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function RelationShipDetailsDialog(props: RelationShipDetailsModalProps) {
    const t = useTranslations('components.relationShipDetailsDialog');
    const relationship = props.relationship;
    const semanticId = relationship.semanticId?.keys[0].value;

    const getRelationshipType = (semanticId: string): string => {
        switch (semanticId) {
            case RelationShipTypes.SameAs:
                return t('sameAs');
            case RelationShipTypes.IsPartOf:
                return t('isPartOf');
            case RelationShipTypes.HasPart:
                return t('hasPart');
            default:
                return t('error.unknownRelationship');
        }
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogCloseButton handleClose={props.handleClose} />
            <DialogContent data-testid="bom-info-popup" style={{ padding: '40px' }}>
                <Typography variant="h3" color={'primary'} sx={{ mb: 2, mr: 4 }}>
                    {relationship.idShort}
                </Typography>
                <DataRow hasDivider={false}>
                    <Box display="flex" width="100%" gap={1}>
                        <Box sx={{ color: 'text.secondary' }}>Entity:</Box>
                        {relationship.first.keys[relationship.first.keys.length - 1]?.value || t('error.entityError')}
                    </Box>
                </DataRow>
                <DataRow hasDivider={false}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Typography color={'primary'}>{getRelationshipType(semanticId ?? '')} </Typography>
                        <Tooltip title={`${t('semanticId')}: ${semanticId ?? t('error.semanticError')}`}>
                            <InfoOutlined sx={{ color: 'text.secondary' }} />
                        </Tooltip>
                    </Box>
                </DataRow>
                <DataRow hasDivider={false}>
                    <Box display="flex" width="100%" gap={1}>
                        <Box sx={{ color: 'text.secondary' }}>Entity:</Box>
                        {relationship.second.keys[relationship.second.keys.length - 1]?.value || t('error.entityError')}
                    </Box>
                </DataRow>
            </DialogContent>
        </Dialog>
    );
}
