import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useShowError } from 'lib/hooks/UseShowError';
import CloseIcon from '@mui/icons-material/Close';
import { Delete } from '@mui/icons-material';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';

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
                    {t('delete.question')}
                </Typography>
                <Typography mb={'1rem'}>{t('delete.ruleInfo', { role: rule.role, action: rule.action })}</Typography>
                <TargetInformationView targetInformation={rule.targetInformation} />
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
