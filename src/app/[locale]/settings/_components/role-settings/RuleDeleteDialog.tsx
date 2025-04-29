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
    onCancelDialog: () => void;
    onDelete: () => Promise<void>;
    rule: BaSyxRbacRule;
}

export function RuleDeleteDialog({ onCancelDialog, onDelete, rule }: RuleDeleteDialogProps) {
    const t = useTranslations('pages.settings.rules');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function deleteRule() {
        const response = await rbacActions.deleteRbacRule(rule.idShort);
        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('deleteRule.success'),
                severity: 'success',
            });
            await onDelete();
            return;
        }
        showError(response.message);
    }

    return (
        <>
            <DialogContent>
                <Typography variant="h2" color="primary" sx={{ mb: '1rem' }} data-testid="role-delete-question">
                    {t('deleteRule.question')}
                </Typography>
                <Typography mb={'1rem'} data-testid="role-delete-info">
                    {t('deleteRule.ruleInfo', {
                        role: rule.role,
                        action: rule.action,
                    })}
                </Typography>
                <TargetInformationView targetInformation={rule.targetInformation} />
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<CloseIcon />}
                    variant={'outlined'}
                    onClick={onCancelDialog}
                    autoFocus
                    data-testid="role-delete-cancel-button"
                >
                    {t('buttons.cancel')}
                </Button>
                <Button
                    startIcon={<Delete />}
                    variant={'contained'}
                    onClick={deleteRule}
                    color="error"
                    data-testid="role-delete-confirm-button"
                >
                    {t('buttons.delete')}
                </Button>
            </DialogActions>
        </>
    );
}
