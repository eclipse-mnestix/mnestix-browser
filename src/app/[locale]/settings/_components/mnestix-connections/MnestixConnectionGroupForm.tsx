import { Box, Button, Divider, FormControl, IconButton, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
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

    function getFormControl(
        field: FieldArrayWithId<ConnectionFormData, keyof ConnectionFormData>,
        index: number,
        arrayName: keyof ConnectionFormData,
    ) {
        return (
            <FormControl fullWidth variant="filled" key={field.id}>
                <Box display="flex" flex={1} flexDirection="row" mb={2} alignItems="center">
                    <Typography variant="h4" mr={4} width="200px">
                        {t('aasRepository.repositoryLabel')} {index + 1}
                    </Typography>
                    {isEditMode ? (
                        <Box display="flex" alignItems="center" flex={1}>
                            <Controller
                                name={`${arrayName}.${index}.url`}
                                control={control}
                                defaultValue={field.url}
                                rules={{
                                    required: t('urlFieldRequired'),
                                    validate: (value: string) =>
                                        !value.endsWith('/') || t('urlFieldNoTrailingSlash'),
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
                            <IconButton>
                                <RemoveCircleOutlineIcon onClick={() => remove(index)} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Typography mb={2} mt={2}>
                            {tooltipText(getValues(`${arrayName}.${index}.url`), 80)}
                        </Typography>
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
            {!isLoading && fields.map((field, index) => getFormControl(field, index, 'aasRepository'))}
            <Box>
                <Button
                    variant="text"
                    startIcon={<ControlPointIcon />}
                    onClick={() => {
                        setIsEditMode(true);
                        append({ id: 'temp', type: 'aasRepository', url: '' });
                    }}
                >
                    {t('addButton')}
                </Button>
            </Box>
        </Box>
    );
}
