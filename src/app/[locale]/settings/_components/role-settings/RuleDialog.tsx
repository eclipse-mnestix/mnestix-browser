import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/types/RbacServiceData';
import { useState } from 'react';
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
};

export const RuleDialog = (props: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [mode, setMode] = useState<'edit' | 'view' | 'delete'>('view');
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

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

    return (
        <Dialog open={props.open} onClose={() => onCloseDialog(false)} maxWidth="md" fullWidth={true}>
            <Box sx={{ mx: '2rem', mt: '1.5rem', mb: '1rem' }}>
                <DialogCloseButton handleClose={() => onCloseDialog(false)} />
                {(() => {
                    switch (mode) {
                        case 'edit':
                            return <RuleForm rule={props.rule} onSubmit={onSubmit} onCancel={() => setMode('view')} />;
                        case 'delete':
                            return (
                                <RuleDeleteDialog
                                    rule={props.rule}
                                    onCloseDialog={onCloseDialog}
                                    onCancelDialog={() => setMode('view')}
                                />
                            );
                        default:
                            return (
                                <>
                                    <DialogContent>
                                        <Box display="flex" flexDirection="column" data-testid="role-settings-dialog">
                                            <Box mb="1em">
                                                <Typography color="text.secondary" variant="body2">
                                                    {t('tableHeader.name')}
                                                </Typography>
                                                <Typography variant="h2" color="primary">
                                                    {props.rule?.role}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column" gap="1em">
                                                <Box>
                                                    <Typography variant="h5">{t('tableHeader.action')}</Typography>
                                                    <Typography>{props.rule?.action}</Typography>
                                                </Box>
                                                <TargetInformationView
                                                    targetInformation={props.rule.targetInformation}
                                                />
                                            </Box>
                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            sx={{ mr: 2 }}
                                            startIcon={<ArrowBack />}
                                            variant="outlined"
                                            data-testid="role-settings-back-button"
                                            onClick={() => onCloseDialog(false)}
                                        >
                                            {t('buttons.back')}
                                        </Button>
                                        <Button
                                            variant="outlined"
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
            </Box>
        </Dialog>
    );
};
