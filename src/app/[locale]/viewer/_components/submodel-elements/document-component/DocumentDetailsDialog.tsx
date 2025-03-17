import { Dialog, DialogContent, Typography } from '@mui/material';
import { ISubmodelElement, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { messages } from 'lib/i18n/localization';
import { FormattedMessage } from 'react-intl';
import { GenericSubmodelElementComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericSubmodelElementComponent';
import { DialogCloseButton } from 'app/[locale]/_components/DialogCloseButton';

type DocumentDetailsModalProps = {
    readonly document: SubmodelElementCollection;
    readonly handleClose: () => void;
    readonly open: boolean;
};

export function DocumentDetailsDialog(props: DocumentDetailsModalProps) {
    const document = props.document;

    if (!document.value) {
        return <></>;
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md">
            <DialogCloseButton handleClose={props.handleClose} />
            <DialogContent style={{ padding: '40px' }}>
                <Typography variant="h3" sx={{ mb: 3 }}>
                    <FormattedMessage {...messages.mnestix.documentDetails} />
                </Typography>
                {document.value.map((el, i) => (
                    <GenericSubmodelElementComponent submodelElement={el as ISubmodelElement} key={i} hasDivider={i !== 0} />
                ))}
            </DialogContent>
        </Dialog>
    );
}
