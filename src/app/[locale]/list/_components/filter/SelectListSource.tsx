import { Dispatch, SetStateAction, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    ListSubheader,
    MenuItem,
    Select,
    SelectChangeEvent,
    Skeleton,
    Typography,
} from '@mui/material';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import {
    getAasRegistriesIncludingDefault,
    getAasRepositoriesIncludingDefault,
} from 'lib/services/database/infrastructureDatabaseActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

export type ConnectionWithType = RepositoryWithInfrastructure & { type: 'repository' | 'registry' };

export function SelectListSource(props: {
    onSelectedRepositoryChanged: Dispatch<SetStateAction<RepositoryWithInfrastructure | undefined>>;
    onSelectedTypeChanged?: Dispatch<SetStateAction<'repository' | 'registry' | undefined>>;
}) {
    const [aasConnections, setAasConnections] = useState<ConnectionWithType[]>([]);
    const [selectedConnectionIndex, setSelectedConnectionIndex] = useState<number>(0);
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('pages.aasList');

    useAsyncEffect(async () => {
        try {
            setIsLoading(true);
            const aasRepositories: RepositoryWithInfrastructure[] = await getAasRepositoriesIncludingDefault();
            const aasRegistries: RepositoryWithInfrastructure[] = await getAasRegistriesIncludingDefault();

            const connections: ConnectionWithType[] = [
                ...aasRepositories.map((repo) => ({ ...repo, type: 'repository' as const })),
                ...aasRegistries.map((registry) => ({ ...registry, type: 'registry' as const })),
            ];

            const filteredConnections = connections.filter((connection) => (connection.url ?? '').trim().length > 0);

            setAasConnections(filteredConnections);
            if (filteredConnections.length > 0) {
                setSelectedConnectionIndex(0);
                props.onSelectedRepositoryChanged(filteredConnections[0]);
                props.onSelectedTypeChanged?.(filteredConnections[0].type);
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

    const onRepositoryChanged = (event: SelectChangeEvent<number>) => {
        const index = event.target.value as number;
        setSelectedConnectionIndex(index);
        const selected = aasConnections[index];
        props.onSelectedRepositoryChanged(selected);
        props.onSelectedTypeChanged?.(selected?.type);
    };

    return (
        <Box>
            {isLoading ? (
                <Skeleton sx={{ mt: 2 }} width="300px" height="40px" variant="rectangular"></Skeleton>
            ) : (
                <FormControl variant="standard" sx={{ minWidth: 300, maxWidth: 400 }}>
                    <InputLabel id="aas-repository-select" sx={{ color: 'text.secondary' }}>
                        {t('repositoryDropdownLabel')}
                    </InputLabel>
                    <Select
                        data-testid="repository-select"
                        labelId="aas-repository-select"
                        variant="standard"
                        value={selectedConnectionIndex}
                        label={t('repositoryDropdownLabel')}
                        onChange={onRepositoryChanged}
                    >
                        <ListSubheader>Repositories</ListSubheader>
                        {aasConnections
                            .map((conn, index) => (conn.type === 'repository' ? { conn, index } : null))
                            .filter((item): item is { conn: ConnectionWithType; index: number } => item !== null)
                            .map(({ conn, index }) => (
                                <MenuItem
                                    key={`repo-${index}`}
                                    value={index}
                                    data-testid={`repository-select-item-${index}`}
                                >
                                    {conn.url}{' '}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ ml: '5px' }}
                                    >
                                        ({conn.infrastructureName})
                                    </Typography>
                                </MenuItem>
                            ))}
                        <ListSubheader>Registries</ListSubheader>
                        {aasConnections
                            .map((conn, index) => (conn.type === 'registry' ? { conn, index } : null))
                            .filter((item): item is { conn: ConnectionWithType; index: number } => item !== null)
                            .map(({ conn, index }) => (
                                <MenuItem
                                    key={`registry-${index}`}
                                    value={index}
                                    data-testid={`registry-select-item-${index}`}
                                >
                                    {conn.url}{' '}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ ml: '5px' }}
                                    >
                                        ({conn.infrastructureName})
                                    </Typography>
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
