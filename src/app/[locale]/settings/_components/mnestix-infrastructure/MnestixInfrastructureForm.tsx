import React, { useState } from 'react';
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
    Menu,
    Checkbox,
    ListItemText,
    FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Controller, FieldArrayWithId, useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { MappedInfrastructure } from './InfrastructureTypes';

export interface MnestixInfrastructureFormProps {
    infrastructure: MappedInfrastructure;
    onCancel: () => void;
    onSave: (data: MappedInfrastructure) => void;
}

const SECURITY_TYPES = {
    NONE: 'NONE',
    HEADER_SECURITY: 'HEADER',
    MNESTIX_PROXY: 'PROXY',
} as const;

const CONNECTION_TYPES = [
    { id: 'AAS_REPOSITORY', label: 'AAS Repository' },
    { id: 'AAS_REGISTRY', label: 'AAS Registry' },
    { id: 'SUBMODEL_REPOSITORY', label: 'Submodel Repository' },
    { id: 'SUBMODEL_REGISTRY', label: 'Submodel Registry' },
    { id: 'DISCOVERY_SERVICE', label: 'Discovery Service' },
    { id: 'CONCEPT_DESCRIPTION', label: 'Concept Description' },
] as const;

function MnestixInfrastructureForm({ infrastructure, onCancel, onSave }: MnestixInfrastructureFormProps) {
    const t = useTranslations('pages.settings.infrastructure');
    const theme = useTheme();
    const [connectionTypeMenuAnchors, setConnectionTypeMenuAnchors] = useState<Record<number, HTMLElement | null>>({});
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<MappedInfrastructure>({
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

    // Event handlers
    function onSubmit(data: MappedInfrastructure) {
        // Map form data to infrastructure object
        const mappedData: MappedInfrastructure = {
            id: data.id,
            name: data.name,
            logo: data.logo || undefined,
            securityType: data.securityType,
            connections: data.connections,
        };

        // Add security data based on selected type
        switch (data.securityType) {
            case SECURITY_TYPES.HEADER_SECURITY:
                if (data.securityHeader?.name?.trim() && data.securityHeader?.value?.trim()) {
                    mappedData.securityHeader = {
                        name: data.securityHeader.name.trim(),
                        value: data.securityHeader.value.trim(),
                    };
                }
                break;
            case SECURITY_TYPES.MNESTIX_PROXY:
                if (data.securityProxy?.value?.trim()) {
                    mappedData.securityProxy = {
                        value: data.securityProxy.value.trim(),
                    };
                }
                break;
        }

        onSave(mappedData);
    }

    function addConnection() {
        appendConnection({
            id: '',
            url: '',
            types: [],
        });
    }

    // Helper function für Infrastructure-Grunddaten (Name und Logo)
    function getInfrastructureFormControl() {
        return (
            <FormControl fullWidth variant="filled">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    {infrastructure.logo && (
                        <Image src={infrastructure.logo} alt={`${infrastructure.name} logo`} width={64} height={64} />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: t('form.nameRequired') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.name')}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    aria-label="Infrastructure name"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Controller
                            name="logo"
                            control={control}
                            rules={{
                                validate: (value: string) => {
                                    if (!value) return true; // Optional field
                                    try {
                                        new URL(value);
                                        return true;
                                    } catch {
                                        return t('form.logoUrlInvalid');
                                    }
                                },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.logoUrl')}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    aria-label="Logo URL"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={onCancel} variant="outlined" aria-label="Cancel editing">
                            CANCEL
                        </Button>
                        <Button type="submit" variant="contained" aria-label="Save infrastructure">
                            SAVE
                        </Button>
                    </Box>
                </Box>
            </FormControl>
        );
    }

    // Helper function für Connection/Endpoint-Felder - OHNE useState
    function getConnectionFormControl(field: FieldArrayWithId<MappedInfrastructure, 'connections'>, index: number) {
        const connectionTypeMenuAnchor = connectionTypeMenuAnchors[index] || null;
        const connectionTypeMenuOpen = Boolean(connectionTypeMenuAnchor);

        return (
            <FormControl fullWidth variant="filled" key={field.id}>
                <Box display="flex" flex={1} flexDirection="column" mb={2}>
                    {/* URL Eingabe Zeile */}
                    <Box display="flex" alignItems="center" mb={2}>
                        <Controller
                            name={`connections.${index}.url`}
                            control={control}
                            defaultValue={field.url}
                            rules={{
                                required: t('form.urlFieldRequired'),
                                validate: (value: string) => {
                                    try {
                                        new URL(value);
                                        return true;
                                    } catch {
                                        return t('form.urlFieldInvalid');
                                    }
                                },
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.endpointUrl')}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                    fullWidth={true}
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    aria-label={`Endpoint URL ${index + 1}`}
                                />
                            )}
                        />
                        <IconButton
                            onClick={() => removeConnection(index)}
                            color="error"
                            aria-label={`Remove endpoint ${index + 1}`}
                            disabled={connectionFields.length === 1}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    {/* Connection Types Section */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
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
                                    <Box>
                                        <Controller
                                            name={`connections.${index}.types`}
                                            control={control}
                                            render={({ field }) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {field.value?.map((typeId) => {
                                                        const type = CONNECTION_TYPES.find((ct) => ct.id === typeId);
                                                        return (
                                                            <Chip
                                                                key={typeId}
                                                                label={type?.label || typeId}
                                                                size="small"
                                                                onDelete={() =>
                                                                    handleRemoveConnectionType(
                                                                        typeId,
                                                                        field.value || [],
                                                                        field.onChange,
                                                                    )
                                                                }
                                                                deleteIcon={<DeleteIcon />}
                                                                variant="outlined"
                                                            />
                                                        );
                                                    })}
                                                </Box>
                                            )}
                                        />
                                        <Box>
                                            {error && <FormHelperText error>{error.message}</FormHelperText>}
                                            <Button
                                                variant="text"
                                                startIcon={<AddIcon />}
                                                onClick={(event) => handleConnectionTypeMenuClick(index, event)}
                                                aria-label={`Add connection type for endpoint ${index + 1}`}
                                                size="small"
                                            >
                                                {t('form.addEndpointType')}
                                            </Button>
                                        </Box>

                                        <Menu
                                            anchorEl={connectionTypeMenuAnchor}
                                            open={connectionTypeMenuOpen}
                                            onClose={() => handleConnectionTypeMenuClose(index)}
                                            PaperProps={{
                                                style: {
                                                    maxHeight: 300,
                                                },
                                            }}
                                        >
                                            {CONNECTION_TYPES.map((type) => {
                                                const isSelected = field.value?.includes(type.id);
                                                return (
                                                    <MenuItem
                                                        key={type.id}
                                                        onClick={() => {
                                                            handleConnectionTypeSelect(
                                                                type.id,
                                                                field.value || [],
                                                                field.onChange,
                                                            );
                                                        }}
                                                        dense
                                                    >
                                                        <Checkbox checked={isSelected} size="small" sx={{ mr: 1 }} />
                                                        <ListItemText primary={type.label} />
                                                    </MenuItem>
                                                );
                                            })}
                                        </Menu>
                                    </Box>
                                )}
                            />
                        </Box>
                    </Box>
                </Box>
            </FormControl>
        );
    }

    // Helper function für dynamische Security-Felder basierend auf dem gewählten Typ
    function getSecurityFieldsBasedOnType() {
        switch (watchedSecurityType) {
            case SECURITY_TYPES.NONE:
                return null;

            case SECURITY_TYPES.MNESTIX_PROXY:
                return (
                    <Box sx={{ flex: 1 }}>
                        <Controller
                            name="securityProxy.value"
                            control={control}
                            rules={{ required: t('form.proxyUrlRequired') }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label={t('form.proxyUrl')}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error ? error.message : ''}
                                    placeholder="your-api-key-value"
                                    aria-label="Proxy API Key"
                                />
                            )}
                        />
                    </Box>
                );

            case SECURITY_TYPES.HEADER_SECURITY:
                return (
                    <>
                        <Box sx={{ flex: 1 }}>
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
                                        helperText={error ? error.message : ''}
                                        placeholder="X-API-Key"
                                        aria-label="Security header name"
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
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
                                        helperText={error ? error.message : ''}
                                        placeholder="your-api-key-value"
                                        aria-label="Security header value"
                                    />
                                )}
                            />
                        </Box>
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
                {/* Infrastructure Grunddaten */}
                {getInfrastructureFormControl()}

                <Divider />

                {/* Endpoints Section */}
                <Typography variant="h3" sx={{ my: 2 }}>
                    {t('form.endpoints')}
                </Typography>

                {connectionFields.map((field, index) => getConnectionFormControl(field, index))}

                <Box>
                    <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        onClick={addConnection}
                        aria-label="Add new endpoint"
                    >
                        {t('form.addEndpoint')}
                    </Button>
                </Box>

                <Divider />

                {/* Infrastructure Security Section */}
                <Typography variant="h3" sx={{ my: 2 }}>
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
                                    helperText={error ? error.message : ''}
                                    aria-label="Security type"
                                    defaultValue={SECURITY_TYPES.NONE}
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

                    {/* Dynamische Felder basierend auf Security Type */}
                    {getSecurityFieldsBasedOnType()}
                </Box>
            </form>
        </Box>
    );
}

export default MnestixInfrastructureForm;
