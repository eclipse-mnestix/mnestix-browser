import { JSX } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { BaSyxRbacRule, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
    readonly isEditMode: boolean;
};
export const TargetInformation = (props: TargetInformationProps) => {
    const t = useTranslations('settings');

    const ruleTypes = Object.keys(rbacRuleTargets);

    const permissions: JSX.Element[] = [];
    const keys = Object.keys(props.targetInformation);
    // TODO implement input which can be used for all keys
    // implement dynamic mapping to build the form depending on the @type
    // implement mapping to sent the correct data to the backend

    keys.forEach((key) => {
        // @ts-expect-error todo
        const element: string | string[] = props.targetInformation[key];

        if (key !== '@type') {
            permissions.push(
                <Box key={key} mt="1em">
                    <Typography variant="h5">{key}</Typography>
                    <Typography>{Array.isArray(element) ? element.join(', ') : element}</Typography>
                </Box>,
            );
        }
    });
    return (
        <Box>
            <Typography variant="h5">{t('roles.tableHeader.type')}</Typography>
            {props.isEditMode ? (
                <FormControl fullWidth>
                    <Select labelId="role-type-select-label" variant="outlined">
                        {ruleTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <Typography>{props.targetInformation['@type']}</Typography>
            )}
            {permissions}
        </Box>
    );
};
