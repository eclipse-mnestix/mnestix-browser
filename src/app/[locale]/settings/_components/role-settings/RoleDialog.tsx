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
import {
    BaSyxRbacRule,
    rbacRuleActions,
    rbacRuleTargets,
    TargetInformation,
} from 'lib/services/rbac-service/RbacRulesService';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { ArrowBack } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/TargetInformationForm';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { TargetInformationView } from 'app/[locale]/settings/_components/role-settings/TargetInformationView';

type RoleDialogProps = {
    readonly onClose: () => void;
    readonly open: boolean;
    readonly role: BaSyxRbacRule;
};

type TargetInformationFormModel = {
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

    const mapDtoToTargetInformationFormModel = (targetInformation: TargetInformation): TargetInformationFormModel => {
        const targetInformationFormModel: TargetInformationFormModel = {
            aasEnvironment: undefined,
            aas: undefined,
            submodel: undefined,
            conceptDescription: undefined,
            aasRegistry: undefined,
            submodelRegistry: undefined,
            aasDiscoveryService: undefined,
        };

        switch (targetInformation['@type']) {
            case 'aas-environment':
                targetInformationFormModel.aasEnvironment = {
                    aasIds: targetInformation.aasIds,
                    submodelIds: targetInformation.submodelIds,
                };
                break;
            case 'aas':
                targetInformationFormModel.aas = { aasIds: targetInformation.aasIds };
                break;
            case 'submodel':
                targetInformationFormModel.submodel = {
                    submodelIds: targetInformation.submodelIds,
                    submodelElementIdShortPaths: targetInformation.submodelElementIdShortPaths,
                };
                break;
            case 'concept-description':
                targetInformationFormModel.conceptDescription = {
                    conceptDescriptionIds: targetInformation.conceptDescriptionIds,
                };
                break;
            case 'aas-registry':
                targetInformationFormModel.aasRegistry = { aasIds: targetInformation.aasIds };
                break;
            case 'submodel-registry':
                targetInformationFormModel.submodelRegistry = { submodelIds: targetInformation.submodelIds };
                break;
            case 'aas-discovery-service':
                targetInformationFormModel.aasDiscoveryService = {
                    aasIds: targetInformation.aasIds,
                    assetIds: targetInformation.assetIds,
                };
                break;
            default:
                throw new Error(`Unknown target type: ${targetInformation['@type']}`);
        }
        return targetInformationFormModel;
    };

    const mapTargetInformationFormModelToDto = (
        formModel: TargetInformationFormModel,
        type: keyof typeof rbacRuleTargets,
    ): TargetInformation => {
        switch (type) {
            case 'aas-environment':
                return { '@type': 'aas-environment', ...formModel.aasEnvironment };
            case 'aas':
                return { '@type': 'aas', ...formModel.aas };
            case 'submodel':
                return { '@type': 'submodel', ...formModel.submodel };
            case 'concept-description':
                return { '@type': 'concept-description', ...formModel.conceptDescription };
            case 'aas-registry':
                return { '@type': 'aas-registry', ...formModel.aasRegistry };
            case 'submodel-registry':
                return { '@type': 'submodel-registry', ...formModel.submodelRegistry };
            case 'aas-discovery-service':
                return { '@type': 'aas-discovery-service', ...formModel.aasDiscoveryService };
            default:
                throw new Error(`Unknown target type: ${type}`);
        }
    };

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
    const onSubmit: SubmitHandler<RoleFormModel> = (data) => {
        mapFormModelToBaSyxRbacRule(data);
        console.log('send: ' + data);
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
                                        targetInformation={props.role.targetInformation}
                                        isEditMode={isEditMode}
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
