import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useShowError } from 'lib/hooks/UseShowError';
import CloseIcon from '@mui/icons-material/Close';
import { Delete } from '@mui/icons-material';

interface RuleDeleteDialogProps {
    onCloseDialog: (reload: boolean) => void;
    onCancelDialog: () => void;
    rule: BaSyxRbacRule;
}

export function RuleDeleteDialog({ onCloseDialog, onCancelDialog, rule }: RuleDeleteDialogProps) {
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
            <DialogContent>
                <Typography variant="h2" color="primary" sx={{ mb: '1rem' }}>
                    {t('delete.title')}
                </Typography>
                <Typography>{t('delete.question')}</Typography>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<CloseIcon />} variant={'outlined'} onClick={onCancelDialog} autoFocus>
                    {t('buttons.cancel')}
                </Button>
                <Button startIcon={<Delete />} variant={'contained'} onClick={deleteRule} color="error">
                    {t('buttons.delete')}
                </Button>
            </DialogActions>
        </>
    );
}
