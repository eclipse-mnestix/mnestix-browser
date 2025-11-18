import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { LockedTextField } from 'components/basics/LockedTextField';
import { useEffect, useState } from 'react';
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldArrayWithId,
    FieldErrors,
    UseFormRegister,
} from 'react-hook-form';
import { isValidIdPrefix, isValidShortIdPrefix } from 'lib/util/IdValidationUtil';
import { DynamicPartText } from './DynamicPartText';
import { IdSettingsFormData } from 'app/[locale]/settings/_components/id-settings/IdSettingsCard';
import { useTranslations } from 'next-intl';

type IdSettingEntryProps = {
    readonly index: number;
    readonly editMode: boolean;
    readonly isLoading?: boolean;
    readonly control: Control<IdSettingsFormData>;
    readonly field: FieldArrayWithId<IdSettingsFormData>;
    readonly register: UseFormRegister<IdSettingsFormData>;
    readonly errors: FieldErrors<IdSettingsFormData> | undefined;
};

const StyledWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    padding: theme.spacing(2),

    '&.is-loading': {
        opacity: '0.5',
        pointerEvents: 'none',
    },
}));

const StyledForm = styled('form')(() => ({
    display: 'flex',
    flexGrow: 1,
}));

const StyledCircularProgressWrapper = styled(Box)(() => ({
    width: '50px',
    height: '50px',
    position: 'absolute',
    right: 0,
    top: 'calc(50% - 10px)',
}));

export function IdSettingEntry(props: IdSettingEntryProps) {
    const [hasTriggeredChange, setHasTriggeredChange] = useState(false);
    const t = useTranslations('pages.settings.idStructure');

    const validateInput = (value: string | null | undefined) => {
        if (!value) return;
        switch (props.field.idType) {
            case 'IRI':
                return isValidIdPrefix(value) || t('errors.invalidIri');
            case 'string':
                // For idShorts we want to ensure that it can be part of an IRI
                return isValidShortIdPrefix(value) || t('errors.invalidIriPart');
        }
        return;
    };

    const isCurrentlyLoading = props.isLoading && hasTriggeredChange;

    useEffect(() => {
        if (!props.isLoading && hasTriggeredChange) {
            // Use queueMicrotask to avoid synchronous setState in effect
            queueMicrotask(() => {
                setHasTriggeredChange(false);
            });
        }
    }, [props.isLoading, hasTriggeredChange]);

    // When there is only one allowed value, we show a locked Textfield instead of a dropdown.
    // The whole thing is wrapped in a <Controller> during render to make it work with react-hook-form
    const dropdownOrLocked = (
        field: ControllerRenderProps<IdSettingsFormData, `idSettings.${number}.dynamicPart.value`>,
    ) =>
        props.field.dynamicPart.allowedValues.length > 1 ? (
            <FormControl fullWidth variant="filled">
                <InputLabel id="dynamic-part">{t('labels.dynamicPart')}</InputLabel>
                <Select labelId="dynamic-part" id="dynamic-part-select" label={t('labels.dynamicPart')} {...field}>
                    {props.field.dynamicPart.allowedValues &&
                        props.field.dynamicPart.allowedValues.map((el, index) => {
                            return (
                                <MenuItem key={index} value={el}>
                                    {el}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        ) : (
            <LockedTextField label={t('labels.dynamicPart')} sx={{ flexGrow: 1, mr: 1 }} fullWidth={true} {...field} />
        );

    return (
        <Box>
            <StyledWrapper className={`${isCurrentlyLoading ? 'is-loading' : ''}`}>
                <Typography sx={{ fontWeight: 'bold', width: '160px' }}>{props.field.name}</Typography>
                {!props.editMode && (
                    <>
                        <Typography data-testid={`settings-text-field-${props.index}`}>
                            {props.field.prefix.value}
                        </Typography>
                        <DynamicPartText
                            text={props.field.dynamicPart.value as string}
                            variant={props.field.dynamicPart.value === 'GUID' ? 'regular' : 'reference'}
                        />
                        {hasTriggeredChange && (
                            <StyledCircularProgressWrapper>
                                <CircularProgress size={20} />
                            </StyledCircularProgressWrapper>
                        )}
                    </>
                )}
                {props.editMode && (
                    <StyledForm>
                        <Controller
                            control={props.control}
                            rules={{
                                validate: (value) => validateInput(value),
                            }}
                            name={`idSettings.${props.index}.prefix.value`}
                            render={() => (
                                <TextField
                                    label={t('labels.staticPrefix')}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                    data-testid={`settings-edit-text-field-${props.index}`}
                                    fullWidth={true}
                                    defaultValue={props.field.prefix.value}
                                    error={!!props.errors?.idSettings?.[props.index]?.prefix}
                                    helperText={props.errors?.idSettings?.[props.index]?.prefix?.value?.message}
                                    slotProps={{
                                        htmlInput: {
                                            'data-testid': `settings-edit-input-field-${props.index}`,
                                        },
                                        formHelperText: {
                                            ...({
                                                'data-testid': `settings-edit-text-field-${props.index}-error`,
                                            } as React.HTMLAttributes<HTMLElement>),
                                        },
                                    }}
                                    {...props.register(`idSettings.${props.index}.prefix.value`)}
                                />
                            )}
                        />
                        <Box style={{ width: '200px', minWidth: '200px' }}>
                            <Controller
                                control={props.control}
                                name={`idSettings.${props.index}.dynamicPart.value`}
                                defaultValue={props.field.dynamicPart.value}
                                render={({ field }) => dropdownOrLocked(field)}
                            />
                        </Box>
                    </StyledForm>
                )}
            </StyledWrapper>
        </Box>
    );
}
