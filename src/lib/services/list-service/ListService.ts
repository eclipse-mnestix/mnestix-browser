import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { RegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { encodeBase64 } from 'lib/util/Base64Util';
import { MultiLanguageValueOnly } from 'lib/api/basyx-v3/types';
import { getInfrastructureByName } from '../database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';
import logger, { logInfo } from 'lib/util/Logger';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';

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
        protected readonly getTargetAasRepositoryClient: () => IAssetAdministrationShellRepositoryApi,
        protected readonly getTargetSubmodelRepositoryClient: () => ISubmodelRepositoryApi,
        protected readonly getTargetAasRegistryClient: () => IRegistryServiceApi,
        private readonly log: typeof logger = logger,
    ) {}

    /**
     * Factory method to create a ListService instance with real API clients.
     * Retrieves infrastructure configuration and security headers for the specified repository.
     * If the infrastructure is not found, uses the provided repository URL directly.
     * @param targetAasRepository - RepositoryWithInfrastructure object containing repository details
     * @param log - Optional logger instance for logging
     * @returns Promise that resolves to a configured ListService instance
     */
    static async create(targetAasRepository: RepositoryWithInfrastructure, log?: typeof logger): Promise<ListService> {
        const listServiceLogger = log?.child({ Service: 'ListService' });
        const infrastructure = await getInfrastructureByName(targetAasRepository.infrastructureName);
        const securityHeader = await createSecurityHeaders(infrastructure || undefined);

        return new ListService(
            () => AssetAdministrationShellRepositoryApi.create(targetAasRepository.url, mnestixFetch(securityHeader)),
            // For now, we only use the same repository.
            () => SubmodelRepositoryApi.create(targetAasRepository.url, mnestixFetch(securityHeader)),
            () => RegistryServiceApi.create(targetAasRepository.url, mnestixFetch(securityHeader), listServiceLogger),
            listServiceLogger,
        );
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
        const targetAasRegistryClient = RegistryServiceApi.createNull(
            'https://targetAasRegistryClient.com',
            shellsInRepositories,
            [],
            targetAasRepository,
        );
        return new ListService(
            () => targetAasRepositoryClient,
            () => targetSubmodelRepositoryClient,
            () => targetAasRegistryClient,
        );
    }

    /**
     * Returns all AASs from the chosen repository.
     * Special Behaviour: If the AssetInformation contains a specificAssetId with the name "aasListFilterId",
     * the whole AAS is filtered out and not returned from this service.
     * This logic is needed to hide the configuration AASs created by the mnestix-api.
     * @param limit
     * @param cursor
     * @param type
     */
    async getAasListEntities(limit: number, cursor?: string, type?: 'repository' | 'registry'): Promise<AasListDto> {
        let assetAdministrationShells: AssetAdministrationShell[] = [];
        let nextCursor: string | undefined;

        if (type === 'registry') {
            logInfo(this.log, 'getAasListEntities', 'Fetching aas list from registry');
            const targetAasRegistryClient = this.getTargetAasRegistryClient();
            const descriptorsResponse = await targetAasRegistryClient.getAllAssetAdministrationShellDescriptors(
                limit,
                cursor,
            );

            if (!descriptorsResponse.isSuccess) {
                return { success: false, error: descriptorsResponse };
            }

            const { result: descriptors, paging_metadata } = descriptorsResponse.result;
            nextCursor = paging_metadata?.cursor;

            // Fetch all AAS from their endpoints in parallel
            const aasPromises = descriptors.map(async (descriptor: AssetAdministrationShellDescriptor) => {
                if (!descriptor.endpoints || descriptor.endpoints.length === 0) {
                    this.log?.warn(`Descriptor ${descriptor.id} has no endpoints`);
                    return null;
                }
                const endpoint = new URL(descriptor.endpoints[0].protocolInformation.href);
                const aasResponse = await targetAasRegistryClient.getAssetAdministrationShellFromEndpoint(endpoint);
                return aasResponse.isSuccess ? aasResponse.result : null;
            });

            const aasResults = await Promise.all(aasPromises);
            assetAdministrationShells = aasResults.filter((aas): aas is AssetAdministrationShell => aas !== null);
        } else {
            logInfo(this.log, 'getAasListEntities', 'Fetching aas list from repository');
            const targetAasRepositoryClient = this.getTargetAasRepositoryClient();
            const response = await targetAasRepositoryClient.getAllAssetAdministrationShells(limit, cursor);

            if (!response.isSuccess) {
                return { success: false, error: response };
            }

            const { result: shells, paging_metadata } = response.result;
            assetAdministrationShells = shells;
            nextCursor = paging_metadata?.cursor;
        }

        const aasListDtos = assetAdministrationShells
            .filter((aas) => {
                const aasToRemove = aas.assetInformation?.specificAssetIds?.find(
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
    }

    async getNameplateValuesForAAS(aasId: string): Promise<NameplateValuesDto> {
        const targetAasRepositoryClient = this.getTargetAasRepositoryClient();
        const submodelReferencesResponse = await targetAasRepositoryClient.getSubmodelReferencesFromShell(
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
            const submodelRepositoryClient = this.getTargetSubmodelRepositoryClient();
            const submodelResponse = await submodelRepositoryClient.getSubmodelMetaData(submodelId);
            if (submodelResponse.isSuccess) {
                const semanticId = submodelResponse.result?.semanticId?.keys[0]?.value;
                const nameplateKeys = [
                    SubmodelSemanticIdEnum.NameplateV1,
                    SubmodelSemanticIdEnum.NameplateV2,
                    SubmodelSemanticIdEnum.NameplateV3,
                    SubmodelSemanticIdEnum.NameplateV4,
                ];
                if (nameplateKeys.includes(<SubmodelSemanticIdEnum>semanticId)) {
                    const manufacturerName = await submodelRepositoryClient.getSubmodelElement(
                        submodelId,
                        'ManufacturerName',
                    );
                    const manufacturerProduct = await submodelRepositoryClient.getSubmodelElement(
                        submodelId,
                        'ManufacturerProductDesignation',
                    );

                    // The API might return the value directly or wrapped in an object with the property name as key
                    const extractValue = (response: any): MultiLanguageValueOnly | undefined => {
                        if (!response) return undefined;
                        if (Array.isArray(response)) return response;
                        // If response is an object with a single key, extract that value
                        const keys = Object.keys(response);
                        if (keys.length === 1 && Array.isArray(response[keys[0]])) {
                            return response[keys[0]];
                        }
                        return response;
                    };

                    return {
                        success: true,
                        manufacturerName: extractValue(manufacturerName.result),
                        manufacturerProductDesignation: extractValue(manufacturerProduct.result),
                    };
                }
            }
        }
        // no nameplate found
        return { success: true, manufacturerProductDesignation: undefined, manufacturerName: undefined };
    }
}
