import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack, Delete } from '@mui/icons-material';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import { mapFormModelToBaSyxRbacRule } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { RuleForm, RuleFormModel } from 'app/[locale]/settings/_components/role-settings/RuleForm';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { CreateHint, DeleteHint } from 'app/[locale]/settings/_components/role-settings/HintDialogContent';
import { RuleDeleteDialog } from 'app/[locale]/settings/_components/role-settings/RuleDeleteDialog';

export type DialogRbacRule = BaSyxRbacRule & {
    // If this rule is the only rule for the role
    isOnlyRule: boolean;
};

type RuleDialogProps = {
    readonly onClose: () => void;
    readonly reloadRules: () => Promise<void>;
    readonly open: boolean;
    readonly rule: DialogRbacRule;
    readonly availableRoles: string[];
};

type DialogMode = 'edit' | 'view' | 'delete' | 'create-hint' | 'delete-hint';

export const RuleDialog = ({ onClose, reloadRules, open, rule, availableRoles }: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [dialogMode, setDialogMode] = useState<DialogMode>('view');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, rule);
        const response = await deleteAndCreateRbacRule(rule.idShort, mappedDto);
        if (!response.isSuccess) {
            if (response.errorCode === 'CONFLICT') {
                return notificationSpawner.spawn({
                    message: t('errors.uniqueIdShort'),
                    severity: 'error',
                });
            }
            showError(response.message);
            return;
        }

        notificationSpawner.spawn({
            message: t('editRule.saveSuccess'),
            severity: 'success',
        });

        const isNewRole = !availableRoles.includes(data.role);
        const isDeletedRole = rule.isOnlyRule && rule.role !== data.role;
        if (isNewRole) {
            setDialogMode('create-hint');
        } else if (isDeletedRole) {
            setDialogMode('delete-hint');
        } else {
            onClose();
        }

        await reloadRules();
    }

    function ViewContent() {
        return (
            <>
                <DialogContent style={{ padding: '40px' }} data-testid="role-settings-dialog">
                    <Box display="flex" flexDirection="column">
                        <Typography color="text.secondary" variant="body2">
                            {t('tableHeader.name')}
                        </Typography>
                        <Typography variant="h2" mb="1em">
                            {rule?.role}
                        </Typography>
                        <Box display="flex" flexDirection="column" gap="1em">
                            <Box>
                                <Typography variant="h5">{t('tableHeader.action')}</Typography>
                                <Typography>{rule?.action}</Typography>
                            </Box>
                            <TargetInformationView targetInformation={rule.targetInformation} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '1em' }}>
                    <Button
                        sx={{ mr: 2 }}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        data-testid="role-settings-back-button"
                        onClick={onClose}
                    >
                        {t('buttons.back')}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        color="error"
                        data-testid="role-settings-delete-button"
                        onClick={() => setDialogMode('delete')}
                    >
                        {t('buttons.delete')}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        data-testid="role-settings-edit-button"
                        onClick={() => setDialogMode('edit')}
                    >
                        {t('buttons.edit')}
                    </Button>
                </DialogActions>
            </>
        );
    }

    function DialogViewContent() {
        switch (dialogMode) {
            case 'edit':
                return <RuleForm rule={rule} onSubmit={onSubmit} onCancel={() => setDialogMode('view')} />;
            case 'delete':
                return (
                    <RuleDeleteDialog
                        rule={rule}
                        onCloseDialog={onClose}
                        onCancelDialog={() => setDialogMode('view')}
                    />
                );
            case 'create-hint':
                return <CreateHint onClose={onClose} />;
            case 'delete-hint':
                return <DeleteHint onClose={onClose} />;
            default:
                return <ViewContent />;
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth={true}
            onTransitionExited={() => {
                // This function is called when the dialog close transition ends
                setDialogMode('view');
            }}
        >
            <Box sx={{ mx: '2rem', mt: '1.5rem', mb: '1rem' }}>
                <DialogCloseButton handleClose={onClose} />
                <DialogViewContent />
            </Box>
        </Dialog>
    );
};
