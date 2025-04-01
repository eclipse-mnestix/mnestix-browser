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
    control: Control<RoleFormModel>;
    setValue: UseFormSetValue<RoleFormModel>;
    getValues: UseFormGetValues<RoleFormModel>;
};

export const WildcardOrStringArrayInput = (props: WildcardOrStringArrayInputProps) => {
    const t = useTranslations('settings');
    const control = props.control;
    const checkIfWildcard = () => {
        const value = props.getValues(`targetInformation.${props.type}.${props.rule}` as keyof typeof props.getValues);
        // @ts-expect-error id exists
        return value[0].id === '*';
    };
    const [isWildcard, setIsWildcard] = useState(checkIfWildcard());
    const { fields, append, remove } = useFieldArray<RoleFormModel>({
        control,
        name: `targetInformation.${props.type}.${props.rule}` as 'targetInformation.aas.aasIds',
    });

    const wildcardValueChanged = (value: boolean) => {
        setIsWildcard(value);
        props.setValue(
            `targetInformation.${props.type}.${props.rule}.id` as 'targetInformation.aas.aasIds.0.id',
            value ? '*' : '',
        );
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
                            name={
                                `targetInformation.${props.type}.${props.rule}.${idx}.id` as 'targetInformation.aas.aasIds.0.id'
                            }
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
                            append({ id: '' });
                        }}
                    >
                        {t('roles.addButton')}
                    </Button>
                </>
            )}
        </Box>
    );
};
