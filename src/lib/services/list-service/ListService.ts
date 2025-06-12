import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { encodeBase64 } from 'lib/util/Base64Util';
import { MultiLanguageValueOnly } from 'lib/api/basyx-v3/types';

export type ListEntityDto = {
    aasId: string;
    assetId: string;
    thumbnail: string;
};

export type NameplateValuesDto = {
    success: boolean;
    error?: object;
    manufacturerName: MultiLanguageValueOnly | undefined;
    manufacturerProductDesignation: MultiLanguageValueOnly | undefined;
};

export type AasListDto = {
    success: boolean;
    entities?: ListEntityDto[];
    error?: object;
    cursor?: string;
};

export class ListService {
    private constructor(
        readonly targetAasRepositoryClient: IAssetAdministrationShellRepositoryApi,
        readonly submodelRepositoryClient: ISubmodelRepositoryApi,
    ) {}

    static create(targetAasRepositoryBaseUrl: string): ListService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.create(
            targetAasRepositoryBaseUrl,
            mnestixFetch(),
        );

        // For now, we only use the same repository.
        const submodelRepositoryClient = SubmodelRepositoryApi.create(targetAasRepositoryBaseUrl, mnestixFetch());
        return new ListService(targetAasRepositoryClient, submodelRepositoryClient);
    }

    static createNull(
        shellsInRepositories: AssetAdministrationShell[] = [],
        submodelInRepositories: Submodel[] = [],
        targetAasRepository = ServiceReachable.Yes,
    ): ListService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.createNull(
            'https://targetAasRepositoryClient.com',
            shellsInRepositories,
            targetAasRepository,
        );
        const targetSubmodelRepositoryClient = SubmodelRepositoryApi.createNull(
            'https://targetAasRepositoryClient.com',
            submodelInRepositories,
            targetAasRepository,
        );
        return new ListService(targetAasRepositoryClient, targetSubmodelRepositoryClient);
    }

    /**
     * Returns all AASs from the chosen repository.
     * Special Behaviour: If the AssetInformation contains a specificAssetId with the name "aasListFilterId",
     * the whole AAS is filtered out and not returned from this service.
     * This logic is needed to hide the configuration AASs created by the mnestix-api.
     * @param limit
     * @param cursor
     */
    async getAasListEntities(limit: number, cursor?: string): Promise<AasListDto> {
        const response = await this.targetAasRepositoryClient.getAllAssetAdministrationShells(limit, cursor);

        if (!response.isSuccess) {
            return { success: false, error: response };
        }

        try {
            const { result: assetAdministrationShells, paging_metadata } = response.result;
            const nextCursor = paging_metadata.cursor;

            const aasListDtos = assetAdministrationShells
                .filter((aas) => {
                    const aasToRemove = aas.assetInformation.specificAssetIds?.find(
                        (specificAssetId) => specificAssetId.name === 'aasListFilterId',
                    );
                    return !aasToRemove;
                })
                .map((aas) => ({
                    aasId: aas.id,
                    assetId: aas.assetInformation?.globalAssetId ?? '',
                    thumbnail: aas.assetInformation?.defaultThumbnail?.path ?? '',
                }));

            return { success: true, entities: aasListDtos, cursor: nextCursor };
        } catch (error) {
            return { success: false, error: { message: 'Error while processing AAS list', details: error } };
        }
    }

    async getNameplateValuesForAAS(aasId: string): Promise<NameplateValuesDto> {
        const submodelReferencesResponse = await this.targetAasRepositoryClient.getSubmodelReferencesFromShell(
            encodeBase64(aasId),
        );
        const submodelReferences = submodelReferencesResponse.result;
        if (!submodelReferencesResponse.isSuccess || !submodelReferences) {
            return {
                success: false,
                manufacturerName: undefined,
                manufacturerProductDesignation: undefined,
                error: submodelReferencesResponse,
            };
        }
        for (const reference of submodelReferences.result) {
            const submodelId = reference.keys[0].value;
            const submodelResponse = await this.submodelRepositoryClient.getSubmodelMetaData(submodelId);
            if (submodelResponse.isSuccess) {
                const semanticId = submodelResponse.result?.semanticId?.keys[0].value;
                const nameplateKeys = [
                    SubmodelSemanticIdEnum.NameplateV1,
                    SubmodelSemanticIdEnum.NameplateV2,
                    SubmodelSemanticIdEnum.NameplateV3,
                    SubmodelSemanticIdEnum.NameplateV4,
                ];
                if (nameplateKeys.includes(<SubmodelSemanticIdEnum>semanticId)) {
                    const manufacturerName = await this.submodelRepositoryClient.getSubmodelElement(
                        submodelId,
                        'ManufacturerName',
                    );
                    const manufacturerProduct = await this.submodelRepositoryClient.getSubmodelElement(
                        submodelId,
                        'ManufacturerProductDesignation',
                    );

                    return {
                        success: true,
                        manufacturerName: manufacturerName.result,
                        manufacturerProductDesignation: manufacturerProduct.result,
                    };
                }
            }
        }
        // no nameplate found
        return { success: true, manufacturerProductDesignation: undefined, manufacturerName: undefined };
    }
}
