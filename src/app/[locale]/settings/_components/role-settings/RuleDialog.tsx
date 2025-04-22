import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { useMemo, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack, Delete } from '@mui/icons-material';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import * as rbacActions from 'lib/services/rbac-service/RbacActions';
import { mapFormModelToBaSyxRbacRule } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { RuleForm, RuleFormModel } from 'app/[locale]/settings/_components/role-settings/RuleForm';
import { RuleDeleteDialog } from 'app/[locale]/settings/_components/role-settings/RuleDeleteDialog';

type RuleDialogProps = {
    readonly onClose: (reload: boolean) => Promise<void>;
    readonly open: boolean;
    readonly rule: BaSyxRbacRule;
    readonly rules: BaSyxRbacRule[];
};

export const RuleDialog = (props: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [mode, setMode] = useState<'edit' | 'view' | 'delete'>('view');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    const isLastRuleForRole = useMemo(() => {
        return props.rules.filter((rule) => rule.role === props.rule.role).length === 1;
    }, [props.rules, props.rule.role]);

    async function onSubmit(data: RuleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, props.rule);
        const response = await rbacActions.deleteAndCreateRbacRule(props.rule.idShort, mappedDto);
        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('saveSuccess'),
                severity: 'success',
            });
            onCloseDialog(true);
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

    const onCloseDialog = async (reload: boolean) => {
        await props.onClose(reload);
        setMode('view');
    };

    if (!props.open) {
        return <></>;
    }

    return (
        <Dialog open={true} onClose={() => onCloseDialog(false)} maxWidth="md" fullWidth={true}>
            <DialogCloseButton handleClose={() => onCloseDialog(false)} />
            {(() => {
                switch (mode) {
                    case 'edit':
                        return (
                            <>
                                <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                                    {t('editTitle')}
                                </Typography>
                                <RuleForm rule={props.rule} onSubmit={onSubmit} onCancel={() => setMode('view')} />
                            </>
                        );
                    case 'delete':
                        return (
                            <RuleDeleteDialog
                                isLastRuleForRole={isLastRuleForRole}
                                rule={props.rule}
                                onCloseDialog={onCloseDialog}
                            />
                        );
                    default:
                        return (
                            <>
                                <DialogContent style={{ padding: '40px' }} data-testid="role-settings-dialog">
                                    <Box display="flex" flexDirection="column">
                                        <Typography color="text.secondary" variant="body2">
                                            {t('tableHeader.name')}
                                        </Typography>
                                        <Typography variant="h2" mb="1em">
                                            {props.rule?.role}
                                        </Typography>
                                        <Box display="flex" flexDirection="column" gap="1em">
                                            <Box>
                                                <Typography variant="h5">{t('tableHeader.action')}</Typography>
                                                <Typography>{props.rule?.action}</Typography>
                                            </Box>
                                            <TargetInformationView targetInformation={props.rule.targetInformation} />
                                        </Box>
                                    </Box>
                                </DialogContent>
                                <DialogActions sx={{ padding: '1em' }}>
                                    <Button
                                        startIcon={<ArrowBack />}
                                        variant="outlined"
                                        data-testid="role-settings-back-button"
                                        onClick={() => onCloseDialog(false)}
                                    >
                                        {t('buttons.back')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Delete />}
                                        color="error"
                                        data-testid="role-settings-delete-button"
                                        onClick={() => setMode('delete')}
                                    >
                                        {t('buttons.delete')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        data-testid="role-settings-edit-button"
                                        onClick={() => setMode('edit')}
                                    >
                                        {t('buttons.edit')}
                                    </Button>
                                </DialogActions>
                            </>
                        );
                }
            })()}
        </Dialog>
    );
};
