import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material';
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

type RuleDialogProps = {
    readonly onClose: (reload: boolean) => Promise<void>;
    readonly open: boolean;
    readonly rule: BaSyxRbacRule;
};

export const RuleDialog = (props: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
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

    async function deleteRule() {
        const response = await rbacActions.deleteRbacRule(props.rule.idShort);
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

    const onCloseDialog = async (reload: boolean) => {
        await props.onClose(reload);
        setIsEditMode(false);
        setIsDeleteMode(false);
    };

    return (
        <Dialog open={props.open} onClose={() => onCloseDialog(false)} maxWidth="md" fullWidth={true}>
            <DialogCloseButton handleClose={() => onCloseDialog(false)} />
            {(() => {
                switch (true) {
                    case isEditMode:
                        return (
                            <>
                                <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                                    {t('editTitle')}
                                </Typography>
                                <RuleForm rule={props.rule} onSubmit={onSubmit} onCancel={() => setIsEditMode(false)} />
                            </>
                        );
                    case isDeleteMode:
                        return (
                            <>
                                <Typography variant="h2" color="primary" sx={{ mt: 4, ml: '40px' }}>
                                    {t('delete.title')}
                                </Typography>
                                <DialogContent>
                                    <DialogContentText>{t('delete.question')}</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setIsDeleteMode(false)} autoFocus>
                                        {t('buttons.cancel')}
                                    </Button>
                                    <Button onClick={deleteRule} color="error">
                                        {t('buttons.delete')}
                                    </Button>
                                </DialogActions>
                            </>
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
                                        onClick={() => setIsDeleteMode(true)}
                                    >
                                        {t('buttons.delete')}
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
                        );
                }
            })()}
        </Dialog>
    );
};
