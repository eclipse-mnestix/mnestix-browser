import { JSX } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { BaSyxRbacRule, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';
import { WildcardOrStringArrayInput } from 'app/[locale]/settings/_components/role-settings/WildcardOrStringArrayInput';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { Control, Controller, UseFormGetValues } from 'react-hook-form';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
    readonly isEditMode: boolean;
    readonly control: Control<RoleFormModel, never>;
    readonly setValue: (name: string, value: any) => void;
    readonly getValues: UseFormGetValues<RoleFormModel>;
};
export const TargetInformationForm = (props: TargetInformationProps) => {
    const t = useTranslations('settings');

    const ruleTypes = Object.keys(rbacRuleTargets);

    const permissions: JSX.Element[] = [];
    const keys = Object.keys(props.targetInformation);

    keys.forEach((key) => {
        // @ts-expect-error todo
        const element: string | string[] = props.targetInformation[key];

        if (key !== '@type') {
            if (props.isEditMode) {
                permissions.push(
                    <WildcardOrStringArrayInput
                        key={key}
                        initialValue={element}
                        control={props.control}
                        rule={key}
                        setValue={props.setValue}
                    />,
                );
            } else {
                permissions.push(
                    <Box key={key} mt="1em">
                        <Typography variant="h5">{key}</Typography>
                        <Typography>{Array.isArray(element) ? element.join(', ') : element}</Typography>
                    </Box>,
                );
            }
        }
    });
    return (
        <Box>
            <Typography variant="h5">{t('roles.tableHeader.type')}</Typography>
            {props.isEditMode ? (
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
            ) : (
                <Typography>{props.targetInformation['@type']}</Typography>
            )}
            {permissions}
        </Box>
    );
};
