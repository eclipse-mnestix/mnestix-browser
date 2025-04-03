import { Box, Button, DialogActions, DialogContent, FormControl, MenuItem, Select, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import { BaSyxRbacRule, rbacRuleActions, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { TargetInformationForm } from 'app/[locale]/settings/_components/role-settings/target-information/TargetInformationForm';
import { Controller, useForm } from 'react-hook-form';
import { mapBaSyxRbacRuleToFormModel } from 'app/[locale]/settings/_components/role-settings/FormMappingHelper';

type RoleDialogProps = {
    readonly onSubmit: (data: RoleFormModel) => void;
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

export type RoleFormModel = {
    type: keyof typeof rbacRuleTargets;
    action: (typeof rbacRuleActions)[number];
    targetInformation: TargetInformationFormModel;
};

export const RoleDialogForm = (props: RoleDialogProps) => {
    const t = useTranslations('pages.settings.roles');

    const { control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: mapBaSyxRbacRuleToFormModel(props.rule as BaSyxRbacRule),
    });

    useEffect(() => {
        reset(mapBaSyxRbacRuleToFormModel(props.rule as BaSyxRbacRule));
    }, [props.rule]);

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <DialogContent style={{ padding: '40px' }}>
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
                        </Box>
                        <TargetInformationForm control={control} setValue={setValue} getValues={getValues} />
                    </Box>
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
