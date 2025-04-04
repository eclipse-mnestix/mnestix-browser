import { Dispatch, SetStateAction, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getConnectionDataByTypeAction } from 'lib/services/database/connectionServerActions';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useEnv } from 'app/EnvProvider';
import { useTranslations } from 'next-intl';

export function SelectRepository(props: { onSelectedRepositoryChanged: Dispatch<SetStateAction<string | undefined>> }) {
    const [aasRepositories, setAasRepositories] = useState<string[]>([]);
    const [selectedRepository, setSelectedRepository] = useState<string>('');
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('pages.aasList');
    const env = useEnv();

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            const aasRepositories = await getConnectionDataByTypeAction(
                getTypeAction(ConnectionTypeEnum.AAS_REPOSITORY),
            );
            if (env.AAS_REPO_API_URL) {
                aasRepositories.push(env.AAS_REPO_API_URL);
                setSelectedRepository(env.AAS_REPO_API_URL);
                props.onSelectedRepositoryChanged(env.AAS_REPO_API_URL);
            }
            setAasRepositories(aasRepositories);
        } catch (error) {
            notificationSpawner.spawn({
                message: error,
                severity: 'error',
            });
            return;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onRepositoryChanged = (event: SelectChangeEvent) => {
        setSelectedRepository(event.target.value);
        props.onSelectedRepositoryChanged(event.target.value);
    };

    return (
        <Box>
            {isLoading ? (
                <Skeleton sx={{ mt: 2 }} width="200px" height="40px" variant="rectangular"></Skeleton>
            ) : (
                <FormControl variant="standard" sx={{ minWidth: 200, maxWidth: 300 }}>
                    <InputLabel id="aas-repository-select" sx={{ color: 'text.secondary' }}>
                        {t('repositoryDropdown')}
                    </InputLabel>
                    <Select
                        data-testid="repository-select"
                        labelId="aas-repository-select"
                        variant="standard"
                        value={selectedRepository}
                        label={t('repositoryDropdown')}
                        onChange={onRepositoryChanged}
                    >
                        {aasRepositories.map((repo, index) => {
                            return (
                                <MenuItem key={index} value={repo} data-testid={`repository-select-item-${index}`}>
                                    {repo}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
