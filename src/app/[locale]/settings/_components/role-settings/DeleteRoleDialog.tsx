import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { KeycloakHint } from 'app/[locale]/settings/_components/role-settings/HintDialogContent';
import CancelIcon from '@mui/icons-material/Cancel';
import { deleteRbacRule } from 'lib/services/rbac-service/RbacActions';

type RuleDialogProps = {
    readonly onClose: () => void;
    readonly reloadRules: () => Promise<void>;
    readonly open: boolean;
    readonly roleName: string;
    readonly rules: BaSyxRbacRule[];
};

type DialogMode = 'delete-role' | 'delete-hint';

export const DeleteRoleDialog = ({ onClose, reloadRules, open, roleName, rules }: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [dialogMode, setDialogMode] = useState<DialogMode>('delete-role');
    const [isDeleting, setIsDeleting] = useState(false);
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function deleteAllRules() {
        try {
            setIsDeleting(true);
            const result = await Promise.all(rules.map(async (rule) => deleteRbacRule(rule.idShort)));
            const failedDeletes = result.filter((response) => !response.isSuccess);
            if (failedDeletes.length > 0) {
                notificationSpawner.spawn({
                    message: t('deleteRole.partiallySuccess', { count: failedDeletes.length, total: rules.length }),
                    severity: 'warning',
                });
                return false;
            }
            notificationSpawner.spawn({
                message: t('deleteRole.success'),
                severity: 'success',
            });
        } catch (error) {
            showError(error);
            return false;
        } finally {
            setIsDeleting(false);
        }
        return true;
    }

    async function onDelete() {
        const deleteSuccess = await deleteAllRules();
        if (deleteSuccess) {
            onClose();
            await new Promise( resolve => setTimeout(resolve, 1000) ); // Wait for the notification to be shown
            setDialogMode('delete-hint');
        } else {
            onClose();
        }
        await reloadRules();
    }

    function RoleDeleteContent() {
        return (
            <>
                <DialogContent data-testid="role-settings-delete-role-dialog">
                    <Box display="flex" flexDirection="column">
                        <Typography variant="h2" color="primary" sx={{ mb: '1rem' }}>
                            {t('deleteRole.header')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: '0.5rem' }}>
                            {t('deleteRole.description', { roleName: roleName, count: rules.length })}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{ mr: 2 }}
                        startIcon={<CancelIcon />}
                        variant="outlined"
                        data-testid="role-settings-delete-role-cancel-button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        color="error"
                        data-testid="role-settings-delete-role-delete-button"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        {t('buttons.delete')}
                    </Button>
                </DialogActions>
            </>
        );
    }

    function DialogViewContent() {
        switch (dialogMode) {
            case 'delete-role':
                return <RoleDeleteContent />;
            case 'delete-hint':
                return <KeycloakHint hint="delete" onClose={onClose} />;
        }
    }

    useEffect(() => {
        // Reset dialog mode when the dialog opens
        if (open) setDialogMode('delete-role');
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth={true}
            onTransitionExited={() => {
                // This function is called when the dialog close transition ends
                if (!open) setDialogMode('delete-role');
            }}
        >
            <Box sx={{ mx: '2rem', mt: '1.5rem', mb: '1rem' }} data-testid="role-dialog">
                <DialogCloseButton handleClose={onClose} dataTestId="dialog-close-button" />
                <DialogViewContent />
            </Box>
        </Dialog>
    );
};
