import { Dialog, Typography } from '@mui/material';
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

export function CreateRuleDialog({ onClose, reloadRules, open, availableRoles }: RoleDialogProps) {
    const t = useTranslations('pages.settings.rules');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    const [showHint, setShowHint] = useState(false);

    const defaultRbacRule: BaSyxRbacRule = {
        action: 'READ',
        targetInformation: { '@type': 'aas', aasIds: ['*'] },
        role: '',
        idShort: '',
    };

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, defaultRbacRule);
        const response = await createRbacRule(mappedDto);
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
            message: t('createRule.saveSuccess'),
            severity: 'success',
        });

        const isNewRole = !availableRoles.includes(data.role);
        if (isNewRole) {
            setShowHint(true);
        } else {
            onClose();
        }

        await reloadRules();
    }

    function CreateContent() {
        return (
            <>
                <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                    {t('createRule.title')}
                </Typography>
                <RuleForm rule={defaultRbacRule} onSubmit={onSubmit} onCancel={onClose} />
            </>
        );
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
            <DialogCloseButton handleClose={onClose} dataTestId="rule-create-close-button" />
            {showHint ? <CreateHint onClose={onClose} /> : <CreateContent />}
        </Dialog>
    );
}
