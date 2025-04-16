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
import {
    BaSyxRbacRule,
    rbacRuleTargets,
    rbacRuleActions,
    RbacRolesFetchResult,
} from 'lib/services/rbac-service/types/RbacServiceData';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationForm';
import { Controller, useForm } from 'react-hook-form';
import { mapBaSyxRbacRuleToFormModel } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getRbacRules } from 'lib/services/rbac-service/RbacActions';

type RuleDialogProps = {
    readonly onSubmit: (data: RuleFormModel) => void;
    readonly onCancel: () => void;
    readonly rule: BaSyxRbacRule;
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

export const RuleForm = (props: RuleDialogProps) => {
    const t = useTranslations('pages.settings.rules');
    const [rbacRoles, setRbacRoles] = useState<RbacRolesFetchResult | undefined>(undefined);

    const { control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: mapBaSyxRbacRuleToFormModel(props.rule as BaSyxRbacRule),
    });

    useAsyncEffect(async () => {
        const response = await getRbacRules();
        if (response.isSuccess) {
            // sort by role name
            response.result.roles?.sort((a: { role: string }, b: { role: string }) => a.role.localeCompare(b.role));
            setRbacRoles(response.result);
        }
    }, []);

    useEffect(() => {
        reset(mapBaSyxRbacRuleToFormModel(props.rule as BaSyxRbacRule));
    }, [props.rule]);

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <DialogContent style={{ padding: '40px' }}>
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
                                    options={[...new Set(rbacRoles?.roles?.map((role) => role.role) ?? [])]}
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
                                        <MenuItem key={action} value={action}>
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
            <DialogActions sx={{ padding: '1em' }}>
                <Button startIcon={<CloseIcon />} variant="outlined" onClick={props.onCancel}>
                    {t('buttons.cancel')}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={handleSubmit(props.onSubmit)}
                    data-testid="role-settings-save-button"
                >
                    {t('buttons.save')}
                </Button>
            </DialogActions>
        </form>
    );
};
