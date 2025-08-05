import { useTranslations } from 'next-intl';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { getConnectionDataAction, upsertConnectionDataAction } from 'lib/services/database/connectionServerActions';
import { useForm } from 'react-hook-form';
import { useEnv } from 'app/EnvProvider';
import { SettingsCardHeader } from 'app/[locale]/settings/_components/SettingsCardHeader';
import { MnestixConnectionsForm } from 'app/[locale]/settings/_components/mnestix-connections/MnestixConnectionForm';

export type ConnectionFormData = {
    aasRepository: {
        id: string;
        url: string;
        type: string;
    }[];
    submodelRepository: {
        id: string;
        url: string;
        type: string;
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
        // TODO MNES-273 replace [0] to handle multiple types in the future
        return {
            aasRepository: rawConnectionData
                .filter((data) => data.types[0]?.type.typeName === 'AAS_REPOSITORY')
                .map((data) => ({
                    id: data.id,
                    url: data.url,
                    type: data.types[0]?.type.typeName,
                })),
            submodelRepository: rawConnectionData
                .filter((data) => data.types[0]?.type.typeName === 'SUBMODEL_REPOSITORY')
                .map((data) => ({
                    id: data.id,
                    url: data.url,
                    type: data.types[0]?.type.typeName,
                })),
        };
    }

    const { control, handleSubmit, getValues, reset } = useForm<ConnectionFormData>({
        defaultValues: async () => await mapFormData(),
    });

    async function saveConnectionData(data: ConnectionFormData) {
        try {
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
            {dataSources.map((dataSource) => (
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
