import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Control, Controller, useFieldArray, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { useTranslations } from 'next-intl';

type WildcardOrStringArrayInputProps = {
    type: string;
    rule: string;
    control: Control<RoleFormModel, never>;
    setValue: UseFormSetValue<RoleFormModel>;
    getValues: UseFormGetValues<RoleFormModel>;
};

const getTargetInformationKey = (type: string, rule: string): keyof RoleFormModel => {
    return `targetInformation.${type}.${rule}` as keyof RoleFormModel;
};

export const WildcardOrStringArrayInput = (props: WildcardOrStringArrayInputProps) => {
    const t = useTranslations('settings');
    const control = props.control;
    const checkIfWildcard = () => {
        const value = props.getValues(`targetInformation.${props.type}.${props.rule}` as keyof typeof props.getValues);
        return Array.isArray(value) && value[0] === '*';
    };
    const [isWildcard, setIsWildcard] = useState(checkIfWildcard());
    // TODO fix the typing issue here.
    const { fields, append, remove } = useFieldArray({
        control,
        name: getTargetInformationKey(props.type, props.rule),
    });
    const wildcardValueChanged = (value: boolean) => {
        setIsWildcard(value);
        props.setValue(`targetInformation.${props.type}.${props.rule}`, value ? ['*'] : []);
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
                            key={`targetInformation.${props.type}.${props.rule}.${idx}`}
                            name={`targetInformation.${props.type}.${props.rule}.${idx}`}
                            control={control}
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
                        {t('roles.addButton')}
                    </Button>
                </>
            )}
        </Box>
    );
};
