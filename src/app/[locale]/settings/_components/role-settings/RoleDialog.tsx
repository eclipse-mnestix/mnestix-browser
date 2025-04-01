import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule, rbacRuleActions, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationForm';
import { Controller, useForm } from 'react-hook-form';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import {
    mapDtoToTargetInformationFormModel,
    mapTargetInformationFormModelToDto,
} from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useShowError } from 'lib/hooks/UseShowError';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule;
};

export type ArrayOfIds = [{ id: string }];

export type TargetInformationFormModel = {
    aasEnvironment: { aasIds: ArrayOfIds; submodelIds: ArrayOfIds } | undefined;
    aas: { aasIds: ArrayOfIds } | undefined;
    submodel: { submodelIds: ArrayOfIds; submodelElementIdShortPaths: ArrayOfIds } | undefined;
    conceptDescription: { conceptDescriptionIds: ArrayOfIds } | undefined;
    aasRegistry: { aasIds: ArrayOfIds } | undefined;
    submodelRegistry: { submodelIds: ArrayOfIds } | undefined;
    aasDiscoveryService: { aasIds: ArrayOfIds; assetIds: ArrayOfIds } | undefined;
};

export type RoleFormModel = {
    type: keyof typeof rbacRuleTargets;
    action: (typeof rbacRuleActions)[number];
    targetInformation: TargetInformationFormModel;
};

export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');
    const [isEditMode, setIsEditMode] = useState(false);
    const { showError } = useShowError();
    const notificationSpawner = useNotificationSpawner();

    const mapBaSyxRbacRuleToFormModel = (role: BaSyxRbacRule): RoleFormModel => {
        return {
            type: role.targetInformation['@type'],
            action: role.action,
            targetInformation: mapDtoToTargetInformationFormModel(role.targetInformation),
        };
    };

    const { control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: mapBaSyxRbacRuleToFormModel(props.role as BaSyxRbacRule),
    });

    useEffect(() => {
        reset(mapBaSyxRbacRuleToFormModel(props.role as BaSyxRbacRule));
    }, [props.role, reset]);

    const mapFormModelToBaSyxRbacRule = (formModel: RoleFormModel): BaSyxRbacRule => {
        const targetInformation = mapTargetInformationFormModelToDto(formModel.targetInformation, formModel.type);
        return {
            idShort: props.role.idShort,
            role: props.role.role,
            action: formModel.action,
            targetInformation: targetInformation,
        };
    };

    async function onSubmit(data: RoleFormModel) {
        const mappedDto = mapFormModelToBaSyxRbacRule(data);
        console.log(mappedDto);
        const response = await deleteAndCreateRbacRule(props.role.idShort, mappedDto);
        if (response.isSuccess) {
            notificationSpawner.spawn({
                message: 'Saved successfully',
                severity: 'success',
            });
            onCloseDialog();
        } else {
            showError(response.message);
        }
    }

    const onCloseDialog = () => {
        setIsEditMode(false);
        reset();
        props.onClose();
    };

    return (
        <Dialog open={props.open} onClose={onCloseDialog} maxWidth="md" fullWidth={true}>
            <DialogCloseButton handleClose={onCloseDialog} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <IconButton
                    aria-label="close"
                    onClick={props.onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent style={{ padding: '40px' }}>
                    <Box display="flex" flexDirection="column">
                        <Typography color="text.secondary" variant="body2">
                            {t('roles.tableHeader.name')}
                        </Typography>
                        <Typography variant="h2" mb="1em">
                            {props.role?.role}
                        </Typography>
                        <Box display="flex" flexDirection="column" gap="1em">
                            <Box>
                                <Typography variant="h5">{t('roles.tableHeader.action')}</Typography>
                                {isEditMode ? (
                                    <Controller
                                        name="action"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <Select labelId="role-type-select-label" variant="outlined" {...field}>
                                                    {rbacRuleActions.map((action) => (
                                                        <MenuItem key={action} value={action}>
                                                            {action}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                ) : (
                                    <Typography>{props.role?.action}</Typography>
                                )}
                            </Box>

                            {props.role &&
                                (isEditMode ? (
                                    <TargetInformationForm
                                        control={control}
                                        setValue={setValue}
                                        getValues={getValues}
                                    />
                                ) : (
                                    <TargetInformationView targetInformation={props.role.targetInformation} />
                                ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '1em' }}>
                    {isEditMode ? (
                        <>
                            <Button startIcon={<CloseIcon />} variant="outlined" onClick={() => setIsEditMode(false)}>
                                {t('buttons.cancel')}
                            </Button>
                            <Button variant="contained" startIcon={<CheckIcon />} onClick={handleSubmit(onSubmit)}>
                                {t('buttons.save')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button startIcon={<ArrowBack />} variant="outlined" onClick={props.onClose}>
                                {t('buttons.back')}
                            </Button>
                            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
                                {t('buttons.edit')}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};
