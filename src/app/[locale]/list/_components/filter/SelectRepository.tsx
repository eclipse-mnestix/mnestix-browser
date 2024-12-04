import { Dispatch, SetStateAction, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getConnectionDataByTypeAction } from 'lib/services/database/connectionServerActions';
import { ConnectionTypeEnum, getTypeAction } from 'lib/services/database/ConnectionTypeEnum';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useEnv } from 'app/env/provider';
import { useTranslations } from 'next-intl';

export function SelectRepository(props: { onSelectedRepositoryChanged: Dispatch<SetStateAction<string | undefined>> }) {
    const [aasRepositories, setAasRepositories] = useState<string[]>([]);
    const [selectedRepository, setSelectedRepository] = useState<string>('');
    const notificationSpawner = useNotificationSpawner();
    const t = useTranslations('aas-list');
    const env = useEnv();

    useAsyncEffect(async () => {
        try {
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
        }
    }, []);

    const onRepositoryChanged = (event: SelectChangeEvent) => {
        setSelectedRepository(event.target.value);
        props.onSelectedRepositoryChanged(event.target.value);
    };

    return (
        <Box>
            <FormControl variant="standard" sx={{ minWidth: 200, maxWidth: 300 }}>
                <InputLabel id="aas-repository-select">{t('repository-dropdown')}</InputLabel>
                <Select
                    labelId="aas-repository-select"
                    variant="standard"
                    value={selectedRepository}
                    label={t('repository-dropdown')}
                    onChange={onRepositoryChanged}
                >
                    {aasRepositories.map((repo, index) => {
                        return (
                            <MenuItem key={index} value={repo}>
                                {repo}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
