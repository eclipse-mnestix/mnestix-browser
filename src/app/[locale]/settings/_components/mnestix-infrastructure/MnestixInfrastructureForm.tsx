import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Chip,
    IconButton,
    FormControl,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormHelperText,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Controller, FieldArrayWithId, useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { MappedInfrastructure } from './InfrastructureTypes';
import { isValidUrl } from 'lib/util/UrlUtil';

export interface MnestixInfrastructureFormProps {
    infrastructure: MappedInfrastructure;
    onCancel: () => void;
    onSave: (data: MappedInfrastructure) => void;
    existingNames: string[];
}

const SECURITY_TYPES = {
    NONE: 'NONE',
    HEADER_SECURITY: 'HEADER',
    MNESTIX_PROXY: 'PROXY',
} as const;

const CONNECTION_TYPES = [
    { id: 'AAS_REPOSITORY', label: 'AAS Repository Interface' },
    { id: 'AAS_REGISTRY', label: 'AAS Registry Interface' },
    { id: 'SUBMODEL_REPOSITORY', label: 'Submodel Repository Interface' },
    { id: 'SUBMODEL_REGISTRY', label: 'Submodel Registry Interface' },
    { id: 'DISCOVERY_SERVICE', label: 'Discovery Interface' },
    { id: 'CONCEPT_DESCRIPTION', label: 'Concept Description Repository Interface' },
] as const;

