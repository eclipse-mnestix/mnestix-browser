import { IAssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShellRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';
import { ServiceReachable } from 'lib/services/transfer-service/TransferService';

export type ListEntityDto = {
    aasId: string;
    assetId: string;
    thumbnail: string;
};

export type AasListDto = {
    success: boolean;
    entities?: ListEntityDto[];
    error?: object;
    cursor?: string;
};

export class ListService {
    private constructor(readonly targetAasRepositoryClient: IAssetAdministrationShellRepositoryApi) {}

    static create(targetAasRepositoryBaseUrl: string): ListService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.create(
            targetAasRepositoryBaseUrl,
            mnestixFetch(),
        );
        return new ListService(targetAasRepositoryClient);
    }

    static createNull(
        shellsInRepositories: AssetAdministrationShell[] = [],
        targetAasRepository = ServiceReachable.Yes,
    ): ListService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.createNull(
            'https://targetAasRepositoryClient.com',
            shellsInRepositories,
            targetAasRepository,
        );
        return new ListService(targetAasRepositoryClient);
    }

    async getAasListEntities(limit: number, cursor?: string): Promise<AasListDto> {
        const response = await this.targetAasRepositoryClient.getAllAssetAdministrationShells(limit, cursor);

        if (!response.isSuccess) {
            return { success: false, error: response };
        }

        const { result: assetAdministrationShells, paging_metadata } = response.result;
        const nextCursor = paging_metadata.cursor;

        const aasListDtos = assetAdministrationShells.map((aas) => ({
            aasId: aas.id,
            assetId: aas.assetInformation?.globalAssetId ?? '',
            thumbnail: aas.assetInformation?.defaultThumbnail?.path ?? '',
        }));

        return { success: true, entities: aasListDtos, cursor: nextCursor };
    }
}
