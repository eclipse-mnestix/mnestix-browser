import { useEffect, useState } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';
import { WildcardOrStringArrayInput } from 'app/[locale]/settings/_components/role-settings/target-information/WildcardOrStringArrayInput';
import { Control, Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { RoleFormModel } from '../RoleDialogForm';

type TargetInformationProps = {
    readonly control: Control<RoleFormModel>;
    readonly setValue: UseFormSetValue<RoleFormModel>;
    readonly getValues: UseFormGetValues<RoleFormModel>;
};
export const TargetInformationForm = (props: TargetInformationProps) => {
    const t = useTranslations('pages.settings');
    const [keys, setKeys] = useState<string[]>([]);
    const [currentType, setCurrentType] = useState<keyof typeof rbacRuleTargets>('aas');

    const ruleTypes = Object.keys(rbacRuleTargets);

    useEffect(() => {
        adaptTargetInformationForm(props.getValues('type' as keyof typeof props.getValues));
    }, []);

    const adaptTargetInformationForm = (value: keyof typeof rbacRuleTargets) => {
        const currentTypeInformation = props.getValues(`targetInformation.${value}` as keyof typeof props.getValues);

        setKeys(currentTypeInformation ? Object.keys(currentTypeInformation) : []);
        setCurrentType(value);
    };

    return (
        <Box>
            <Typography variant="h5">{t('roles.tableHeader.type')}</Typography>
            <Controller
                name="type"
                control={props.control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <Select
                            labelId="role-type-select-label"
                            variant="outlined"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                adaptTargetInformationForm(e.target.value as keyof typeof rbacRuleTargets);
                            }}
                        >
                            {ruleTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />
            {keys.map((key) => {
                if (key !== '@type') {
                    return (
                        <WildcardOrStringArrayInput
                            type={currentType}
                            key={key}
                            control={props.control}
                            rule={key}
                            setValue={props.setValue}
                            getValues={props.getValues}
                        />
                    );
                }
                return <></>;
            })}
        </Box>
    );
};
