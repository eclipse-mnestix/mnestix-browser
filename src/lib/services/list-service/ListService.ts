import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { RegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApi';
import { mnestixFetch } from 'lib/api/infrastructure';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import ServiceReachable from 'test-utils/TestUtils';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { encodeBase64 } from 'lib/util/Base64Util';
import { MultiLanguageValueOnly } from 'lib/api/basyx-v3/types';
import { getInfrastructureByName } from '../database/infrastructureData';
import { assertEgressAllowed, securityHeadersForUrl } from 'lib/util/securityHelpers/repositoryFetchGuard';
import { egressBlockedError } from 'lib/util/securityHelpers/egressBlockedError';
import logger, { logInfo, logWarn } from 'lib/util/Logger';
import { RepositoryWithInfrastructure, InfrastructureConnection } from '../database/InfrastructureMappedTypes';
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

/** Internal result of fetching shells from either a repository or a registry. */
type ShellsFetchResult =
    | { success: true; shells: AssetAdministrationShell[]; cursor?: string }
    | { success: false; error: object };


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
        const blocked = await egressBlockedError(url, infrastructureName);
        if (blocked) {
            return { success: false, error: blocked };
        }
        const infrastructure = await getInfrastructureByName(infrastructureName);
        const securityHeader = await securityHeadersForUrl(url, infrastructure);

        const shellsResult =
            type === 'registry'
                ? await this.fetchShellsFromRegistry(limit, cursor, securityHeader, infrastructure)
                : await this.fetchShellsFromRepository(limit, cursor, securityHeader);

        if (!shellsResult.success) {
            return { success: false, error: shellsResult.error };
        }

        return { success: true, entities: this.mapShellsToListDtos(shellsResult.shells), cursor: shellsResult.cursor };
    }

    /** Fetches shells directly from the AAS repository. */
    private async fetchShellsFromRepository(
        limit: number,
        cursor: string | undefined,
        securityHeader: Record<string, string> | null,
    ): Promise<ShellsFetchResult> {
        logInfo(this.log, 'getAasListEntities', 'Fetching aas list from repository');
        const response = await this.getTargetAasRepositoryClient(securityHeader).getAllAssetAdministrationShells(
            limit,
            cursor,
        );
        if (!response.isSuccess) {
            return { success: false, error: response };
        }
        const { result: shells, paging_metadata } = response.result;
        return { success: true, shells, cursor: paging_metadata?.cursor };
    }

    /** Fetches descriptors from the registry, then resolves each shell from its own endpoint in parallel. */
    private async fetchShellsFromRegistry(
        limit: number,
        cursor: string | undefined,
        securityHeader: Record<string, string> | null,
        infrastructure: InfrastructureConnection | undefined,
    ): Promise<ShellsFetchResult> {
        logInfo(this.log, 'getAasListEntities', 'Fetching aas list from registry');
        const descriptorsResponse = await this.getTargetAasRegistryClient(
            securityHeader,
        ).getAllAssetAdministrationShellDescriptors(limit, cursor);
        if (!descriptorsResponse.isSuccess) {
            return { success: false, error: descriptorsResponse };
        }

        const { result: descriptors, paging_metadata } = descriptorsResponse.result;
        const shells = await Promise.all(
            descriptors.map((descriptor: AssetAdministrationShellDescriptor) =>
                this.fetchShellFromDescriptor(descriptor, infrastructure),
            ),
        );

        return {
            success: true,
            shells: shells.filter((aas): aas is AssetAdministrationShell => aas !== null),
            cursor: paging_metadata?.cursor,
        };
    }

    /**
     * Resolves a single shell from a registry descriptor's endpoint.
     * The endpoint URL comes from the descriptor (data), not the configured repository — it is guarded
     * and credentials are re-derived for its own host, so we never fetch an internal target or leak the
     * infrastructure's credentials to a non-configured host. Returns null when the descriptor is unusable.
     */
    private async fetchShellFromDescriptor(
        descriptor: AssetAdministrationShellDescriptor,
        infrastructure: InfrastructureConnection | undefined,
    ): Promise<AssetAdministrationShell | null> {
        const { url, infrastructureName } = this.repositoryWithInfrastructure;
        const hrefValue = this.resolveDescriptorHref(descriptor, url);
        if (!hrefValue) return null;

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

        const endpointHeader = await securityHeadersForUrl(hrefValue, infrastructure);
        const aasResponse =
            await this.getTargetAasRegistryClient(endpointHeader).getAssetAdministrationShellFromEndpoint(
                new URL(hrefValue),
            );
        return aasResponse.isSuccess ? aasResponse.result : null;
    }

    /**
     * Extracts the AAS endpoint URL from a descriptor, applying a workaround for non-standard relative
     * hrefs by prefixing the configured repository origin. Returns null when the descriptor has no endpoint.
     */
    private resolveDescriptorHref(descriptor: AssetAdministrationShellDescriptor, repositoryUrl: string): string | null {
        if (!descriptor.endpoints || descriptor.endpoints.length === 0) {
            this.log?.warn(`Descriptor ${descriptor.id} has no endpoints`);
            return null;
        }
        const hrefValue = descriptor.endpoints[0].protocolInformation.href;
        if (hrefValue.startsWith('/')) {
            logWarn(
                this.log,
                'getAasListEntities',
                `Descriptor with id "${descriptor.id}" does not contain a standardconform URL, trying a workaround. Please update your data.`,
            );
            return new URL(repositoryUrl).origin.concat(hrefValue);
        }
        return hrefValue;
    }

    /**
     * Maps shells to list DTOs, filtering out the configuration AASs created by the mnestix-api
     * (identified by a specificAssetId named "aasListFilterId").
     */
    private mapShellsToListDtos(shells: AssetAdministrationShell[]): ListEntityDto[] {
        return shells
            .filter(
                (aas) => !aas.assetInformation?.specificAssetIds?.some((id) => id.name === 'aasListFilterId'),
            )
            .map((aas) => ({
                aasId: aas.id,
                assetId: aas.assetInformation?.globalAssetId ?? '',
                thumbnail: aas.assetInformation?.defaultThumbnail?.path ?? '',
            }));
    }

    async getNameplateValuesForAAS(aasId: string): Promise<NameplateValuesDto> {
        const { url, infrastructureName } = this.repositoryWithInfrastructure;
        const blocked = await egressBlockedError(url, infrastructureName);
        if (blocked) {
            return {
                success: false,
                manufacturerName: undefined,
                manufacturerProductDesignation: undefined,
                error: blocked,
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
