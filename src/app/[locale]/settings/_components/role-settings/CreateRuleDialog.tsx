import { Box, Dialog } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { createRbacRule } from 'lib/services/rbac-service/RbacActions';
import { mapFormModelToBaSyxRbacRule } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { RuleForm, RuleFormModel } from 'app/[locale]/settings/_components/role-settings/RuleForm';
import { useState } from 'react';
import { CreateHint } from 'app/[locale]/settings/_components/role-settings/HintDialogContent';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly reloadRules: () => Promise<void>;
    readonly open: boolean;
    readonly availableRoles: string[];
};

export const defaultRbacRule: BaSyxRbacRule = {
    action: 'READ',
    targetInformation: { '@type': 'aas', aasIds: ['*'] },
    role: '',
    idShort: '',
};

export const CreateRuleDialog = ({ onClose, reloadRules, open, availableRoles }: RoleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();
    
    const [showHint, setShowHint] = useState(false);

    async function afterSubmit(newData: RuleFormModel) {
        const isNewRole = !availableRoles.includes(newData.role);
        if (isNewRole) {
            setShowHint(true);
        } else {
            onClose();
        }
        await reloadRules();
    }

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, defaultRbacRule);
        const response = await createRbacRule(mappedDto);

        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('createRule.saveSuccess'),
                severity: 'success',
            });
            await afterSubmit(data);
            return;
        }

        if (response.errorCode === 'CONFLICT') {
            notificationSpawner.spawn({
                message: t('errors.uniqueIdShort'),
                severity: 'error',
            });
            return;
        }

        showError(response);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth={true}
            onTransitionExited={() => {
                // This function is called when the dialog close transition ends
                setShowHint(false);
            }}
        >
            <Box sx={{ mx: '2rem', mt: '1.5rem', mb: '1rem' }} data-testid="role-create-dialog">
                <DialogCloseButton handleClose={onClose} dataTestId="rule-create-close-button" />
                {showHint ? (
                    <CreateHint onClose={onClose} />
                ) : (
                    <RuleForm
                        title={t('createRule.title')}
                        rule={defaultRbacRule}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        availableRoles={availableRoles}
                    />
                )}
            </Box>
        </Dialog>
    );
}
