import { Button, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useShowError } from 'lib/hooks/UseShowError';

interface RuleDeleteDialogProps {
    onCloseDialog: (reload: boolean) => void;
    rule: BaSyxRbacRule;
}

export function RuleDeleteDialog({ onCloseDialog, rule }: RuleDeleteDialogProps) {
    const t = useTranslations('pages.settings.rules');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function deleteRule() {
        const response = await rbacActions.deleteRbacRule(rule.idShort);
        if (response.isSuccess) {
            onCloseDialog(true);
            notificationSpawner.spawn({
                message: t('delete.success'),
                severity: 'success',
            });
            return;
        }
        showError(response.message);
    }

    return (
        <>
            <DialogCloseButton handleClose={() => onCloseDialog(false)} />
            <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                {t('delete.title')}
            </Typography>
            <DialogContent style={{ padding: '40px' }}>
                <DialogContentText>{t('delete.question')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCloseDialog(false)} autoFocus>
                    {t('buttons.cancel')}
                </Button>
                <Button onClick={deleteRule} color="error">
                    {t('buttons.delete')}
                </Button>
            </DialogActions>
        </>
    );
}
