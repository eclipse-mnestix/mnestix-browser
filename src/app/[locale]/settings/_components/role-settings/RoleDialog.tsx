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
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationForm';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationView';
import { deleteAndCreateRbacRule } from 'lib/services/rbac-service/RbacActions';
import {
    mapDtoToTargetInformationFormModel,
    mapTargetInformationFormModelToDto,
} from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule;
};

export type TargetInformationFormModel = {
    aasEnvironment: { aasIds: string[]; submodelIds: string[] } | undefined;
    aas: { aasIds: string[] } | undefined;
    submodel: { submodelIds: string[]; submodelElementIdShortPaths: string[] } | undefined;
    conceptDescription: { conceptDescriptionIds: string[] } | undefined;
    aasRegistry: { aasIds: string[] } | undefined;
    submodelRegistry: { submodelIds: string[] } | undefined;
    aasDiscoveryService: { aasIds: string[]; assetIds: string[] } | undefined;
};

export type RoleFormModel = {
    type: keyof typeof rbacRuleTargets;
    action: (typeof rbacRuleActions)[number];
    targetInformation: TargetInformationFormModel;
};

export const RoleDialog = (props: RoleDialogProps) => {
    const t = useTranslations('settings');
    const [isEditMode, setIsEditMode] = useState(false);

    const mapFormModelToBaSyxRbacRule = (formModel: RoleFormModel): BaSyxRbacRule => {
        const targetInformation = mapTargetInformationFormModelToDto(formModel.targetInformation, formModel.type);
        return {
            idShort: props.role.idShort,
            role: props.role.role,
            action: [formModel.action],
            targetInformation: targetInformation,
        };
    };

    const mapBaSyxRbacRuleToFormModel = (role: BaSyxRbacRule): RoleFormModel => {
        return {
            type: role.targetInformation['@type'],
            action: role.action[0], // Right now BaSyx only supports one action per role
            targetInformation: mapDtoToTargetInformationFormModel(role.targetInformation),
        };
    };

    const { control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: mapBaSyxRbacRuleToFormModel(props.role as BaSyxRbacRule),
    });

    const onSubmit: SubmitHandler<RoleFormModel> = async (data) => {
        const mappedDto = mapFormModelToBaSyxRbacRule(data);
        console.log(mappedDto);
        const response = await deleteAndCreateRbacRule(props.role.idShort, mappedDto);
        if (response.isSuccess) {
            onCloseDialog();
        } else {
            console.log(response.errorCode);
        }
    };

    const onCloseDialog = () => {
        setIsEditMode(false);
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
                            <Button
                                autoFocus
                                startIcon={<CloseIcon />}
                                variant="outlined"
                                onClick={() => setIsEditMode(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="contained" startIcon={<CheckIcon />} type="submit">
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button autoFocus startIcon={<ArrowBack />} variant="outlined" onClick={props.onClose}>
                                Back
                            </Button>
                            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditMode(true)}>
                                Edit
                            </Button>
                        </>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};
