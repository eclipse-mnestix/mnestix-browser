import { ConnectionType, MnestixConnection } from '@prisma/client';
import { DataSourceFormData } from 'lib/services/database/PrismaConnector';

export interface IPrismaConnector {
    getConnectionData(): unknown;

    upsertConnectionDataAction(formDataInput: DataSourceFormData[]): Promise<void>;

    getConnectionDataByTypeAction(type: ConnectionType): Promise<string[]>;

    getRepositoryConfigurationGroups(): Promise<MnestixConnection[]>;

    getRepositoryConfigurationGroupByName(name: string): Promise<MnestixConnection | null>;

    getRepositoryConfigurationByRepositoryUrl(repositoryUrl: string): Promise<MnestixConnection | null>;
}