function MnestixInfrastructureForm({
    infrastructure,
    onCancel,
    onSave,
    existingNames,
}: MnestixInfrastructureFormProps) {
    const t = useTranslations('pages.settings.infrastructure');
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<MappedInfrastructure>({
        mode: 'onChange',
        defaultValues: {
            id: infrastructure.id,
            name: infrastructure.name,
            logo: infrastructure.logo || '',
            securityType: infrastructure.securityType || SECURITY_TYPES.NONE,
            connections: infrastructure.connections,
            securityHeader: {
                name: infrastructure.securityHeader?.name || '',
                value: infrastructure.securityHeader?.value || '',
            },
            securityProxy: {
                value: infrastructure.securityProxy?.value || '',
            },
        },
    });
    const watchedSecurityType = useWatch({
        control,
        name: 'securityType',
    });
    const {
        fields: connectionFields,
        append: appendConnection,
        remove: removeConnection,
    } = useFieldArray({
        control,
        name: 'connections',
    });

    function onSubmit(data: MappedInfrastructure) {
        const cleanedData: MappedInfrastructure = {
            id: data.id,
            name: data.name,
            logo: data.logo || undefined,
            securityType: data.securityType,
            connections: data.connections,

            ...(data.securityType === SECURITY_TYPES.HEADER_SECURITY &&
                data.securityHeader?.name?.trim() &&
                data.securityHeader?.value?.trim() && {
                    securityHeader: {
                        name: data.securityHeader.name.trim(),
                        value: data.securityHeader.value.trim(),
                    },
                }),
            ...(data.securityType === SECURITY_TYPES.MNESTIX_PROXY &&
                data.securityProxy?.value?.trim() && {
                    securityProxy: {
                        value: data.securityProxy.value.trim(),
                    },
                }),
        };

        onSave(cleanedData);
    }

    function addConnection() {
        appendConnection({
            id: '',
            url: '',
            types: [],
        });
    }

    function getInfrastructureFormControl() {
        return (
            <FormControl fullWidth variant="filled">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    {infrastructure.logo && (
                        <Image
                            src={infrastructure.logo}
                            alt={`${infrastructure.name} logo`}
                            width={50}
                            height={50}
                            style={{ objectFit: 'contain' }}
                        />
                    )}

                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: t('form.nameRequired'),
                            validate: (value: string) => {
                                const trimmedValue = value.trim();
                                const isDuplicate = existingNames?.some(
                                    (existingName) =>
                                        existingName.toLowerCase() === trimmedValue.toLowerCase() &&
                                        existingName !== infrastructure.name,
                                );

                                if (isDuplicate) {
                                    return t('form.nameAlreadyExists');
                                }

                                return true;
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label={t('form.name')}
                                size="small"
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                aria-label="Infrastructure name"
                            />
                        )}
                    />
                    <Controller
                        name="logo"
                        control={control}
                        rules={{
                            validate: (value: string) => {
                                if (!value) {
                                    return true;
                                }
                                if (!isValidUrl(value)) {
                                    return t('form.urlFieldInvalid');
                                }
                                if (value.endsWith('/')) {
                                    return t('urlFieldNoTrailingSlash');
                                }
                                return true;
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label={t('form.logoUrl')}
                                size="small"
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                aria-label="Logo URL"
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
                        <Button onClick={onCancel} variant="outlined" aria-label="Cancel editing">
                            {t('form.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            aria-label="Save infrastructure"
                            disabled={Object.keys(errors).length > 0}
                        >
                            {t('form.save')}
                        </Button>
                    </Box>
                </Box>
            </FormControl>
        );
    }

    function getConnectionFormControl(field: FieldArrayWithId<MappedInfrastructure, 'connections'>, index: number) {
        return (
            <FormControl fullWidth variant="filled" key={field.id}>
                <Box sx={{ mb: 4, alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Controller
                            name={`connections.${index}.url`}
                            control={control}
                            defaultValue={field.url}
                            rules={{
                                required: t('form.urlFieldRequired'),
                                validate: (value: string) => {
                                    if (!isValidUrl(value)) {
                                        return t('form.urlFieldInvalid');
                                    }
                                    if (value.endsWith('/')) {
                                        return t('urlFieldNoTrailingSlash');
                                    }
                                    return true;
                                },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.endpointUrl')}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                    fullWidth
                                    error={!!error}
                                    helperText={error?.message}
                                    aria-label={`Endpoint URL ${index + 1}`}
                                />
                            )}
                        />
                        <IconButton
                            onClick={() => removeConnection(index)}
                            color="error"
                            aria-label={`Remove endpoint ${index + 1}`}
                            disabled={connectionFields.length === 1}
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                        >
                            <Delete />
                        </IconButton>
                    </Box>

                    <Controller
                        name={`connections.${index}.types`}
                        control={control}
                        rules={{
                            validate: (value: string[]) => {
                                if (!value || value.length === 0) {
                                    return t('form.connectionTypesRequired');
                                }
                                return true;
                            },
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <FormControl fullWidth error={!!error}>
                                <InputLabel id={`connection-types-label-${index}`}>
                                    {t('form.connectionTypes')}
                                </InputLabel>
                                <Select
                                    {...field}
                                    labelId={`connection-types-label-${index}`}
                                    multiple
                                    input={<OutlinedInput label={t('form.connectionTypes')} />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((typeId) => {
                                                const type = CONNECTION_TYPES.find((ct) => ct.id === typeId);
                                                return (
                                                    <Chip
                                                        key={typeId}
                                                        label={type?.label || typeId}
                                                        size="small"
                                                        variant="outlined"
                                                        onDelete={(e) => {
                                                            e.stopPropagation();
                                                            const newValue = selected.filter((item) => item !== typeId);
                                                            field.onChange(newValue);
                                                        }}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    aria-label={`Connection types for endpoint ${index + 1}`}
                                >
                                    {CONNECTION_TYPES.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            <Checkbox checked={field.value?.indexOf(type.id) > -1} size="small" />
                                            <ListItemText primary={type.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                </Box>
            </FormControl>
        );
    }

    function getSecurityFieldsBasedOnType() {
        switch (watchedSecurityType) {
            case SECURITY_TYPES.MNESTIX_PROXY:
                return (
                    <Controller
                        name="securityProxy.value"
                        control={control}
                        rules={{ required: t('form.proxyHeaderValueRequired') }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label={t('form.proxyHeaderValue')}
                                size="small"
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                                placeholder="your-api-key-value"
                                aria-label="Mnestix Proxy Header Value"
                            />
                        )}
                    />
                );

            case SECURITY_TYPES.HEADER_SECURITY:
                return (
                    <>
                        <Controller
                            name="securityHeader.name"
                            control={control}
                            rules={{ required: t('form.headerNameRequired') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.headerName')}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error?.message}
                                    placeholder="X-API-Key"
                                    aria-label="Security header name"
                                />
                            )}
                        />
                        <Controller
                            name="securityHeader.value"
                            control={control}
                            rules={{ required: t('form.headerValueRequired') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.headerValue')}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error?.message}
                                    placeholder="your-api-key-value"
                                    aria-label="Security header value"
                                />
                            )}
                        />
                    </>
                );

            default:
                return null;
        }
    }

    return (
        <Box
            sx={{
                p: 3,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 1,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} role="form" aria-label="Infrastructure form">
                {getInfrastructureFormControl()}

                <Divider />

                <Typography variant="h3" sx={{ my: 2, color: theme.palette.primary.main }}>
                    {t('form.endpoints')}
                </Typography>

                {connectionFields.map((field, index) => getConnectionFormControl(field, index))}

                <Button
                    variant="text"
                    startIcon={<Add />}
                    onClick={addConnection}
                    aria-label="Add new endpoint"
                    sx={{ mb: 2 }}
                >
                    {t('form.addEndpoint')}
                </Button>

                <Divider />

                <Typography variant="h3" sx={{ my: 2, color: theme.palette.primary.main }}>
                    {t('form.security')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Controller
                            name="securityType"
                            control={control}
                            rules={{ required: t('form.securityTypeRequired') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.securityType')}
                                    size="small"
                                    fullWidth
                                    select
                                    error={!!error}
                                    helperText={error?.message}
                                    aria-label="Security type"
                                >
                                    <MenuItem value={SECURITY_TYPES.NONE}>{t('form.securityTypeNone')}</MenuItem>
                                    <MenuItem value={SECURITY_TYPES.MNESTIX_PROXY}>
                                        {t('form.securityTypeMnestixProxy')}
                                    </MenuItem>
                                    <MenuItem value={SECURITY_TYPES.HEADER_SECURITY}>
                                        {t('form.securityTypeHeaderSecurity')}
                                    </MenuItem>
                                </TextField>
                            )}
                        />
                    </Box>
                    {getSecurityFieldsBasedOnType()}
                </Box>
            </form>
        </Box>
    );
}

export default MnestixInfrastructureForm;
