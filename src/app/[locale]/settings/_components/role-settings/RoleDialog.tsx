import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import { mapFormModelToBaSyxRbacRule } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { RoleDialogForm, RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialogForm';

type RoleDialogProps = {
    readonly onClose: (reload: boolean) => void;
    readonly open: boolean;
    readonly rule: BaSyxRbacRule;
};

export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('pages.settings.roles');
    const [isEditMode, setIsEditMode] = useState(false);
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    async function onSubmit(data: RoleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data, props.rule);
        const response = await deleteAndCreateRbacRule(props.rule.idShort, mappedDto);
        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: t('saveSuccess'),
                severity: 'success',
            });
            onCloseDialog(true);
        } else {
            showError(response.message);
        }
    }

    const onCloseDialog = (reload: boolean) => {
        setIsEditMode(false);
        props.onClose(reload);
    };

    return (
        <Dialog open={props.open} onClose={() => onCloseDialog(false)} maxWidth="md" fullWidth={true}>
            <DialogCloseButton handleClose={() => onCloseDialog(false)} />
            {isEditMode ? (
                <RoleDialogForm rule={props.rule} onSubmit={onSubmit} onCancel={() => setIsEditMode(false)} />
            ) : (
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
