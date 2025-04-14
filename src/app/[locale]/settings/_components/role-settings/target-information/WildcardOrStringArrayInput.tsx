import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Control, Controller, useFieldArray, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { RuleFormModel } from 'app/[locale]/settings/_components/role-settings/RuleForm';

type WildcardOrStringArrayInputProps = {
    type: string;
    rule: string;
    control: Control<RuleFormModel>;
    setValue: UseFormSetValue<RuleFormModel>;
    getValues: UseFormGetValues<RuleFormModel>;
};

export const WildcardOrStringArrayInput = (props: WildcardOrStringArrayInputProps) => {
    const t = useTranslations('pages.settings.rules');
    const control = props.control;
    const checkIfWildcard = () => {
        const value = props.getValues(
            `targetInformation.${props.type}.${props.rule}` as 'targetInformation.aas.aasIds',
        );
        return value[0].id === '*';
    };
    const [isWildcard, setIsWildcard] = useState(checkIfWildcard());
    const { fields, append, remove } = useFieldArray<RuleFormModel>({
        control,
        name: `targetInformation.${props.type}.${props.rule}` as 'targetInformation.aas.aasIds',
    });

    const wildcardValueChanged = (value: boolean) => {
        setIsWildcard(value);
        props.setValue(
            `targetInformation.${props.type}.${props.rule}` as 'targetInformation.aas.aasIds',
            value ? [{ id: '*' }] : [{ id: '' }],
        );
    };

    return (
        <Box mt="1em">
            <Typography variant="h5">{props.rule}</Typography>

            <FormControlLabel
                control={
                    <Checkbox
                        data-testid={`checkbox-${props.type}-${props.rule}`}
                        checked={isWildcard}
                        onChange={(e) => wildcardValueChanged(e.target.checked)}
                    />
                }
                label={t('wildcardLabel')}
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
                                        data-testid={`input-${props.type}-${props.rule}-${idx}`}
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
                                            data-testid={`remove-${props.type}-${props.rule}-${idx}`}
                                            onClick={() => {
                                                if (idx === 0) {
                                                    wildcardValueChanged(true);
                                                } else {
                                                    remove(idx);
                                                }
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    ))}
                    <Button
                        variant="text"
                        data-testid={`add-${props.type}-${props.rule}`}
                        startIcon={<ControlPointIcon />}
                        onClick={() => {
                            append({ id: '' });
                        }}
                    >
                        {t('buttons.add')}
                    </Button>
                </>
            )}
        </Box>
    );
};
