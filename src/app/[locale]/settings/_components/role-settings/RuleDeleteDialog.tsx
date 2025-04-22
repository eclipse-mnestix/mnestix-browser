import { DialogActions, DialogContent, DialogContentText, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { ArrowRightAlt } from '@mui/icons-material';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { useEnv } from 'app/EnvProvider';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useShowError } from 'lib/hooks/UseShowError';

interface RuleDeleteDialogProps {
    onCloseDialog: (reload: boolean) => void;
    isLastRuleForRole: boolean;
    rule: BaSyxRbacRule;
}

export function RuleDeleteDialog({ isLastRuleForRole, onCloseDialog, rule }: RuleDeleteDialogProps) {
    const envs = useEnv();
    const t = useTranslations('pages.settings.rules');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    const keycloakRolesUrl = () => {
        const url = new URL(`/admin/master/console/#/${envs.KEYCLOAK_REALM}/roles`, envs.KEYCLOAK_ISSUER);
        return url.toString();
    };
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
                <DialogContentText>
                    {t('delete.question')}
                    {isLastRuleForRole && (
                        <>
                            <br />
                            {t('delete.lastForRole')}
                            <br />
                            <Button
                                startIcon={<ArrowRightAlt />}
                                href={keycloakRolesUrl()}
                                variant="contained"
                                target="_blank"
                                color="primary"
                            >
                                Keycloak
                            </Button>
                        </>
                    )}
                </DialogContentText>
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
