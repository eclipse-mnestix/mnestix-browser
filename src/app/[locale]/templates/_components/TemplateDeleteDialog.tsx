import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps } from '@mui/material';
import { useTranslations } from 'next-intl';

interface TemplateDeleteDialogProps extends DialogProps {
    itemName: string | null;
    onDelete: () => void;
}

export function TemplateDeleteDialog(props: TemplateDeleteDialogProps) {
    const t = useTranslations();
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogContent>
                <DialogContentText>
                    {t('pages.templates.deleteTemplateQuestion', { name: props.itemName ?? '' })}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => props.onClose && props.onClose(e, 'escapeKeyDown')} autoFocus>
                    {t('common.actions.cancel')}
                </Button>
                <Button onClick={() => props.onDelete()} color="error">
                    {t('common.actions.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
