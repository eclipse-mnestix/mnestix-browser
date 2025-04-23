import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import { mapFormModelToBaSyxRbacRule } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { RuleForm, RuleFormModel } from 'app/[locale]/settings/_components/role-settings/RuleForm';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';

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

export const RuleDialog = ({ onClose, reloadRules, open, rule }: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [isEditMode, setIsEditMode] = useState(false);
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, rule);
        const response = await deleteAndCreateRbacRule(rule.idShort, mappedDto);
        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('editRule.saveSuccess'),
                severity: 'success',
            });
            onClose();
            await reloadRules();
            return;
        }
        if (response.errorCode === 'CONFLICT') {
            return notificationSpawner.spawn({
                message: t('errors.uniqueIdShort'),
                severity: 'error',
            });
        }
        showError(response.message);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth={true}
            onTransitionExited={() => {
                // This function is called when the dialog close transition ends
                setIsEditMode(false);
            }}
        >
            <DialogCloseButton handleClose={onClose} />
            {isEditMode ? (
                <>
                    <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                        {t('editRule.title')}
                    </Typography>
                    <RuleForm rule={rule} onSubmit={onSubmit} onCancel={() => setIsEditMode(false)} />
                </>
            ) : (
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
                            startIcon={<ArrowBack />}
                            variant="outlined"
                            data-testid="role-settings-back-button"
                            onClick={onClose}
                        >
                            {t('buttons.back')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            data-testid="role-settings-edit-button"
                            onClick={() => setIsEditMode(true)}
                        >
                            {t('buttons.edit')}
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};
