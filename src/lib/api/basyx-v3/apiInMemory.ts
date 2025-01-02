import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import { AssetAdministrationShell, Reference, Submodel } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import {
    ApiResponseWrapper,
    ApiResultStatus,
    wrapErrorCode,
    wrapResponse,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AttachmentDetails } from 'lib/types/TransferServiceData';
import { encodeBase64, safeBase64Decode } from 'lib/util/Base64Util';
import ServiceReachable from 'test-utils/TestUtils';
import { MultiLanguageValueOnly, PaginationData } from 'lib/api/basyx-v3/types';

const options = {
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

export class AssetAdministrationShellRepositoryApiInMemory implements IAssetAdministrationShellRepositoryApi {
    readonly shellsInRepository: Map<string, AssetAdministrationShell>;

    constructor(
        readonly baseUrl: string,
        shellsInRepository: AssetAdministrationShell[] = [],
        readonly reachable: ServiceReachable = ServiceReachable.Yes,
    ) {
        this.shellsInRepository = new Map<string, AssetAdministrationShell>();
        shellsInRepository.forEach((value) => this.shellsInRepository.set(encodeBase64(value.id), value));
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getAllAssetAdministrationShells(
        _limit?: number | undefined,
        _cursor?: string | undefined,
        _options?: object | undefined,
    ): Promise<ApiResponseWrapper<PaginationData<AssetAdministrationShell[]>>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');

        const shells = this.shellsInRepository;
        let cursor = '';
        if (shells.size > 0) {
            cursor = [...shells].pop()?.[0] ?? '';
        }
        const response = new Response(
            JSON.stringify({
                paging_metadata: { cursor: cursor },
                result: Array.from(shells.values()),
            }),
            options,
        );
        return await wrapResponse(response);
    }

    async postAssetAdministrationShell(
        aas: AssetAdministrationShell,
        _options?: object | undefined,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        if (this.shellsInRepository.get(aas.id))
            return wrapErrorCode(
                ApiResultStatus.INTERNAL_SERVER_ERROR,
                `AAS repository already has an AAS with id '${aas.id}`,
            );
        this.shellsInRepository.set(aas.id, aas);
        return wrapSuccess(aas);
    }

    putThumbnailToShell(
        _aasId: string,
        _image: Blob,
        _fileName: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<Response>> {
        throw new Error('Method not implemented.');
    }

    async getAssetAdministrationShellById(
        aasId: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundAas = this.shellsInRepository.get(aasId);
        if (foundAas) {
            const response = new Response(JSON.stringify(foundAas), options);
            return await wrapResponse(response);
        }
        return Promise.resolve(
            wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `no aas found in the repository '${this.getBaseUrl()}' for aasId: '${aasId}', which is :'${safeBase64Decode(aasId)}' encoded in base64`,
            ),
        );
    }

    async getSubmodelReferencesFromShell(
        _aasId: string,
        _options?: object | undefined,
    ): Promise<ApiResponseWrapper<PaginationData<Reference[]>>> {
        throw new Error('Method not implemented.');
    }

    async getThumbnailFromShell(_aasId: string, _options?: object): Promise<ApiResponseWrapper<Blob>> {
        throw new Error('Method not implemented.');
    }
}

export class SubmodelRepositoryApiInMemory implements ISubmodelRepositoryApi {
    readonly submodelsInRepository: Map<string, Submodel>;

    constructor(
        readonly baseUrl: string,
        submodelsInRepository: Submodel[],
        readonly reachable: ServiceReachable = ServiceReachable.Yes,
    ) {
        this.submodelsInRepository = new Map<string, Submodel>();
        submodelsInRepository.forEach((submodel) => {
            this.submodelsInRepository.set(submodel.id, submodel);
        });
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    putAttachmentToSubmodelElement(
        _submodelId: string,
        _attachmentData: AttachmentDetails,
        _options?: object,
    ): Promise<ApiResponseWrapper<Response>> {
        throw new Error('Method not implemented.');
    }

    async postSubmodel(submodel: Submodel, _options?: object): Promise<ApiResponseWrapper<Submodel>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        if (this.submodelsInRepository.has(submodel.id))
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Submodel repository '${this.getBaseUrl()}' already has a submodel '${submodel.id}'`,
            );
        this.submodelsInRepository.set(submodel.id, submodel);
        return wrapSuccess(submodel);
    }

    async getSubmodelById(submodelId: string, _options?: object): Promise<ApiResponseWrapper<Submodel>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundAas = this.submodelsInRepository.get(submodelId);
        if (foundAas) {
            const response = new Response(JSON.stringify(foundAas), options);
            return wrapResponse(response);
        }
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `no submodel found in the repository: '${this.baseUrl}' for submodel: '${submodelId}'`,
        );
    }

    async getAttachmentFromSubmodelElement(
        _submodelId: string,
        _submodelElementPath: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<Blob>> {
        throw new Error('Method not implemented.');
    }

    getSubmodelElement(
        _submodelId: string,
        _idShortPath: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<MultiLanguageValueOnly>> {
        throw new Error('Method not implemented.');
    }

    getSubmodelMetaData(_submodelId: string, _options?: object): Promise<ApiResponseWrapper<Submodel>> {
        throw new Error('Method not implemented.');
    }
}
