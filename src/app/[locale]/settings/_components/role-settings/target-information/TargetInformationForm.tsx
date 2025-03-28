import { JSX } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';
import { WildcardOrStringArrayInput } from 'app/[locale]/settings/_components/role-settings/target-information/WildcardOrStringArrayInput';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form';

type TargetInformationProps = {
    readonly control: Control<RoleFormModel, never>;
    readonly setValue: UseFormSetValue<RoleFormModel>;
    readonly getValues: UseFormGetValues<RoleFormModel>;
};
export const TargetInformationForm = (props: TargetInformationProps) => {
    const t = useTranslations('settings');

    const ruleTypes = Object.keys(rbacRuleTargets);
    const currentType = props.getValues('type') as keyof typeof rbacRuleTargets;
    const currentTypeInformation = props.getValues(`targetInformation.${currentType}` as const);

    const permissions: JSX.Element[] = [];
    const keys = currentTypeInformation ? Object.keys(currentTypeInformation) : [];

    keys.forEach((key) => {
        if (key !== '@type') {
            permissions.push(
                <WildcardOrStringArrayInput
                    type={currentType}
                    key={key}
                    control={props.control}
                    rule={key}
                    setValue={props.setValue}
                    getValues={props.getValues}
                />,
            );
        }
    });
    return (
        <Box>
            <Typography variant="h5">{t('roles.tableHeader.type')}</Typography>
            <Controller
                name="type"
                control={props.control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <Select labelId="role-type-select-label" variant="outlined" {...field}>
                            {ruleTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />
            {permissions}
        </Box>
    );
};
