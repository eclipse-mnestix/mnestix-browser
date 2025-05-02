import {
    Autocomplete,
    Box,
    Button,
    DialogActions,
    DialogContent,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule, rbacRuleActions, rbacRuleTargets } from 'lib/services/rbac-service/types/RbacServiceData';
import { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationForm';
import { Controller, useForm } from 'react-hook-form';
import { mapBaSyxRbacRuleToFormModel } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';

type RuleDialogProps = {
    readonly onSubmit: (data: RuleFormModel) => Promise<void>;
    readonly onCancel: () => void;
    readonly rule: BaSyxRbacRule;
    readonly title: string;
    readonly availableRoles: string[];
};

export type ArrayOfIds = [{ id: string }];

export type TargetInformationFormModel = {
    'aas-environment': { aasIds: ArrayOfIds; submodelIds: ArrayOfIds } | undefined;
    aas: { aasIds: ArrayOfIds } | undefined;
    submodel: { submodelIds: ArrayOfIds; submodelElementIdShortPaths: ArrayOfIds } | undefined;
    'concept-description': { conceptDescriptionIds: ArrayOfIds } | undefined;
    'aas-registry': { aasIds: ArrayOfIds } | undefined;
    'submodel-registry': { submodelIds: ArrayOfIds } | undefined;
    'aas-discovery-service': { aasIds: ArrayOfIds; assetIds: ArrayOfIds } | undefined;
};

export type RuleFormModel = {
    role: string;
    type: keyof typeof rbacRuleTargets;
    action: (typeof rbacRuleActions)[number];
    targetInformation: TargetInformationFormModel;
};

export const RuleForm = ({ onCancel, onSubmit, rule, title, availableRoles }: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');

    const { control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule),
    });

    useEffect(() => {
        reset(mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule));
    }, [rule]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
                <Typography variant="h2" color="primary" mb="1em">
                    {title}
                </Typography>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h5">{t('tableHeader.name')}</Typography>
                    <Controller
                        rules={{
                            required: t('roleRequired'),
                        }}
                        name="role"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <FormControl fullWidth>
                                <Autocomplete
                                    freeSolo
                                    options={availableRoles}
                                    value={field.value || ''}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                    onInputChange={(_, newValue, reason) => {
                                        if (reason === 'input' || reason === 'clear') {
                                            field.onChange(newValue);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            data-testid="rule-settings-name-input"
                                            {...params}
                                            variant="outlined"
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            </FormControl>
                        )}
                    />
                </Box>
                <Box display="flex" flexDirection="column" mt={2}>
                    <Typography variant="h5">{t('tableHeader.action')}</Typography>
                    <Controller
                        name="action"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <Select
                                    data-testid="rule-settings-action-select"
                                    labelId="role-type-select-label"
                                    variant="outlined"
                                    {...field}
                                >
                                    {rbacRuleActions.map((action) => (
                                        <MenuItem value={action} data-testid={`rule-settings-action-${action}`}>
                                            {action}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <TargetInformationForm control={control} setValue={setValue} getValues={getValues} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<CloseIcon />} variant="outlined" onClick={onCancel}>
                    {t('buttons.cancel')}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={handleSubmit(onSubmit)}
                    data-testid="role-settings-save-button"
                >
                    {t('buttons.save')}
                </Button>
            </DialogActions>
        </form>
    );
};
