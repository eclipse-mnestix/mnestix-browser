import { AssetAdministrationShell, Reference, Submodel } from 'lib/api/aas/models';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { MultiLanguageValueOnly, PaginationData } from 'lib/api/basyx-v3/types';

export interface IAssetAdministrationShellRepositoryApi {
    /**
     * Returns the base URL of this repository endpoint.
     */
    getBaseUrl(): string;

    getAllAssetAdministrationShells(
        limit?: number,
        cursor?: string,
        options?: object,
    ): Promise<ApiResponseWrapper<PaginationData<AssetAdministrationShell[]>>>;

    /**
     * @summary Retrieves a specific Asset Administration Shell from the Asset Administration Shell repository
     * @param {string} aasId The Asset Administration Shell&#x27;s unique id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AssetAdministrationShellRepositoryApi
     */
    getAssetAdministrationShellById(
        aasId: string,
        options?: object,
    ): Promise<ApiResponseWrapper<AssetAdministrationShell>>;

    /**
     *
     * @summary Retrieves all Submodel References from the  Asset Administration Shell
     * @param {string} aasId The Asset Administration Shell&#x27;s unique id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AssetAdministrationShellRepositoryApi
     */
    getSubmodelReferencesFromShell(
        aasId: string,
        options?: object,
    ): Promise<ApiResponseWrapper<PaginationData<Reference[]>>>;

    /**
     * @summary Retrieves the thumbnail from the Asset Administration Shell.
     * @param aasId aasId The ID of the Asset Administration Shell.
     * @param options {*} [options] Override http request option.
     * @returns The thumbnail retrieved from the Asset Administration Shell.
     * @memberof AssetAdministrationShellRepositoryApi
     */
    getThumbnailFromShell(aasId: string, options?: object): Promise<ApiResponseWrapper<Blob>>;
}

export interface ISerializationApi {
    /**
     * Returns the base URL of this repository endpoint.
     */
    getBaseUrl(): string;

    /**
     * Downloads an Asset Administration Shell (AAS) from the repository.
     * @param aasId The ID of the AAS to download.
     * @param submodelIds The IDs of the submodels to include in the download.
     * @param includeConceptDescriptions Whether to include concept descriptions in the download.
     * @param outputFormat The format of the downloaded AAS (e.g., XML, JSON, AASX).
     * @param options Optional. Additional options to customize the download request.
     */
    downloadAAS(
        aasId: string | string[],
        submodelIds: string[],
        includeConceptDescriptions: boolean,
        outputFormat: 'xml' | 'json' | 'aasx',
        options?: object,
    ): Promise<ApiResponseWrapper<Blob>>;
}

type PropertyValue = string | number | boolean;

export type SubmodelElementValue =
    | Array<SubmodelElementValue>
    | PropertyValue
    // workaround for infinite direct type recursion
    | { [key: string]: SubmodelElementValue };

export interface ISubmodelRepositoryApi {
    /**
     * Returns the base URL of this repository.
     */
    getBaseUrl(): string;

    /**
     * @summary Retrieves the submodel
     * @param {string} submodelId The Submodels unique id
     * @param {*} [options] Override http request option
     * @throws {RequiredError}
     * @memberof SubmodelRepositoryApi
     */
    getSubmodelById(submodelId: string, options?: object): Promise<ApiResponseWrapper<Submodel>>;

    /**
     * @summary Retrieves the value-only serialized submodel
     * @param {string} submodelId The Submodels unique id
     * @param {*} [options] Override http request option
     * @returns Wrapped unknown. unknown because value only can be primitive or complex type.
     * @throws {RequiredError}
     */
    getSubmodelByIdValueOnly(submodelId: string, options?: object): Promise<ApiResponseWrapper<SubmodelElementValue>>;

    postSubmodelElement(
        submodelId: string,
        // TODO MNES-1605
        submodelElement: unknown,
        options?: Omit<RequestInit, 'body' | 'method'>,
    ): Promise<ApiResponseWrapper<Response>>;

    deleteSubmodelElementByPath(
        submodelId: string,
        idShortPath: string,
        options?: Omit<RequestInit, 'body' | 'method'>,
    ): Promise<ApiResponseWrapper<Response>>;

    /**
     * @summary Retrieves the submodel metadata (submodel in metadata representation)
     * @param {string} submodelId The Submodels unique id
     * @param {*} [options] Override http request option
     * @throws {RequiredError}
     * @memberof SubmodelRepositoryApi
     */
    getSubmodelMetaData(submodelId: string, options?: object): Promise<ApiResponseWrapper<Submodel>>;

    /**
     * @summary Retrieves the submodel elements
     * @param {string} submodelId The Submodels unique id
     * @param {string} idShortPath The ID short path
     * @param {*} [options] Override http request option
     * @throws {RequiredError}
     * @memberof SubmodelRepositoryApi
     */
    getSubmodelElement(
        submodelId: string,
        idShortPath: string,
        options?: object,
    ): Promise<ApiResponseWrapper<MultiLanguageValueOnly>>;

    /**
     * @summary Retrieves the attachment from a submodel element
     * @param submodelId The id of the submodel element is part of
     * @param submodelElementPath The path to the submodel element
     * @param {*} [options] Override http request option
     * @memberof SubmodelRepositoryApi
     */
    getAttachmentFromSubmodelElement(
        submodelId: string,
        submodelElementPath: string,
        options?: object,
    ): Promise<ApiResponseWrapper<Blob>>;
}
