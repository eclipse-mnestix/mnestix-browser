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
import { KeycloakHint } from 'app/[locale]/settings/_components/role-settings/HintDialogContent';
import { DeleteRuleDialogContent } from 'app/[locale]/settings/_components/role-settings/DeleteRuleDialogContent';
import { CopyButton } from 'components/basics/CopyButton';
import { RoleOptions } from './RuleSettings';

export type DialogRbacRule = BaSyxRbacRule & {
    // If this rule is the only rule for the role
    isOnlyRuleForRole: boolean;
};

type RuleDialogProps = {
    readonly onClose: () => void;
    readonly reloadRules: () => Promise<void>;
    readonly open: boolean;
    readonly rule: DialogRbacRule;
    readonly availableRoles: RoleOptions[];
};

type DialogMode = 'edit' | 'view' | 'delete' | 'create-hint' | 'delete-hint';

type ViewContentProps = {
    readonly rule: DialogRbacRule;
    readonly t: (key: string) => string;
    readonly onClose: () => void;
    readonly setDialogMode: (mode: DialogMode) => void;
};

function ViewContent({ rule, t, onClose, setDialogMode }: ViewContentProps) {
    return (
        <>
            <DialogContent data-testid="role-settings-dialog">
                <Box display="flex" flexDirection="column">
                    <Typography color="text.secondary" variant="body2">
                        {t('tableHeader.name')}
                    </Typography>
                    <Box display="flex" flexDirection="row" mb="1em">
                        <Typography
                            variant="h2"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="inherit"
                            sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflowWrap: 'break-word',
                            }}
                        >
                            {rule.role}
                        </Typography>
                        <CopyButton value={rule.role} size="medium" />
                    </Box>
                    <Box display="flex" flexDirection="column" gap="1em">
                        <Box>
                            <Typography variant="h5">{t('tableHeader.action')}</Typography>
                            <Typography>{rule?.action}</Typography>
                        </Box>
                        <TargetInformationView targetInformation={rule.targetInformation} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
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

type DialogViewContentProps = {
    readonly dialogMode: DialogMode;
    readonly t: (key: string) => string;
    readonly rule: DialogRbacRule;
    readonly onSubmit: (data: RuleFormModel) => Promise<void>;
    readonly setDialogMode: (mode: DialogMode) => void;
    readonly availableRoles: RoleOptions[];
    readonly onDelete: () => Promise<void>;
    readonly onClose: () => void;
};

function DialogViewContent({
    dialogMode,
    t,
    rule,
    onSubmit,
    setDialogMode,
    availableRoles,
    onDelete,
    onClose,
}: DialogViewContentProps) {
    switch (dialogMode) {
        case 'edit':
            return (
                <RuleForm
                    title={t('editRule.title')}
                    rule={rule}
                    onSubmit={onSubmit}
                    onCancel={() => setDialogMode('view')}
                    availableRoles={availableRoles}
                />
            );
        case 'delete':
            return (
                <DeleteRuleDialogContent rule={rule} onCancelDialog={() => setDialogMode('view')} onDelete={onDelete} />
            );
        case 'create-hint':
            return <KeycloakHint hint="create" onClose={onClose} />;
        case 'delete-hint':
            return <KeycloakHint hint="delete" onClose={onClose} />;
        default:
            return <ViewContent rule={rule} t={t} onClose={onClose} setDialogMode={setDialogMode} />;
    }
}

export const RuleDialog = ({ onClose, reloadRules, open, rule, availableRoles }: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [dialogMode, setDialogMode] = useState<DialogMode>('view');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function updateDialogModeForNewRule(newData: RuleFormModel) {
        const isRuleForNewRole = !availableRoles.some((option) => option.name === newData.role.name);
        const wasLastRuleForOldRole = rule.isOnlyRuleForRole && rule.role !== newData.role.name;

        if (isRuleForNewRole) {
            setDialogMode('create-hint');
        } else if (wasLastRuleForOldRole) {
            setDialogMode('delete-hint');
        } else {
            // close the dialog, if no hint is needed
            onClose();
        }

        // reload rules to update the list. This will happen in the background, if a hint is shown.
        await reloadRules();
    }

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, rule);
        const response = await deleteAndCreateRbacRule(rule.idShort, mappedDto);

        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('editRule.saveSuccess'),
                severity: 'success',
            });
            await updateDialogModeForNewRule(data);
            return;
        }

        if (response.errorCode === 'CONFLICT') {
            notificationSpawner.spawn({
                message: t('errors.uniqueIdShort'),
                severity: 'error',
            });
            return;
        }
        showError(response.message);
    }

    async function onDelete() {
        // switch view to hint if needed else close
        if (rule.isOnlyRuleForRole) {
            setDialogMode('delete-hint');
        } else {
            onClose();
        }
        await reloadRules();
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
            <Box sx={{ mx: '2rem', mt: '1.5rem', mb: '1rem' }} data-testid="role-dialog">
                <DialogCloseButton handleClose={onClose} dataTestId="dialog-close-button" />
                <DialogViewContent
                    dialogMode={dialogMode}
                    t={t}
                    rule={rule}
                    onSubmit={onSubmit}
                    setDialogMode={setDialogMode}
                    availableRoles={availableRoles}
                    onDelete={onDelete}
                    onClose={onClose}
                />
            </Box>
        </Dialog>
    );
};
