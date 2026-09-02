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
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import logger, { logInfo, logWarn } from 'lib/util/Logger';
import { RepositoryWithInfrastructure } from '../database/InfrastructureMappedTypes';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { AssetAdministrationShellDescriptor } from 'lib/types/registryServiceTypes';
import { wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

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
        protected readonly repositoryWithInfrastructure: RepositoryWithInfrastructure,
        protected readonly getTargetAasRepositoryClient: (
            securityHeader: Record<string, string> | null,
        ) => IAssetAdministrationShellRepositoryApi,
        protected readonly getTargetSubmodelRepositoryClient: (
            securityHeader: Record<string, string> | null,
        ) => ISubmodelRepositoryApi,
        protected readonly getTargetAasRegistryClient: (
            securityHeader: Record<string, string> | null,
        ) => IRegistryServiceApi,
        private readonly log: typeof logger = logger,
    ) {}

    /**
     * Factory method to create a ListService instance with real API clients.
     * The security header for the target repository is resolved per-call, inside each method, once it
     * is known that egress to the client-supplied repository URL is allowed (see `assertEgressAllowed`).
     * @param targetAasRepository - RepositoryWithInfrastructure object containing repository details
     * @param log - Optional logger instance for logging
     * @returns Promise that resolves to a configured ListService instance
     */
    static async create(targetAasRepository: RepositoryWithInfrastructure, log?: typeof logger): Promise<ListService> {
        const listServiceLogger = log?.child({ Service: 'ListService' });

        return new ListService(
            targetAasRepository,
            (securityHeader) =>
                AssetAdministrationShellRepositoryApi.create(targetAasRepository.url, mnestixFetch(securityHeader)),
            // For now, we only use the same repository.
            (securityHeader) => SubmodelRepositoryApi.create(targetAasRepository.url, mnestixFetch(securityHeader)),
            (securityHeader) =>
                RegistryServiceApi.create(targetAasRepository.url, mnestixFetch(securityHeader), listServiceLogger),
            listServiceLogger,
        );
    }

    static createNull(
        shellsInRepositories: AssetAdministrationShell[] = [],
        submodelInRepositories: Submodel[] = [],
        targetAasRepository = ServiceReachable.Yes,
    ): ListService {
        const repositoryWithInfrastructure = {
            infrastructureName: 'null',
            url: 'https://targetAasRepositoryClient.com',
        };
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
            repositoryWithInfrastructure,
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
        const { url, infrastructureName } = this.repositoryWithInfrastructure;
        try {
            await assertEgressAllowed(url, infrastructureName);
        } catch (e) {
            return { success: false, error: wrapErrorCode(ApiResultStatus.FORBIDDEN, (e as Error).message) };
        }
        const infrastructure = await getInfrastructureByName(infrastructureName);
        const securityHeader = await securityHeadersForUrl(url, infrastructure);

        let assetAdministrationShells: AssetAdministrationShell[];
        let nextCursor: string | undefined;

        if (type === 'registry') {
            logInfo(this.log, 'getAasListEntities', 'Fetching aas list from registry');
            const targetAasRegistryClient = this.getTargetAasRegistryClient(securityHeader);
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
                let hrefValue = descriptor.endpoints[0].protocolInformation.href;
                if (hrefValue.startsWith('/')) {
                    const host = new URL(url).origin;
                    logWarn(
                        this.log,
                        'getAasListEntities',
                        `Descriptor with id "${descriptor.id}" does not contain a standardconform URL, trying a workaround. Please update your data.`,
                    );
                    hrefValue = host.concat(hrefValue);
                }

                // The endpoint URL comes from the descriptor (data), not the configured repository — guard it
                // and re-derive credentials for its own host, so we never fetch an internal target or leak
                // the infrastructure's credentials to a non-configured host.
                try {
                    await assertEgressAllowed(hrefValue, infrastructureName);
                } catch (e) {
                    logWarn(
                        this.log,
                        'getAasListEntities',
                        `Skipping descriptor "${descriptor.id}" endpoint blocked by egress guard: ${(e as Error).message}`,
                    );
                    return null;
                }

                const endpoint = new URL(hrefValue);
                const endpointHeader = await securityHeadersForUrl(hrefValue, infrastructure);
                const aasResponse =
                    await this.getTargetAasRegistryClient(endpointHeader).getAssetAdministrationShellFromEndpoint(
                        endpoint,
                    );
                return aasResponse.isSuccess ? aasResponse.result : null;
            });

            const aasResults = await Promise.all(aasPromises);
            assetAdministrationShells = aasResults.filter((aas): aas is AssetAdministrationShell => aas !== null);
        } else {
            logInfo(this.log, 'getAasListEntities', 'Fetching aas list from repository');
            const targetAasRepositoryClient = this.getTargetAasRepositoryClient(securityHeader);
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
        const { url, infrastructureName } = this.repositoryWithInfrastructure;
        try {
            await assertEgressAllowed(url, infrastructureName);
        } catch (e) {
            return {
                success: false,
                manufacturerName: undefined,
                manufacturerProductDesignation: undefined,
                error: wrapErrorCode(ApiResultStatus.FORBIDDEN, (e as Error).message),
            };
        }
        const infrastructure = await getInfrastructureByName(infrastructureName);
        const securityHeader = await securityHeadersForUrl(url, infrastructure);

        const targetAasRepositoryClient = this.getTargetAasRepositoryClient(securityHeader);
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
            const submodelRepositoryClient = this.getTargetSubmodelRepositoryClient(securityHeader);
            const submodelMetadataResponse = await submodelRepositoryClient.getSubmodelMetaData(submodelId);
            if (submodelMetadataResponse.isSuccess) {
                const semanticId = submodelMetadataResponse.result?.semanticId?.keys[0]?.value;
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
                    // eslint-disable-next-line
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
