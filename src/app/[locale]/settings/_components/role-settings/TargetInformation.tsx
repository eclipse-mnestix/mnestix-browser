import { JSX } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { BaSyxRbacRule } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
    readonly isEditMode: boolean;
};
export const TargetInformation = (props: TargetInformationProps) => {
    const t = useTranslations('settings');

    const ruleTypes = [
        'aas',
        'aas-environment',
        'submodel',
        'submodel-environment',
        'submodel-registry',
        'aas-registry',
        'aas-discovery-service',
    ];

    const permissions: JSX.Element[] = [];
    const keys = Object.keys(props.targetInformation);
    // TODO implement input which can be used for all keys
    // implement dynamic mapping to build the form depending on the @type
    // implement mapping to sent the correct data to the backend

    keys.forEach((key) => {
        // @ts-expect-error zod type
        const element = props.targetInformation[key];

        if (key !== '@type') {
            permissions.push(
                <Box key={key}>
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
