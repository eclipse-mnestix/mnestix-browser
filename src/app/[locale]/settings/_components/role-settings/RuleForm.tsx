import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
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
import { RoleOptions } from './RuleSettings';

type RuleDialogProps = {
    readonly onSubmit: (data: RuleFormModel) => Promise<void>;
    readonly onCancel: () => void;
    readonly rule: BaSyxRbacRule;
    readonly title: string;
    readonly availableRoles: RoleOptions[];
    readonly selectedRole?: string | null;
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
    role: RoleOptions;
    type: keyof typeof rbacRuleTargets;
    action: (typeof rbacRuleActions)[number];
    targetInformation: TargetInformationFormModel;
};

export function RuleForm({ onCancel, onSubmit, rule, title, availableRoles, selectedRole }: RuleDialogProps) {
    const t = useTranslations('pages.settings.rules');
    const filter = createFilterOptions<RoleOptions>();
    const { control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            ...mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule),
            role: selectedRole ? { name: selectedRole } : mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule).role,
        },
    });

    useEffect(() => {
        reset({
            ...mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule),
            role: selectedRole ? { name: selectedRole } : mapBaSyxRbacRuleToFormModel(rule as BaSyxRbacRule).role,
        });
    }, [rule, selectedRole, reset]);
    
    function getInputValueTitle(inputValue: string): string {
        return `${t('buttons.add')} "${inputValue}"`;
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
                <Typography variant="h2" color="primary">
                    {title}
                </Typography>
                <Typography color="text.secondary" mb="1em">
                    {selectedRole ? t('createRule.subtitle2', { role: selectedRole }) : t('createRule.subtitle')}
                </Typography>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h5">{t('tableHeader.name')}</Typography>
                    <Controller
                        rules={{
                            required: t('roleRequired'),
                            maxLength: {
                                value: 255 /* A theoretical jetty server can handle 2048 url length. Keycloak allows max length of 255. */,
                                message: t('roleNameMaxLength', { maxLength: 255 }),
                            },
                            pattern: {
                                value: /^.*\S$/,
                                message: t('roleNameNoTrailSpace'),
                            },
                        }}
                        name="role"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <FormControl fullWidth>
                                <Autocomplete
                                    freeSolo
                                    options={availableRoles}
                                    value={field.value || null}
                                    onInputChange={(_, newValue, reason) => {
                                        if (reason === 'input' || reason === 'clear') {
                                            field.onChange(newValue);
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        const isExisting = options.some((option) => inputValue === option.name);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                name: inputValue,
                                                title: getInputValueTitle(inputValue),
                                            });
                                        }
                                        return filtered;
                                    }}
                                    getOptionLabel={(option) => {
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        return option.name;
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            data-testid="rule-settings-name-input"
                                            {...params}
                                            variant="outlined"
                                            error={!!error}
                                            placeholder={t('createRule.placeholderText')}
                                            helperText={error ? error.message : ''}
                                            disabled={!!selectedRole}
                                        />
                                    )}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <li key={key} {...optionProps}>
                                                {option.title ?? option.name}
                                            </li>
                                        );
                                    }}
                                    disabled={!!selectedRole}
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
}
