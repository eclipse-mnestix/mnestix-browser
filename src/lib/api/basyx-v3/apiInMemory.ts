import {
    IAssetAdministrationShellRepositoryApi,
    ISubmodelRepositoryApi,
    SubmodelElementValue,
} from 'lib/api/basyx-v3/apiInterface';
import type {
    AssetAdministrationShell,
    SubmodelElementChoice,
    Property,
    Reference,
    Submodel,
    SubmodelElementCollection,
    SubmodelElementList,
    ConceptDescription,
} from 'lib/api/aas/models';
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
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { LangStringTextType, MultiLanguageProperty, ModelType, DataTypeDefXsd } from 'lib/api/aas/models';
import { IConceptDescriptionApi } from '../concept-description-api/conceptDescriptionApiInterface';

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
    postSubmodelElement() // submodelId: string,
        // idShortPath: string,
        // submodelElement: unknown,
        // options?: Omit<RequestInit, 'body' | 'method'>,
        : Promise<ApiResponseWrapper<Response>> {
        throw new Error('Method not implemented.');
    }
    deleteSubmodelElementByPath() // submodelId: string,
        // idShortPath: string,
        // options?: Omit<RequestInit, 'body' | 'method'>,
        : Promise<ApiResponseWrapper<Response>> {
        throw new Error('Method not implemented.');
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

    async getSubmodelByIdValueOnly(
        submodelId: string,
        _options?: object,
    ): Promise<ApiResponseWrapper<SubmodelElementValue>> {
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
            const mlpValue = convertDesignation((element as MultiLanguageProperty).value ?? null);
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
    type ValueOnlyType = Record<string, unknown> | unknown | Array<Record<string, unknown> | unknown>;
    function parse(e: SubmodelElementChoice): ValueOnlyType {
        switch (e.modelType) {
            case ModelType.SubmodelElementCollection:
                return Object.fromEntries(
                    Object.entries((e as SubmodelElementCollection).value ?? {}).map(([_k, v]) => [
                        v.idShort,
                        parse(v as any),
                    ]),
                );
            case ModelType.SubmodelElementList:
                return (e as SubmodelElementList).value?.map((e) => parse(e) as string | Record<string, unknown>) ?? [];
            case ModelType.Property: {
                const prop = e as Property;
                if (!prop.value) {
                    return null;
                }
                switch (prop.valueType) {
                    case DataTypeDefXsd.XsDate:
                        return new Date(prop.value);
                    case DataTypeDefXsd.XsInteger:
                    case DataTypeDefXsd.XsInt:
                    case DataTypeDefXsd.XsFloat:
                    case DataTypeDefXsd.XsDecimal:
                        return Number(prop.value);
                    case DataTypeDefXsd.XsString:
                        return prop.value;
                }
                throw new Error(`Unknown value type: ${prop.valueType}. Please add to apiInMemory.ts`);
            }
            default:
                throw new Error(`Unknown model type: ${e.modelType}. Please add to apiInMemory.ts`);
        }
    }

    const res = Object.fromEntries(
        submodel.submodelElements
            ?.filter((e) => (e as any).value !== undefined)
            .map((e): [string, ValueOnlyType] => {
                return [e.idShort!, parse(e)];
            }) ?? [],
    );
    return res;
}

export class ConceptDescriptionRepositoryApiInMemory implements IConceptDescriptionApi {
    readonly conceptDescriptionsInRepository = new Map<string, ConceptDescription>();

    constructor(
        readonly basePath: string,
        conceptDescriptionsInRepository: ConceptDescription[],
        readonly reachable: ServiceReachable = ServiceReachable.Yes,
    ) {
        this.conceptDescriptionsInRepository = new Map<string, ConceptDescription>();
        conceptDescriptionsInRepository.forEach((conceptDescription) => {
            this.conceptDescriptionsInRepository.set(conceptDescription.id, conceptDescription);
        });
        this.basePath = basePath;
    }

    getBasePath(): string {
        return this.basePath;
    }
    async getConceptDescriptionById(conceptDescriptionId: string): Promise<ApiResponseWrapper<ConceptDescription>> {
        if (this.reachable !== ServiceReachable.Yes)
            return wrapErrorCode(ApiResultStatus.UNKNOWN_ERROR, 'Service not reachable');
        const foundConceptDescription = this.conceptDescriptionsInRepository.get(conceptDescriptionId);
        if (foundConceptDescription) {
            const response = new Response(JSON.stringify(foundConceptDescription), options);
            return await wrapResponse(response);
        }
        return Promise.resolve(
            wrapErrorCode(
                ApiResultStatus.NOT_FOUND,
                `no concept description found in the repository '${this.getBasePath()}' for conceptDescriptionId: '${conceptDescriptionId}', which is :'${safeBase64Decode(conceptDescriptionId)}' encoded in base64`,
            ),
        );
    }

}

/* eslint-enable @typescript-eslint/no-explicit-any */
