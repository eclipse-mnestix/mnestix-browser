import { JSX } from 'react';
import { Box, Button, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { BaSyxRbacRule, rbacRuleTargets } from 'lib/services/rbac-service/RbacRulesService';
import { useTranslations } from 'next-intl';

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

import { useState } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Control, Controller, useFieldArray, UseFormGetValues } from 'react-hook-form';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';

type WildcardOrStringArrayInputProps = {
    rule: string;
    control: Control<RoleFormModel, never>;
    setValue: (name: string, value: any) => void;
    initialValue: string | string[];
};
export const WildcardOrStringArrayInput = (props: WildcardOrStringArrayInputProps) => {
    const checkIfWildcard = (value: string | string[]) => {
        if (value === '*') {
            return true;
        }
        return Array.isArray(value) && value[0] === '*';
    };
    const [isWildcard, setIsWildcard] = useState(checkIfWildcard(props.initialValue));
    // TODO check if its fine to always use array
    const { fields, append, remove } = useFieldArray({
        name: `targetInformation.${props.rule}`,
        control: props.control,
    });
    const wildcardValueChanged = (value: boolean) => {
        setIsWildcard(value);
        props.setValue(`targetInformation.${props.rule}`, value ? '*' : []);
    };

    return (
        <Box mt="1em">
            <Typography variant="h5">{props.rule}</Typography>

            <FormControlLabel
                control={<Checkbox checked={isWildcard} onChange={(e) => wildcardValueChanged(e.target.checked)} />}
                label="Wildcard"
            />
            {!isWildcard && (
                <>
                    {fields.map((_, idx) => (
                        <Controller
                            name={`targetInformation.${props.rule}.${idx}`}
                            control={props.control}
                            render={({ field }) => (
                                <Box display="flex" flexDirection="row" mb="1em">
                                    <TextField
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        fullWidth
                                        key={idx}
                                        variant="outlined"
                                        placeholder="Enter specific values"
                                        value={field.value}
                                    />

                                    <IconButton>
                                        <RemoveCircleOutlineIcon
                                            onClick={() => {
                                                remove(idx);
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    ))}
                    <Button
                        variant="text"
                        startIcon={<ControlPointIcon />}
                        onClick={() => {
                            append('');
                        }}
                    >
                        <FormattedMessage {...messages.mnestix.connections.addButton} />
                    </Button>
                </>
            )}
        </Box>
    );
};
