import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi } from 'lib/api/basyx-v3/api';
import { mnestixFetch } from 'lib/api/infrastructure';
import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { ISubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApiInterface';
import { IRegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApiInterface';
import { IDiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApiInterface';
import { RegistryServiceApi } from 'lib/api/registry-service-api/registryServiceApi';
import { DiscoveryServiceApi } from 'lib/api/discovery-service-api/discoveryServiceApi';
import { SubmodelRegistryServiceApi } from 'lib/api/submodel-registry-service/submodelRegistryServiceApi';
import { AssetAdministrationShellDescriptor, SubmodelDescriptor } from 'lib/types/registryServiceTypes';
import {
    AssetAdministrationShell,
    Blob,
    SubmodelElementChoice,
    KeyTypes,
    Submodel,
    SubmodelElementCollection,
} from 'lib/api/aas/models';
import {
    AttachmentDetails,
    TransferAas,
    TransferResult,
    TransferServiceConfig,
    TransferSubmodel,
} from 'lib/types/TransferServiceData';
import { generateRandomId } from 'lib/util/RandomUtils';
import {
    aasThumbnailImageIsFile,
    createShellDescriptorFromAas,
    createSubmodelDescriptorFromSubmodel,
} from 'lib/services/transfer-service/TransferUtil';
import { ApiResponseWrapperError } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { isValidUrl } from 'lib/util/UrlUtil';
import { ServiceReachable } from 'test-utils/TestUtils';

export type TransferServiceNullParams = {
    targetAasRepository: ServiceReachable;
    sourceAasRepository: ServiceReachable;
    sourceAasEntries: AssetAdministrationShell[];
    targetSubmodelRepository: ServiceReachable;
    sourceSubmodelRepository: ServiceReachable;
    sourceSubmodelEntries: Submodel[];
    targetAasDiscovery?: ServiceReachable;
    targetAasRegistry?: ServiceReachable;
    targetSubmodelRegistry?: ServiceReachable;
};

export class TransferService {
    private constructor(
        readonly targetAasRepositoryClient: IAssetAdministrationShellRepositoryApi,
        readonly sourceAasRepositoryClient: IAssetAdministrationShellRepositoryApi,
        readonly targetSubmodelRepositoryClient: ISubmodelRepositoryApi,
        readonly sourceSubmodelRepositoryClient: ISubmodelRepositoryApi,
        readonly targetAasDiscoveryClient?: IDiscoveryServiceApi,
        readonly targetAasRegistryClient?: IRegistryServiceApi,
        readonly targetSubmodelRegistryClient?: ISubmodelRegistryServiceApi,
        readonly apikey?: string,
    ) {}

    static create(config: TransferServiceConfig): TransferService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.create(
            config.targetAasRepoUrl,
            mnestixFetch(),
        );

        const sourceAasRepositoryClient = AssetAdministrationShellRepositoryApi.create(
            config.sourceAasRepoUrl,
            mnestixFetch(),
        );

        const targetSubmodelRepositoryClient = SubmodelRepositoryApi.create(
            config.targetSubmodelRepoUrl,
            mnestixFetch(),
        );

        const sourceSubmodelRepositoryClient = SubmodelRepositoryApi.create(
            config.sourceSubmodelRepoUrl,
            mnestixFetch(),
        );

        const targetAasDiscoveryClient = config.targetDiscoveryUrl
            ? DiscoveryServiceApi.create(config.targetDiscoveryUrl, mnestixFetch())
            : undefined;

        const targetAasRegistryClient = config.targetAasRegistryUrl
            ? RegistryServiceApi.create(config.targetAasRegistryUrl, mnestixFetch())
            : undefined;

        const targetSubmodelRegistryClient = config.targetSubmodelRegistryUrl
            ? SubmodelRegistryServiceApi.create(config.targetSubmodelRegistryUrl, mnestixFetch())
            : undefined;

        return new TransferService(
            targetAasRepositoryClient,
            sourceAasRepositoryClient,
            targetSubmodelRepositoryClient,
            sourceSubmodelRepositoryClient,
            targetAasDiscoveryClient,
            targetAasRegistryClient,
            targetSubmodelRegistryClient,
            config.apikey,
        );
    }

    static createNull({
        targetAasRepository = ServiceReachable.Yes,
        sourceAasRepository = ServiceReachable.Yes,
        sourceAasEntries = [],
        targetSubmodelRepository = ServiceReachable.Yes,
        sourceSubmodelRepository = ServiceReachable.Yes,
        sourceSubmodelEntries = [],
        targetAasDiscovery,
        targetAasRegistry,
        targetSubmodelRegistry,
    }: TransferServiceNullParams): TransferService {
        const targetAasRepositoryClient = AssetAdministrationShellRepositoryApi.createNull(
            'https://targetAasRepositoryClient.com',
            [],
            targetAasRepository,
        );

        const sourceAasRepositoryClient = AssetAdministrationShellRepositoryApi.createNull(
            'https://sourceAasRepositoryClient.com',
            sourceAasEntries,
            sourceAasRepository,
        );

        const targetSubmodelRepositoryClient = SubmodelRepositoryApi.createNull(
            'https://targetSubmodelRepositoryClient.com',
            [],
            targetSubmodelRepository,
        );

        const sourceSubmodelRepositoryClient = SubmodelRepositoryApi.createNull(
            'https://sourceSubmodelRepositoryClient.com',
            sourceSubmodelEntries,
            sourceSubmodelRepository,
        );

        const targetAasDiscoveryClient = targetAasDiscovery
            ? DiscoveryServiceApi.createNull('https://targetDiscoveryClient.com', [], targetAasDiscovery)
            : undefined;

        const targetAasRegistryClient = targetAasRegistry
            ? RegistryServiceApi.createNull('https://targetAasRegistryClient.com', [], [], targetAasRegistry)
            : undefined;

        const targetSubmodelRegistryClient = targetSubmodelRegistry
            ? SubmodelRegistryServiceApi.createNull(
                  'https://targetSubmodelRegistryClient.com',
                  [],
                  targetSubmodelRegistry,
              )
            : undefined;

        return new TransferService(
            targetAasRepositoryClient,
            sourceAasRepositoryClient,
            targetSubmodelRepositoryClient,
            sourceSubmodelRepositoryClient,
            targetAasDiscoveryClient,
            targetAasRegistryClient,
            targetSubmodelRegistryClient,
        );
    }

    async transferAasWithSubmodels(
        transferAas: TransferAas,
        transferSubmodels: TransferSubmodel[],
        attachmentTimeout: number = 5000,
    ): Promise<TransferResult[]> {
        const submodelDescriptors = transferSubmodels.map((transferSubmodel) =>
            createSubmodelDescriptorFromSubmodel(
                transferSubmodel.submodel,
                this.targetAasRepositoryClient.getBaseUrl(),
            ),
        );
        const shellDescriptor = createShellDescriptorFromAas(
            transferAas.aas,
            this.targetAasRepositoryClient.getBaseUrl(),
            submodelDescriptors,
        );

        const promises = [];
        const attachmentPromises: Promise<TransferResult>[] = [];

        promises.push(this.postAasToRepository(transferAas.aas, this.apikey));

        if (aasThumbnailImageIsFile(transferAas.aas)) {
            attachmentPromises.push(
                this.transferThumbnailImageToShell(transferAas.originalAasId, transferAas.aas.id, this.apikey),
            );
        }

        if (this.targetAasDiscoveryClient && transferAas.aas.assetInformation.globalAssetId) {
            promises.push(this.registerAasAtDiscovery(transferAas.aas, this.apikey));
        }

        if (this.targetAasRegistryClient) {
            promises.push(this.registerAasAtRegistry(shellDescriptor));
        }

        for (const transferSubmodel of transferSubmodels) {
            promises.push(this.postSubmodelToRepository(transferSubmodel.submodel, this.apikey));

            if (transferSubmodel.submodel.submodelElements) {
                const attachmentDetails = this.getSubmodelAttachmentsDetails(
                    transferSubmodel.submodel.submodelElements,
                );
                const result = await this.processAttachments(
                    transferSubmodel.originalSubmodelId,
                    transferSubmodel.submodel.id,
                    attachmentDetails,
                    this.apikey,
                );
                attachmentPromises.push(...result);
            }
        }

        if (this.targetSubmodelRegistryClient) {
            submodelDescriptors.forEach((descriptor) => {
                promises.push(this.registerSubmodelAtRegistry(descriptor));
            });
        }

        const mainResults = await Promise.all(promises);
        // Ensure AAS and submodels are fully transferred before initiating file uploads to prevent 'not-found' errors.
        // Azure’s hosted repository requires time to process newly uploaded AAS and submodels, so a temporary 5-second delay is applied.
        // TODO: Implement a dynamic readiness check to replace the fixed 5-second delay.
        const attachmentResults: TransferResult[] = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(Promise.all(attachmentPromises));
            }, attachmentTimeout);
        });

        return [...mainResults, ...attachmentResults];
    }

    private async postAasToRepository(aas: AssetAdministrationShell, apikey?: string): Promise<TransferResult> {
        const response = await this.targetAasRepositoryClient.postAssetAdministrationShell(aas, {
            headers: {
                ApiKey: apikey,
            },
        });
        if (response.isSuccess) {
            return { success: true, operationKind: 'AasRepository', resourceId: aas.id, error: '' };
        } else {
            return { success: false, operationKind: 'AasRepository', resourceId: aas.id, error: response.message };
        }
    }

    private async registerAasAtRegistry(shellDescriptor: AssetAdministrationShellDescriptor): Promise<TransferResult> {
        const response = await this.targetAasRegistryClient!.postAssetAdministrationShellDescriptor(shellDescriptor);
        if (response.isSuccess) {
            return { success: true, operationKind: 'AasRegistry', resourceId: shellDescriptor.id, error: '' };
        } else {
            return {
                success: false,
                operationKind: 'AasRegistry',
                resourceId: shellDescriptor.id,
                error: response.message,
            };
        }
    }

    private async postSubmodelToRepository(submodel: Submodel, apikey?: string): Promise<TransferResult> {
        const response = await this.targetSubmodelRepositoryClient.postSubmodel(submodel, {
            headers: {
                ApiKey: apikey,
            },
        });
        if (response.isSuccess) {
            return { success: true, operationKind: 'SubmodelRepository', resourceId: submodel.id, error: '' };
        } else {
            return {
                success: false,
                operationKind: 'SubmodelRepository',
                resourceId: submodel.id,
                error: response.message,
            };
        }
    }

    private async registerSubmodelAtRegistry(submodelDescriptor: SubmodelDescriptor): Promise<TransferResult> {
        const response = await this.targetSubmodelRegistryClient!.postSubmodelDescriptor(submodelDescriptor);
        if (response.isSuccess) {
            return { success: true, operationKind: 'SubmodelRegistry', resourceId: submodelDescriptor.id, error: '' };
        } else {
            return {
                success: false,
                operationKind: 'SubmodelRegistry',
                resourceId: submodelDescriptor.id,
                error: response.message,
            };
        }
    }

    private async transferThumbnailImageToShell(
        originalAasId: string,
        targetAasId: string,
        apikey?: string,
    ): Promise<TransferResult> {
        const response = await this.sourceAasRepositoryClient.getThumbnailFromShell(originalAasId);
        if (!response.isSuccess) {
            return {
                success: false,
                operationKind: 'FileTransfer',
                resourceId: 'Thumbnail transfer.',
                error: (response as ApiResponseWrapperError<Blob>).message,
            };
        }

        const aasThumbnail = response.result;
        const fileName = ['thumbnail', generateRandomId()].join('');
        const pushResponse = await this.targetAasRepositoryClient.putThumbnailToShell(
            targetAasId,
            aasThumbnail,
            fileName,
            {
                headers: {
                    ApiKey: apikey,
                },
            },
        );
        if (pushResponse.isSuccess) {
            return { success: true, operationKind: 'FileTransfer', resourceId: 'Thumbnail transfer.', error: '' };
        } else {
            return {
                success: false,
                operationKind: 'FileTransfer',
                resourceId: 'Thumbnail transfer.',
                error: pushResponse.message,
            };
        }
    }

    private async processAttachments(
        originalSubmodelId: string,
        targetSubmodelId: string,
        attachmentDetails: AttachmentDetails[],
        apikey?: string,
    ) {
        const promises = [];

        for (const attachmentDetail of attachmentDetails) {
            const response = await this.sourceSubmodelRepositoryClient.getAttachmentFromSubmodelElement(
                originalSubmodelId,
                attachmentDetail.idShortPath,
            );
            if (!response.isSuccess) {
                promises.push(
                    Promise.resolve({
                        success: false,
                        operationKind: 'FileTransfer',
                        resourceId: [
                            originalSubmodelId,
                            attachmentDetail.idShortPath,
                            ' not found in source repository',
                        ].join(': '),
                        error: (response as ApiResponseWrapperError<Blob>).message,
                    } as TransferResult),
                );
            } else {
                attachmentDetail.file = response.result;
                attachmentDetail.fileName = [
                    attachmentDetail.fileName,
                    this.getExtensionFromFileType(attachmentDetail.file.type),
                ].join('.');
                promises.push(this.putAttachmentToSubmodelElement(targetSubmodelId, attachmentDetail, apikey));
            }
        }
        return promises;
    }

    private async putAttachmentToSubmodelElement(
        submodelId: string,
        attachment: AttachmentDetails,
        apikey?: string,
    ): Promise<TransferResult> {
        const response = await this.targetSubmodelRepositoryClient.putAttachmentToSubmodelElement(
            submodelId,
            attachment,
            {
                headers: {
                    ApiKey: apikey,
                },
            },
        );
        if (response.isSuccess) {
            return {
                success: true,
                operationKind: 'FileTransfer',
                resourceId: [submodelId, attachment.idShortPath].join(': '),
                error: '',
            };
        } else {
            return {
                success: false,
                operationKind: 'FileTransfer',
                resourceId: [submodelId, attachment.idShortPath].join(': '),
                error: response.message,
            };
        }
    }

    private async registerAasAtDiscovery(aas: AssetAdministrationShell, apikey?: string): Promise<TransferResult> {
        const response = await this.targetAasDiscoveryClient!.linkAasIdAndAssetId(
            aas.id,
            aas.assetInformation.globalAssetId!,
            apikey,
        );
        if (response.isSuccess) {
            return { success: true, operationKind: 'Discovery', resourceId: aas.id, error: '' };
        } else {
            return { success: false, operationKind: 'Discovery', resourceId: aas.id, error: response.message };
        }
    }

    private getSubmodelAttachmentsDetails(submodelElements: SubmodelElementChoice[] | null) {
        const submodelAttachmentsDetails: AttachmentDetails[] = [];
        if (!submodelElements) return submodelAttachmentsDetails;

        for (const subEl of submodelElements) {
            const idShort = subEl.idShort;
            if (idShort === null || idShort === undefined) continue;

            this.processSubmodelElement(subEl, idShort, submodelAttachmentsDetails);
        }
        return submodelAttachmentsDetails;
    }

    private getAttachmentsDetailsFromCollection(subElColl: SubmodelElementCollection, collectionIdShortPath: string) {
        const submodelAttachmentsDetails: AttachmentDetails[] = [];
        if (!subElColl.value || !Array.isArray(subElColl.value)) return submodelAttachmentsDetails;
        for (const subEl of subElColl.value) {
            if (subEl.idShort === null || subEl.idShort === undefined) continue;
            const idShortPath = [collectionIdShortPath, subEl.idShort].join('.');

            this.processSubmodelElement(subEl, idShortPath, submodelAttachmentsDetails);
        }
        return submodelAttachmentsDetails;
    }

    private processSubmodelElement(
        subEl: SubmodelElementChoice,
        idShortPath: string,
        submodelAttachmentsDetails: AttachmentDetails[],
    ) {
        const modelType = subEl.modelType;
        if (modelType === KeyTypes.SubmodelElementCollection) {
            if (!subEl.value) return;
            submodelAttachmentsDetails.push(...this.getAttachmentsDetailsFromCollection(subEl, idShortPath));
        }

        if (modelType === KeyTypes.Blob) {
            submodelAttachmentsDetails.push({
                idShortPath: idShortPath,
                fileName: [subEl.idShort, generateRandomId()].join(''),
            });
        }

        if (modelType === KeyTypes.File) {
            const submodelEl = subEl;
            if (isValidUrl(submodelEl.value ?? '')) {
                return;
            }
            submodelAttachmentsDetails.push({
                idShortPath: idShortPath,
                fileName: [submodelEl.idShort, generateRandomId()].join(''),
            });
        }
    }

    private getExtensionFromFileType(fileType: string) {
        if (fileType === 'application/octet-stream') return '';
        return fileType.split(/[+/]/)[1];
    }
}
