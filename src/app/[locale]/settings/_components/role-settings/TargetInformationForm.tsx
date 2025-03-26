import { JSX } from 'react';
import { Box, Button, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { BaSyxRbacRule, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';

type TargetInformationProps = {
    readonly targetInformation: BaSyxRbacRule['targetInformation'];
    readonly isEditMode: boolean;
    readonly control: Control<RoleFormModel, never>;
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
                permissions.push(<WildcardOrStringArrayInput rule={key} value={element} />);
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

import { useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Control, Controller } from 'react-hook-form';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';

export const WildcardOrStringArrayInput = (props: { rule: string; value: string | string[] }) => {
    const [isWildcard, setIsWildcard] = useState(true);

    return (
        <Box mt="1em">
            <Typography variant="h5">{props.rule}</Typography>

            <FormControlLabel
                control={<Checkbox checked={isWildcard} onChange={(e) => setIsWildcard(e.target.checked)} />}
                label="Wildcard"
            />
            {!isWildcard && (
                <>
                    <Box display="flex" flexDirection="row">
                        <TextField fullWidth variant="outlined" placeholder="Enter specific values" />
                        <IconButton>
                            <RemoveCircleOutlineIcon onClick={() => {}} />
                        </IconButton>
                    </Box>
                    <Button variant="text" startIcon={<ControlPointIcon />} onClick={() => {}}>
                        <FormattedMessage {...messages.mnestix.connections.addButton} />
                    </Button>
                </>
            )}
        </Box>
    );
};
