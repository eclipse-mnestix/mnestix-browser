import { Box, DialogActions, Divider, FormControl, MenuItem, Skeleton, TextField, Typography } from '@mui/material';
import { getConnectionDataByTypeAction } from 'lib/services/database/connectionServerActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { Fragment, useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { Controller, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/MappedTypes';

export type TargetRepositoryFormData = {
    repository?: string;
    submodelRepository?: string;
    repositoryApiKey?: string;
};

type TargetRepositoryProps = {
    onSubmitStep: (values: TargetRepositoryFormData) => void;
    isSubmitting: boolean;
};

export function TargetRepositories(props: TargetRepositoryProps) {
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const [aasRepositories, setAasRepositories] = useState<RepositoryWithInfrastructure[]>([]);
    const [submodelRepositories, setSubmodelRepositories] = useState<RepositoryWithInfrastructure[]>([]);
    const t = useTranslations('pages.transfer');

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            // TODO add back env variable for default repository
            const aasRepositories = await getConnectionDataByTypeAction(
                getTypeAction(ConnectionTypeEnum.AAS_REPOSITORY),
            );
            setAasRepositories(aasRepositories);
            const submodelRepositories = await getConnectionDataByTypeAction(
                getTypeAction(ConnectionTypeEnum.SUBMODEL_REPOSITORY),
            );
            setSubmodelRepositories(submodelRepositories);
        } catch (error) {
            notificationSpawner.spawn({
                message: error,
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
        return;
    }, []);

    const { handleSubmit, control, formState } = useForm();

    const onSubmit = (data: TargetRepositoryFormData) => {
        props.onSubmitStep(data);
    };

    return (
        <>
            {isLoading ? (
                [0, 1].map((i) => {
                    return (
                        <Fragment key={i}>
                            <Skeleton variant="text" width="50%" height={26} sx={{ m: 2 }} />
                        </Fragment>
                    );
                })
            ) : (
                <form>
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="row" alignItems="flex-start">
                            <Typography variant="h4" sx={{ minWidth: '250px', mr: 2 }}>
                                {t('chooseRepository')}
                            </Typography>
                            <Box display="flex" flexDirection="column" width="100%">
                                <FormControl fullWidth>
                                    <Controller
                                        name="repository"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: t('repositoryRequired') }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                fullWidth
                                                select
                                                label={t('repositoryLabel')}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : null}
                                                required
                                                {...field}
                                            >
                                                {aasRepositories.map((repo, index) => {
                                                    return (
                                                        <MenuItem key={index} value={repo.id}>
                                                            {repo.url}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </TextField>
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <Controller
                                        name="repositoryApiKey"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <TextField type="password" label={t('repositoryApiKey')} {...field} />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row" mt={5} alignItems="flex-start">
                            <Typography variant="h4" sx={{ minWidth: '250px', mr: 2 }}>
                                {t('chooseSubmodelRepository')}
                            </Typography>
                            <FormControl fullWidth>
                                <Controller
                                    name="submodelRepository"
                                    control={control}
                                    defaultValue="0"
                                    render={({ field }) => (
                                        <TextField fullWidth select label={t('submodelRepositoryLabel')} {...field}>
                                            <MenuItem key="none" value="0">
                                                {t('useAasRepository')}
                                            </MenuItem>
                                            {submodelRepositories.map((repo, index) => {
                                                return (
                                                    <MenuItem key={index} value={repo.id}>
                                                        {repo.url}
                                                    </MenuItem>
                                                );
                                            })}
                                        </TextField>
                                    )}
                                />
                            </FormControl>
                        </Box>
                        <Divider sx={{ mt: 6, mb: 4 }} />
                        <DialogActions>
                            <LoadingButton
                                sx={{ mr: 1 }}
                                variant="outlined"
                                disabled={!formState.isValid}
                                loading={props.isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {t('title')}
                            </LoadingButton>
                        </DialogActions>
                    </Box>
                </form>
            )}
        </>
    );
}
