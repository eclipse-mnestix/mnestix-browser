import {
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    Skeleton,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Dispatch, Fragment, SetStateAction } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Control, Controller, FieldArrayWithId, useFieldArray, UseFormGetValues } from 'react-hook-form';
import { ConnectionFormData } from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionsCard';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { tooltipText } from 'lib/util/ToolTipText';
import { useTranslations } from 'next-intl';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export type MnestixConnectionsGroupFormProps = {
    readonly defaultUrl: string | undefined;
    readonly isLoading: boolean;
    readonly isEditMode: boolean;
    readonly setIsEditMode: Dispatch<SetStateAction<boolean>>;
    readonly control: Control<ConnectionFormData, never>;
    readonly getValues: UseFormGetValues<ConnectionFormData>;
};

export function MnestixConnectionGroupForm(props: MnestixConnectionsGroupFormProps) {
    const { defaultUrl, getValues, isLoading, setIsEditMode, isEditMode } = props;
    const control = props.control as Control<ConnectionFormData, never>;
    const t = useTranslations('pages.settings.connections');

    const { fields, append, remove } = useFieldArray<ConnectionFormData>({
        control,
        name: 'aasRepository',
    });

    function validateNoTrailingSlash(value: string) {
        return !value || !value.endsWith('/') || t('urlFieldNoTrailingSlash');
    }

    function renderUrlValue(url?: string) {
        return url && url.length !== 0 ? tooltipText(url, 80) : '-';
    }

    function getFormControl(field: FieldArrayWithId<ConnectionFormData, keyof ConnectionFormData>, index: number) {
        return (
            <FormControl fullWidth variant="filled" key={field.id}>
                <Box display="flex" flex={1} flexDirection="row" mb={6} alignItems="center">
                    <Typography variant="h4" mr={4} width="200px">
                        {t('aasRepository.repositoryLabel')} {index + 1}
                    </Typography>
                    {isEditMode ? (
                        <Box display="flex" alignItems="center" flex={1} gap={1}>
                            <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                <Controller
                                    name={`aasRepository.${index}.url`}
                                    control={control}
                                    defaultValue={field.url}
                                    rules={{
                                        required: t('urlFieldRequired'),
                                        validate: validateNoTrailingSlash,
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label={t('aasRepository.repositoryUrlLabel')}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                            fullWidth={true}
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`aasRepository.${index}.image`}
                                    control={control}
                                    defaultValue={field.image}
                                    rules={{
                                        validate: validateNoTrailingSlash,
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label={t('aasRepository.imageUrlLabel')}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                            fullWidth={true}
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            </Box>
                            <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                <Controller
                                    name={`aasRepository.${index}.name`}
                                    control={control}
                                    defaultValue={field.name}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label={t('aasRepository.nameLabel')}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                            fullWidth={true}
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`aasRepository.${index}.aasSearcher`}
                                    control={control}
                                    defaultValue={field.aasSearcher}
                                    rules={{
                                        validate: validateNoTrailingSlash,
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label={t('aasRepository.aasSearcherUrlLabel')}
                                            sx={{ flexGrow: 1, mr: 1 }}
                                            fullWidth={true}
                                            error={!!error}
                                            helperText={error ? error.message : ''}
                                        />
                                    )}
                                />
                            </Box>
                            <IconButton>
                                <RemoveCircleOutlineIcon onClick={() => remove(index)} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="row" flex={1} gap={1}>
                            <Box display="flex" flexDirection="column" flex={1} gap={2}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.repositoryUrlLabel')}
                                    </Typography>
                                    <Typography>
                                        {renderUrlValue(getValues(`aasRepository.${index}.url`))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.imageUrlLabel')}
                                    </Typography>
                                    <Typography>
                                        {getValues(`aasRepository.${index}.image`) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={getValues(`aasRepository.${index}.image`)}
                                                alt={getValues(`aasRepository.${index}.image`)}
                                                style={{ width: '80px', height: 'auto' }}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" flex={1} gap={2}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.nameLabel')}
                                    </Typography>
                                    <Typography>
                                        {renderUrlValue(getValues(`aasRepository.${index}.name`))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.aasSearcherUrlLabel')}
                                    </Typography>
                                    <Typography>
                                        {renderUrlValue(getValues(`aasRepository.${index}.aasSearcher`))}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </FormControl>
        );
    }

    return (
        <Box sx={{ my: 2 }}>
            <Divider />
            <Typography variant="h3" sx={{ my: 2 }}>
                {t('aasRepository.repositories')}
            </Typography>
            <Box display="flex" flexDirection="row" mb={4} alignItems="center">
                <Typography variant="h4" mr={4} width="200px">
                    {t('aasRepository.repositoryDefaultLabel')}
                </Typography>
                <Box display="flex" alignItems="center">
                    <Typography>{defaultUrl}</Typography>
                    <Tooltip title={t('defaultUrlInfo')}>
                        <InfoOutlineIcon sx={{ ml: 1 }} />
                    </Tooltip>
                </Box>
            </Box>
            {isLoading &&
                !fields.length &&
                [0, 1, 2].map((i) => {
                    return (
                        <Fragment key={i}>
                            <Skeleton variant="text" width="50%" height={26} sx={{ m: 2 }} />
                        </Fragment>
                    );
                })}
            {!isLoading && fields.map((field, index) => getFormControl(field, index))}
            <Box>
                <Button
                    variant="text"
                    startIcon={<ControlPointIcon />}
                    onClick={() => {
                        setIsEditMode(true);
                        append({ id: 'temp', type: 'AAS_REPOSITORY', url: '' });
                    }}
                >
                    {t('addButton')}
                </Button>
            </Box>
        </Box>
    );
}
