import { Dispatch, SetStateAction, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAasRepositoriesIncludingDefault } from 'lib/services/database/connectionServerActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/MappedTypes';

export function SelectRepository(props: {
    onSelectedRepositoryChanged: Dispatch<SetStateAction<RepositoryWithInfrastructure | undefined>>;
}) {
    const [aasRepositories, setAasRepositories] = useState<RepositoryWithInfrastructure[]>([]);
    const [selectedRepository, setSelectedRepository] = useState<string>('');
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('pages.aasList');

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            const aasRepositories: RepositoryWithInfrastructure[] = await getAasRepositoriesIncludingDefault();
            setAasRepositories(aasRepositories);
            if (aasRepositories.length > 0) {
                setSelectedRepository(aasRepositories[0].id);
                props.onSelectedRepositoryChanged(aasRepositories[0]);
            }
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
        props.onSelectedRepositoryChanged(aasRepositories.find((repo) => repo.id === event.target.value));
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
                                <MenuItem key={index} value={repo.id} data-testid={`repository-select-item-${index}`}>
                                    {repo.url}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
