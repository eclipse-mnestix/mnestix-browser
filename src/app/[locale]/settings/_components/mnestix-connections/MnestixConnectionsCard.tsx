import { useTranslations } from 'next-intl';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { getConnectionDataAction, upsertConnectionDataAction } from 'lib/services/database/connectionServerActions';
import { useForm } from 'react-hook-form';
import { useEnv } from 'app/EnvProvider';
import { SettingsCardHeader } from 'app/[locale]/settings/_components/SettingsCardHeader';
import { MnestixConnectionsForm } from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionForm';
import {
    MnestixConnectionGroupForm
} from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionGroupForm';

export type ConnectionFormData = {
    aasRepository: {
        id: string;
        type: string;
        url: string;
        image?: string;
        aasSearcher?: string;
        name?: string;
    }[],
    submodelRepository: {
        id: string;
        url: string;
        type: string;
        image?: string;
        aasSearcher?: string;
        name?: string;
    }[];
};

type DataSource = {
    name: string;
    url: string | undefined;
};

export function MnestixConnectionsCard() {
    const notificationSpawner = useNotificationSpawner();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('pages.settings');
    const env = useEnv();

    const dataSources: DataSource[] = [
        { name: 'aasRepository', url: env.AAS_REPO_API_URL },
        { name: 'submodelRepository', url: env.SUBMODEL_REPO_API_URL },
    ];

    async function getConnectionData() {
        try {
            setIsLoading(true);
            return await getConnectionDataAction();
        } catch (error) {
            notificationSpawner.spawn({
                message: error,
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
        return [];
    }

    async function mapFormData() {
        const rawConnectionData = await getConnectionData();
        return {
            aasRepository: rawConnectionData
                .filter((data) => data.type.typeName === 'AAS_REPOSITORY')
                .map((data) => ({
                    id: data.id,
                    url: data.url,
                    type: data.type.typeName,
                    image: data.image,
                    aasSearcher: data.aasSearcher,
                    name: data.name
                })),
            submodelRepository: rawConnectionData
                .filter((data) => data.type.typeName === 'SUBMODEL_REPOSITORY')
                .map((data) => ({
                    id: data.id,
                    url: data.url,
                    type: data.type.typeName,
                    image: undefined,
                    aasSearcher: undefined,
                    name: undefined
                })),
        };
    }

    const { control, handleSubmit, getValues, reset } = useForm<ConnectionFormData>({
        defaultValues: async () => {
            const mappedData = await mapFormData();
            return {
                aasRepository: mappedData.aasRepository.map(group => ({
                    ...group,
                    image: group.image ?? undefined,
                    aasSearcher: group.aasSearcher ?? undefined,
                    name: group.name ?? undefined,
                })),
                submodelRepository: mappedData.submodelRepository.map(repo => ({
                    ...repo,
                    image: repo.image ?? undefined,
                    aasSearcher: repo.aasSearcher ?? undefined,
                    name: repo.name ?? undefined,
                })),
            };
        },
    });

    async function saveConnectionData(data: ConnectionFormData) {
        try {
            console.log(data)
            await upsertConnectionDataAction([...data.aasRepository, ...data.submodelRepository]);
            notificationSpawner.spawn({
                message: t('messages.changesSavedSuccessfully'),
                severity: 'success',
            });
            setIsEditMode(false);
        } catch (error) {
            notificationSpawner.spawn({
                message: error,
                severity: 'error',
            });
        }
    }

    const cancelEdit = () => {
        reset();
        setIsEditMode(false);
    };

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <SettingsCardHeader
                title={t('connections.title')}
                subtitle={t('connections.subtitle')}
                onCancel={() => cancelEdit()}
                onEdit={() => setIsEditMode(true)}
                onSubmit={handleSubmit((data) => saveConnectionData(data))}
                isEditMode={isEditMode}
            />
            {dataSources.filter(dataSources => dataSources.name === 'aasRepository').map((dataSource) => (
                <MnestixConnectionGroupForm
                    key={`${dataSource.name}-${dataSource.url}}`}
                    defaultUrl={dataSource.url}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    control={control}
                    getValues={getValues}
                />
            ))}
            {dataSources.filter(dataSources => dataSources.name !== 'aasRepository').map((dataSource) => (
                <MnestixConnectionsForm
                    key={`${dataSource.name}-${dataSource.url}}`}
                    connectionType={dataSource.name}
                    defaultUrl={dataSource.url}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    control={control}
                    getValues={getValues}
                />
            ))}
        </Box>
    );
}
