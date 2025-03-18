import { IAssetAdministrationShellRepositoryApi, ISubmodelRepositoryApi } from 'lib/api/basyx-v3/apiInterface';
import type {
    AssetAdministrationShell,
    ISubmodelElement,
    Property,
    Reference,
    Submodel,
    SubmodelElementCollection,
    SubmodelElementList,
} from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import {
    ApiResponseWrapper,
    wrapErrorCode,
    wrapResponse,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AttachmentDetails } from 'lib/types/TransferServiceData';
import { encodeBase64, safeBase64Decode } from 'lib/util/Base64Util';
import { ServiceReachable } from 'test-utils/TestUtils';
import { MultiLanguageValueOnly, PaginationData } from 'lib/api/basyx-v3/types';
import { LangStringTextType, MultiLanguageProperty, ModelType } from '@aas-core-works/aas-core3.0-typescript/types';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { LangStringTextType, MultiLanguageProperty, ModelType } from '@aas-core-works/aas-core3.0-typescript/types';

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
        aasId: string,
        _options?: object | undefined,
    ): Promise<ApiResponseWrapper<PaginationData<Reference[]>>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundReferences = this.shellsInRepository.get(aasId)?.submodels;
        if (foundReferences) {
            const paginationData = { paging_metadata: {}, result: foundReferences };
            const response = new Response(JSON.stringify(paginationData), options);
            return await wrapResponse(response);
        }
        return Promise.resolve(
            wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `no submodel references found in the repository '${this.getBaseUrl()}' for aasId: '${aasId}'`,
            ),
        );
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

    async getSubmodelByIdValueOnly(submodelId: string, _options?: object) {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundAas = this.submodelsInRepository.get(submodelId);
        if (foundAas) {
            const response = new Response(JSON.stringify(submodelValueOnly(foundAas)), options);
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

    /**
     * Works right now only with MultiLanguageProperties.
     * @param submodelId
     * @param idShortPath
     * @param _options
     */
    async getSubmodelElement(
        submodelId: string,
        idShortPath: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<MultiLanguageValueOnly>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundSubmodel = this.submodelsInRepository.get(submodelId);
        const element = foundSubmodel?.submodelElements?.find((el) => el.idShort === idShortPath);
        if (element) {
            const mlpValue = convertDesignation((element as MultiLanguageProperty).value);
            const response = new Response(JSON.stringify(mlpValue), options);
            return wrapResponse(response);
        }
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `no submodel element found in the repository: '${this.baseUrl}' for submodel: '${submodelId}'`,
        );
    }

    async getSubmodelMetaData(submodelId: string, _options?: object): Promise<ApiResponseWrapper<Submodel>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundSubmodel = this.submodelsInRepository.get(submodelId);
        if (foundSubmodel) {
            const response = new Response(JSON.stringify(foundSubmodel), options);
            return wrapResponse(response);
        }
        return wrapErrorCode(
            ApiResultStatus.NOT_FOUND,
            `no submodel found in the repository: '${this.baseUrl}' for submodel: '${submodelId}'`,
        );
    }
}

export function convertDesignation(mlpValue: LangStringTextType[] | null): Record<string, string> | null {
    if (!mlpValue) return null;
    return mlpValue.reduce(
        (acc, designation) => {
            acc[designation.language] = designation.text;
            return acc;
        },
        {} as Record<string, string>,
    );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function submodelValueOnly(submodel: Submodel) {
    function parse(e: ISubmodelElement): Record<string, unknown> | string | Array<Record<string, unknown> | string> {
        switch (e.modelType()) {
            case ModelType.SubmodelElementCollection:
                return Object.fromEntries(
                    Object.entries((e as SubmodelElementCollection).value ?? {}).map(([k, v]) => [k, parse(v as any)]),
                );
            case ModelType.SubmodelElementList:
                return (e as SubmodelElementList).value?.map((e) => parse(e) as string | Record<string, unknown>) ?? [];
            case ModelType.Property:
                return JSON.stringify((e as Property).value);
            default:
                throw new Error(`Unknown model type: ${e.modelType()}. Please add to apiInMemory.ts`);
        }
    }
    const res = submodel.submodelElements?.filter((e) => (e as any).value !== undefined).map((e) => parse(e));
    if (res?.length === 1) return res[0];
    return res;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
