import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelSemanticId } from 'lib/enums/SubmodelSemanticId.enum';

export type ListEntityDto = {
    aasId: string;
    assetId: string;
    thumbnail: string;
};

export type NameplateValuesDto = {
    success: boolean;
    error?: object;
    manufacturerName: string;
    manufacturerProductDesignation: string;
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
        readonly submodelRepositoryClient: ISubmodelRepositoryApi) {}

    static create(targetAasRepositoryBaseUrl: string): ListService {

        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.create(
            targetAasRepositoryBaseUrl,
            mnestixFetch(),
        );

        // TODO for now we only use the same repository.
        const submodelRepositoryClient = SubmodelRepositoryApi.create(
            targetAasRepositoryBaseUrl,
            mnestixFetch(),
        );
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

    async getNameplateValuesForAAS(aasId: string): Promise<NameplateValuesDto> {
        const submodelReferencesResponse = await this.targetAasRepositoryClient.getSubmodelReferencesFromShell(aasId);
        const submodelReferences = submodelReferencesResponse.result;
        if (!submodelReferences || submodelReferences.length === 0) {
            return  {
                success: false,
                manufacturerName: 'dew',
                manufacturerProductDesignation: 'edwdw'
            };
        }
        for (const reference of submodelReferences) {

            const submodelId = reference.keys[0].value;
            const submodelResponse = await this.submodelRepositoryClient.getSubmodelMetaData(submodelId);
            if (!submodelResponse.isSuccess) {

                const semanticId = submodelResponse.result?.semanticId?.keys[0].value;
                const nameplateKeys = [
                    SubmodelSemanticId.NameplateV1,
                    SubmodelSemanticId.NameplateV2,
                    SubmodelSemanticId.NameplateV3
                ];
                if (nameplateKeys.includes(<SubmodelSemanticId>semanticId)) {

                    const manufacturerName = await this.submodelRepositoryClient.getSubmodelElement(submodelId, 'ManufacturerName');
                    const manufacturerProduct = await this.submodelRepositoryClient.getSubmodelElement(submodelId, 'ManufacturerProductDesignation');

                    console.log(manufacturerName);
                    console.log(manufacturerProduct);
                    // Multi language properties
                    //submodelResponse.result.;

                    // Recursive submodel elements
                    /*submodelResponse.result.submodelElements.forEach((submodelElement) => {
                    if (submodelElement instanceof SubmodelElementCollection) {
                        for (const reference: Reference of submodelReferences) {
                            reference.
                        }
                    }
                    });*/
                   /* return {
                        manufacturerName: submodelResponse.result..value,
                        error: submodelResponse
                    };

                    return {
                        id: submodelResponse.result.id,
                        submodel: submodelResponse.result,
                    };*/
                }

                return  {
                    success: true,
                    manufacturerName: 'dew',
                    manufacturerProductDesignation: 'edwdw'
                };
            }

        }
        // no nameplate found
        return {success: true, manufacturerProductDesignation: 'ddd', manufacturerName: 'dddff' }
    }
}
