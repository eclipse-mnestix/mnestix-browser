import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, IconButton, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { Dispatch, Fragment, SetStateAction, useState, useEffect } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {
    Control,
    Controller,
    FieldArrayWithId,
    useFieldArray,
    UseFormGetValues,
    ValidateResult,
} from 'react-hook-form';
import { ConnectionFormData } from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionsCard';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { tooltipText } from 'lib/util/ToolTipText';
import { useTranslations } from 'next-intl';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AasList from 'app/[locale]/list/_components/AasList';
import { AasListDto } from 'lib/services/list-service/ListService';
import { getAasListEntities } from 'lib/services/list-service/aasListApiActions';

export type MnestixConnectionsGroupFormProps = {
    readonly defaultUrl: string | undefined;
    readonly isLoading: boolean;
    readonly isEditMode: boolean;
    readonly setIsEditMode: Dispatch<SetStateAction<boolean>>;
    readonly control: Control<ConnectionFormData, never>;
    readonly getValues: UseFormGetValues<ConnectionFormData>;
};

export function MnestixConnectionGroupForm(props: MnestixConnectionsGroupFormProps) {
    const { getValues, isLoading, setIsEditMode, isEditMode } = props;
    const control = props.control as Control<ConnectionFormData, never>;
    const t = useTranslations('pages.settings.connections');
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [selectedRepositoryForPreview, setSelectedRepositoryForPreview] = useState<{ url: string; name: string } | null>(null);
    const [aasListData, setAasListData] = useState<AasListDto | undefined>(undefined);
    const [isLoadingAasList, setIsLoadingAasList] = useState(false);
    const [repositoryItemCounts, setRepositoryItemCounts] = useState<Record<number, number | null>>({});
    const [isLoadingItemCounts, setIsLoadingItemCounts] = useState<Record<number, boolean>>({});

    const { fields, append, remove } = useFieldArray<ConnectionFormData>({
        control,
        name: 'aasRepository',
    });

    const getTotalItemCount = async (repoUrl: string): Promise<number> => {
        let totalCount = 0;
        let cursor: string | undefined = undefined;
        let hasMore = true;

        while (hasMore) {
            try {
                const result = await getAasListEntities(repoUrl, 100, cursor);
                if (result.success && result.entities) {
                    totalCount += result.entities.length;
                    cursor = result.cursor;
                    hasMore = !!cursor && result.entities.length > 0;
                } else {
                    hasMore = false;
                }
            } catch (error) {
                console.error('Error counting AAS items:', error);
                hasMore = false;
            }
        }

        return totalCount;
    };

    const handleLoadRepositoryInfo = async (repoUrl: string, repoName: string, index: number) => {
        // Load total count
        setIsLoadingItemCounts(prev => ({ ...prev, [index]: true }));
        try {
            const totalCount = await getTotalItemCount(repoUrl);
            setRepositoryItemCounts(prev => ({ ...prev, [index]: totalCount }));
        } catch (error) {
            console.error('Error loading repository info:', error);
            setRepositoryItemCounts(prev => ({ ...prev, [index]: null }));
        } finally {
            setIsLoadingItemCounts(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleOpenPreview = async (repoUrl: string, repoName: string) => {
        setSelectedRepositoryForPreview({ url: repoUrl, name: repoName });
        setIsLoadingAasList(true);
        try {
            const result = await getAasListEntities(repoUrl, 25);
            setAasListData(result);
        } catch (error) {
            console.error('Error loading AAS list:', error);
            setAasListData(undefined);
        } finally {
            setIsLoadingAasList(false);
        }
        setPreviewDialogOpen(true);
    };

    // Load repository item counts on component mount and when fields change
    useEffect(() => {
        fields.forEach((field, index) => {
            const url = getValues(`aasRepository.${index}.url`);
            const name = getValues(`aasRepository.${index}.name`);
            if (url && repositoryItemCounts[index] === undefined) {
                handleLoadRepositoryInfo(url, name ?? '', index);
            }
        });
    }, [fields.length]);

    function validateNoTrailingSlash(value: string) {
        return !value || !value.endsWith('/') || t('urlFieldNoTrailingSlash');
    }

    function renderUrlValue(url?: string) {
        return url && url.length !== 0 ? tooltipText(url, 40) : '-';
    }

    function getFormControl(field: FieldArrayWithId<ConnectionFormData, keyof ConnectionFormData>, index: number) {
        const repoUrl = getValues(`aasRepository.${index}.url`);
        const repoName = getValues(`aasRepository.${index}.name`);

        return (
            <FormControl fullWidth variant="filled" key={field.id}>
                <Box display="flex" flex={1} flexDirection="column" mb={6}>
                    <Typography variant="h4" mr={4} mb={2}>
                        {t('aasRepository.repositoryLabel')} {index + 1}
                    </Typography>

                    {isEditMode ? (
                        <Box display="flex" alignItems="center" flex={1} gap={1}>
                            <Box display="flex" alignItems="start" flex={1} gap={1}>
                                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                    <Controller
                                        name={`aasRepository.${index}.name`}
                                        control={control}
                                        defaultValue={field.name ?? ''}
                                        rules={{
                                            validate: function uniqueNameValidation(value: string): ValidateResult {
                                                const values = getValues('aasRepository');
                                                const isDuplicate =
                                                    values.filter((item) => item.name === value).length > 1;
                                                return !isDuplicate || t('aasRepository.noDuplicatedNames');
                                            },
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label={t('aasRepository.nameLabel')}
                                                sx={{ flexGrow: 1 }}
                                                fullWidth={true}
                                                error={!!error}
                                                helperText={error ? error.message : ''}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name={`aasRepository.${index}.image`}
                                        control={control}
                                        defaultValue={field.image ?? ''}
                                        rules={{
                                            validate: validateNoTrailingSlash,
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label={t('aasRepository.imageUrlLabel')}
                                                sx={{ flexGrow: 1 }}
                                                fullWidth={true}
                                                error={!!error}
                                                helperText={error ? error.message : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`aasRepository.${index}.commercialData`}
                                        control={control}
                                        defaultValue={field.commercialData ?? ''}
                                        rules={{
                                            validate: validateNoTrailingSlash,
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label={t('aasRepository.commercialDataUrlLabel')}
                                                sx={{ flexGrow: 1 }}
                                                fullWidth={true}
                                                error={!!error}
                                                helperText={error ? error.message : ''}
                                            />
                                        )}
                                    />
                                    <Tooltip title={t('aasRepository.notYetSupported')}>
                                        <TextField label="Discovery URL" disabled />
                                    </Tooltip>
                                </Box>
                                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                    <Controller
                                        name={`aasRepository.${index}.url`}
                                        control={control}
                                        defaultValue={field.url ?? ''}
                                        rules={{
                                            required: t('urlFieldRequired'),
                                            validate: validateNoTrailingSlash,
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label={t('aasRepository.repositoryUrlLabel')}
                                                sx={{ flexGrow: 1 }}
                                                fullWidth={true}
                                                error={!!error}
                                                helperText={error ? error.message : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`aasRepository.${index}.aasSearcher`}
                                        control={control}
                                        defaultValue={field.aasSearcher ?? ''}
                                        rules={{
                                            validate: validateNoTrailingSlash,
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label={t('aasRepository.aasSearcherUrlLabel')}
                                                sx={{ flexGrow: 1 }}
                                                fullWidth={true}
                                                error={!!error}
                                                helperText={error ? error.message : ''}
                                            />
                                        )}
                                    />
                                    <Tooltip title={t('aasRepository.notYetSupported')}>
                                        <TextField label="Concept Description URL" disabled />
                                    </Tooltip>
                                    <Tooltip title={t('aasRepository.submodelRepositoryHint')}>
                                        <TextField label="Submodel Repository URL" disabled />
                                    </Tooltip>
                                </Box>
                            </Box>
                            <IconButton>
                                <RemoveCircleOutlineIcon onClick={() => remove(index)} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="row" flex={1} gap={2}>
                            <Box display="flex" flexDirection="column" flex={1} gap={2}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.nameLabel')}
                                    </Typography>
                                    <Typography>{renderUrlValue(repoName)}</Typography>
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
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.commercialDataUrlLabel')}
                                    </Typography>
                                    <Typography>{renderUrlValue(getValues(`aasRepository.${index}.commercialData`))}</Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" flex={1} gap={2}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {t('aasRepository.repositoryUrlLabel')}
                                    </Typography>
                                    <Typography>{renderUrlValue(repoUrl)}</Typography>
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

                    <Box sx={{ mt: 2, pt: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => {
                                    handleOpenPreview(repoUrl, repoName || `${t('aasRepository.repositoryLabel')} ${index + 1}`);
                                }}
                                disabled={!repoUrl}
                            >
                                {t('preview.previewButton')}
                            </Button>
                            {isLoadingItemCounts[index] ? (
                                <Typography variant="body2" color="text.secondary">
                                    {t('preview.loading')}
                                </Typography>
                            ) : repositoryItemCounts[index] !== undefined ? (
                                <Typography variant="body2" color="text.secondary">
                                    {t('preview.itemCount')}: {repositoryItemCounts[index]}
                                </Typography>
                            ) : null}
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => {
                                    if (repoUrl) {
                                        handleLoadRepositoryInfo(repoUrl, repoName ?? '', index);
                                    }
                                }}
                                disabled={!repoUrl || isLoadingItemCounts[index]}
                            >
                                {t('preview.reloadCount')}
                            </Button>
                        </Box>
                    </Box>
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
            <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {t('preview.title')} - {selectedRepositoryForPreview?.name}
                    {aasListData && aasListData.success && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {t('preview.itemCount')}: {aasListData.entities?.length ?? 0}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    {isLoadingAasList ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <Typography>{t('preview.loading')}</Typography>
                        </Box>
                    ) : aasListData ? (
                        <AasList
                            repositoryUrl={selectedRepositoryForPreview?.url ?? ''}
                            shells={aasListData}
                            selectedAasList={undefined}
                            updateSelectedAasList={() => { }}
                            columnSortUpdateCallback={() => { }}
                        />
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <Typography color="error">{t('preview.loadError')}</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
