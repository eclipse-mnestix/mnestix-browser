import { Dialog, DialogContent, Typography } from '@mui/material';
import { ISubmodelElement, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { GenericSubmodelElementComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { useTranslations } from 'next-intl';

type DocumentDetailsModalProps = {
    readonly document: SubmodelElementCollection;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function DocumentDetailsDialog(props: DocumentDetailsModalProps) {
    const document = props.document;
    const t = useTranslations('common');

    if (!document.value) {
        return <></>;
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md">
            <DialogCloseButton handleClose={props.handleClose} />
            <DialogContent style={{ padding: '40px' }} data-testid="document-details-dialog">
                <Typography variant="h3" sx={{ mb: 3 }}>
                    {t('labels.documentDetails')}
                </Typography>
                {document.value.map((el, i) => (
                    <GenericSubmodelElementComponent 
                        submodelElement={el as ISubmodelElement} 
                        key={i} 
                        hasDivider={i !== 0}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );
}
