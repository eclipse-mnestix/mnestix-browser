import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { RoleFormModel } from 'app/[locale]/settings/_components/role-settings/RoleDialog';
import { useTranslations } from 'next-intl';

type WildcardOrStringArrayInputProps = {
    rule: string;
    control: Control<RoleFormModel, never>;
    setValue: (name: string, value: any) => void;
    initialValue: string | string[];
};
export const WildcardOrStringArrayInput = (props: WildcardOrStringArrayInputProps) => {
    const t = useTranslations('settings');
    const checkIfWildcard = (value: string | string[]) => {
        if (value === '*') {
            return true;
        }
        return Array.isArray(value) && value[0] === '*';
    };
    const [isWildcard, setIsWildcard] = useState(checkIfWildcard(props.initialValue));
    // @ts-expect-error we expect an type error here since react-hook-form doesn't support fields for arrays of strings
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
                            key={`targetInformation.${props.rule}.${idx}`}
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
                        {t('roles.addButton')}
                    </Button>
                </>
            )}
        </Box>
    );
};
