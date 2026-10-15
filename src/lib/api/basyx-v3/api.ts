/* eslint-disable */
// TODO MNES-1605 remove url lib together with this file
import url from 'url';
import { Configuration } from './configuration';
import { AssetAdministrationShell, Query, QueryResultAssetAdministrationShellResultInner, QueryResultSubmodelResultInner, Reference, Submodel } from 'lib/api/aas/models';
import { encodeBase64 } from 'lib/util/Base64Util';
import {
    IAssetAdministrationShellRepositoryApi,
    ISubmodelRepositoryApi,
    ISerializationApi,
    SubmodelElementValue,
} from 'lib/api/basyx-v3/apiInterface';
import {
    AssetAdministrationShellRepositoryApiInMemory,
    SubmodelRepositoryApiInMemory,
} from 'lib/api/basyx-v3/apiInMemory';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ServiceReachable } from 'test-utils/TestUtils';
import { MultiLanguageValueOnly, PaginationData } from 'lib/api/basyx-v3/types';

export type FetchAPI = {
    fetch: <T>(url: RequestInfo, init?: RequestInit) => Promise<ApiResponseWrapper<T>>;
};

export interface FetchArgs {
    url: string;
    options: any;
}

export class RequiredError extends Error {
    name: 'RequiredError';

    constructor(
        public field: string,
        msg?: string,
    ) {
        super(msg);
    }
}

/**
 * Encodes a client-supplied idShort path for safe insertion into a request path.
 *
 * Both guards are needed. Percent-encoding each `/`-delimited segment stops `?`/`#`/reserved characters from
 * re-shaping the URL, but `encodeURIComponent` deliberately leaves `.` untouched — so dot segments have to be
 * refused explicitly. Without that, a path such as `../../../actuator/env` survives `url.format` (Node's legacy
 * API does not collapse dot segments) and is then normalized by `fetch`, redirecting the request to an operator
 * endpoint the caller chose — with the infrastructure's credentials already attached.
 */
function encodeSubmodelElementPath(submodelElementPath: string): string {
    const segments = submodelElementPath.split('/');
    if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
        throw new RequiredError(
            'submodelElementPath',
            'Invalid submodelElementPath: empty or relative path segments are not allowed.',
        );
    }
    return segments.map(encodeURIComponent).join('/');
}

/**
 * AssetAdministrationShellRepositoryApi - object-oriented interface
 * @class AssetAdministrationShellRepositoryApi
 */
export class AssetAdministrationShellRepositoryApi implements IAssetAdministrationShellRepositoryApi {
    private constructor(
        private basePath: string,
        private http: {
            fetch<T>(url: RequestInfo | URL, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        private configuration?: Configuration | undefined,
    ) {}

    static create(
        baseUrl: string,
        http: FetchAPI,
        configuration?: Configuration,
    ): AssetAdministrationShellRepositoryApi {
        return new AssetAdministrationShellRepositoryApi(baseUrl, http, configuration);
    }

    static createNull(
        baseUrl: string,
        shellsInRepositories: AssetAdministrationShell[],
        reachable: ServiceReachable = ServiceReachable.Yes,
        queryEndpointsSupported = true,
    ): AssetAdministrationShellRepositoryApiInMemory {
        return new AssetAdministrationShellRepositoryApiInMemory(
            baseUrl,
            shellsInRepositories,
            reachable,
            queryEndpointsSupported,
        );
    }

    getBaseUrl(): string {
        return this.basePath;
    }

    async getAllAssetAdministrationShells(limit?: number, cursor?: string, options?: any) {
        return AssetAdministrationShellRepositoryApiFp(this.configuration).getAllAssetAdministrationShells(
            limit,
            cursor,
            options,
        )(this.http, this.basePath);
    }

    async getAssetAdministrationShellById(aasId: string, options?: any) {
        return AssetAdministrationShellRepositoryApiFp(this.configuration).getAssetAdministrationShellById(
            aasId,
            options,
        )(this.http, this.basePath);
    }

    async getSubmodelReferencesFromShell(aasId: string, options?: any) {
        return AssetAdministrationShellRepositoryApiFp(this.configuration).getSubmodelReferencesFromShell(
            aasId,
            options,
        )(this.http, this.basePath);
    }

    async getThumbnailFromShell(aasId: string, options?: any) {
        return AssetAdministrationShellRepositoryApiFp(this.configuration).getThumbnailFromAssetInformation(
            aasId,
            options,
        )(this.http, this.basePath);
    }

    async queryAssetAdministrationShells(
        query: Query,
        limit?: number,
        cursor?: string,
        options: Omit<RequestInit, 'body' | 'method'> = {},
    ): Promise<ApiResponseWrapper<PaginationData<QueryResultAssetAdministrationShellResultInner[]>>> {
        // `Object.assign` only copies a plain object's own enumerable properties, so it silently drops
        // every entry of a `Headers` instance or a header-tuple array (both valid `RequestInit.headers`
        // shapes) instead of merging them — a caller-supplied Authorization header would vanish. Going
        // through `Headers` normalizes all three accepted shapes and also de-dupes a caller's
        // differently-cased 'content-type' against our default instead of sending both.
        const requestHeaders = new Headers(options.headers);
        if (!requestHeaders.has('Content-Type')) requestHeaders.set('Content-Type', 'application/json');
        options.headers = Object.fromEntries(requestHeaders.entries());
        const queryParams = new URLSearchParams();
        if (limit !== undefined) queryParams.set('limit', String(limit));
        if (cursor) queryParams.set('cursor', cursor);
        const reqOptions = {
            ...options,
            body: JSON.stringify(query),
            method: 'POST',
        };
        // basePath is a client-supplied, egress-guarded repository URL (see AasRepositoryService):
        // the guard only validates its host, not its path/query/fragment, so appending the endpoint
        // via naive string concatenation lets a crafted basePath (e.g. ending in "#") push "/query/shells"
        // into the URL fragment, which is never sent over the wire — the request would then silently hit
        // "/shells" (the repository's create-shell endpoint) instead. Building on the parsed URL and
        // clearing search/hash keeps the intended request path regardless of what basePath contains.
        const requestUrl = new URL(this.basePath);
        requestUrl.pathname = `${requestUrl.pathname.replace(/\/+$/, '')}/query/shells`;
        requestUrl.search = queryParams.toString();
        requestUrl.hash = '';
        return this.http.fetch<PaginationData<QueryResultAssetAdministrationShellResultInner[]>>(
            requestUrl.toString(),
            reqOptions,
        );
    }

}

/**
 * AssetAdministrationShellRepositoryApi - functional programming interface
 */
export const AssetAdministrationShellRepositoryApiFp = function (configuration?: Configuration) {
    return {
        getAllAssetAdministrationShells(limit: number | undefined, cursor: string | undefined, options: any) {
            return async (requestHandler: FetchAPI, basePath: string) => {
                const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
                const localVarHeaderParameter = {
                    Accept: 'application/json',
                } as any;

                localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options?.headers);

                const queryParams = new URLSearchParams();
                if (limit !== undefined) queryParams.set('limit', String(limit));
                if (cursor) queryParams.set('cursor', cursor);

                return await requestHandler.fetch<PaginationData<AssetAdministrationShell[]>>(
                    basePath + `/shells?${queryParams.toString()}`,
                    localVarRequestOptions,
                );
            };
        },

        /**
         * @summary Retrieves a specific Asset Administration Shell from the Asset Administration Shell repository
         * @param {string} aasId The Asset Administration Shell&#x27;s unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getAssetAdministrationShellById(aasId: string, options?: any) {
            const localVarFetchArgs = AssetAdministrationShellRepositoryApiFetchParamCreator(
                configuration,
            ).getAssetAdministrationShellById(aasId, options);
            return async (requestHandler: FetchAPI, basePath: string) => {
                return requestHandler.fetch<AssetAdministrationShell>(
                    basePath + localVarFetchArgs.url,
                    localVarFetchArgs.options,
                );
            };
        },
        /**
         *
         * @summary Retrieves all SubmodelsReferences from the Asset Administration Shell
         * @param {string} aasId The Asset Administration Shell&#x27;s unique id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSubmodelReferencesFromShell(aasId: string, options?: any) {
            const localVarFetchArgs = AssetAdministrationShellRepositoryApiFetchParamCreator(
                configuration,
            ).getSubmodelReferencesFromShell(aasId, options);
            return async (requestHandler: FetchAPI, basePath: string) => {
                return requestHandler.fetch<PaginationData<Reference[]>>(
                    basePath + localVarFetchArgs.url,
                    localVarFetchArgs.options,
                );
            };
        },

        /**
         * @summary Retrieves the thumbnail from the Asset Administration Shell.
         * @param aasId aasId The ID of the Asset Administration Shell.
         * @param options {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getThumbnailFromAssetInformation(aasId: string, options?: any) {
            const localVarFetchArgs = AssetAdministrationShellRepositoryApiFetchParamCreator(
                configuration,
            ).getThumbnailFromAssetInformation(aasId, options);
            return async (requestHandler: FetchAPI, basePath: string) => {
                return requestHandler.fetch<Blob>(basePath + localVarFetchArgs.url, localVarFetchArgs.options);
            };
        },

    };
};

/**
 * AssetAdministrationShellRepositoryApi - fetch parameter creator
 */
export const AssetAdministrationShellRepositoryApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * @summary Retrieves a specific Asset Administration Shell from the Asset Administration Shell repository
         * @param {string} aasId The Asset Administration Shell&#x27;s unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getAssetAdministrationShellById(aasId: string, options: any = {}): FetchArgs {
            // verify required parameter 'aasId' is not null or undefined
            if (aasId === null || aasId === undefined) {
                throw new RequiredError(
                    'aasId',
                    'Required parameter aasId was null or undefined when calling getAssetAdministrationShellById.',
                );
            }
            const localVarPath = `/shells/{aasId}`.replace(`{aasId}`, encodeURIComponent(String(aasId)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         *
         * @summary Retrieves all Submodels from the  Asset Administration Shell
         * @param {string} aasId The Asset Administration Shell&#x27;s unique id
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getSubmodelReferencesFromShell(aasId: string, options: any = {}): FetchArgs {
            // verify required parameter 'aasId' is not null or undefined
            if (aasId === null || aasId === undefined) {
                throw new RequiredError(
                    'aasId',
                    'Required parameter aasId was null or undefined when calling shellRepoGetSubmodelsFromShell.',
                );
            }
            const localVarPath = `/shells/{aasId}/submodel-refs`.replace(`{aasId}`, encodeURIComponent(String(aasId)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },

        /**
         * @summary Retrieves the thumbnail from the Asset Administration Shell.
         * @param aasId aasId The ID of the Asset Administration Shell.
         * @param options {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getThumbnailFromAssetInformation(aasId: string, options: any = {}): FetchArgs {
            // verify required parameter 'aasId' is not null or undefined
            if (aasId === null || aasId === undefined) {
                throw new RequiredError(
                    'aasId',
                    'Required parameter aasId was null or undefined when calling shellRepoGetSubmodelsFromShell.',
                );
            }
            const localVarPath = `/shells/{aasId}/asset-information/thumbnail`.replace(
                `{aasId}`,
                encodeBase64(String(aasId)),
            );
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};

/**
 * SubmodelRepositoryApi - object-oriented interface
 * @class SubmodelRepositoryApi
 */
export class SubmodelRepositoryApi implements ISubmodelRepositoryApi {
    private constructor(
        private baseUrl: string,
        private http: FetchAPI,
        private configuration?: Configuration,
    ) {}

    static create(baseUrl: string, http: FetchAPI, configuration?: Configuration): SubmodelRepositoryApi {
        return new SubmodelRepositoryApi(baseUrl, http, configuration);
    }

    static createNull(
        basePath: string,
        submodelsInRepository: Submodel[],
        reachable: ServiceReachable = ServiceReachable.Yes,
        queryEndpointsSupported = true,
    ): SubmodelRepositoryApiInMemory {
        return new SubmodelRepositoryApiInMemory(basePath, submodelsInRepository, reachable, queryEndpointsSupported);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getSubmodelById(submodelId: string, options?: any): Promise<ApiResponseWrapper<Submodel>> {
        return SubmodelRepositoryApiFp(this.configuration).getSubmodelById(submodelId, options)(
            this.http,
            this.baseUrl,
        );
    }

    async getSubmodelByIdValueOnly(
        submodelId: string,
        options?: any,
    ): Promise<ApiResponseWrapper<SubmodelElementValue>> {
        return SubmodelRepositoryApiFp(this.configuration).getSubmodelByIdValueOnly(submodelId, options)(
            this.http,
            this.baseUrl,
        );
    }

    async deleteSubmodelElementByPath(
        submodelId: string,
        idShortPath: string,
        options: Omit<RequestInit, 'body' | 'method'> = {},
    ): Promise<ApiResponseWrapper<Response>> {
        options.headers = Object.assign({}, {}, options.headers);
        const url = `${this.baseUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements/${idShortPath}`;
        const reqOptions = {
            ...options,
            method: 'DELETE',
        };
        return this.http.fetch<Response>(url, reqOptions);
    }

    async postSubmodelElement(
        submodelId: string,
        submodelElement: unknown,
        options: Omit<RequestInit, 'body' | 'method'> = {},
    ): Promise<ApiResponseWrapper<Response>> {
        options.headers = Object.assign(
            {},
            {
                'Content-Type': 'application/json',
            },
            options.headers,
        );
        const url = `${this.baseUrl}/submodels/${encodeBase64(submodelId)}/submodel-elements`;
        const reqOptions = {
            ...options,
            body: JSON.stringify(submodelElement),
            method: 'POST',
        };
        return this.http.fetch<Response>(url, reqOptions);
    }

    async getSubmodelMetaData(submodelId: string, options?: object): Promise<ApiResponseWrapper<Submodel>> {
        return SubmodelRepositoryApiFp(this.configuration).getSubmodelMetadataById(submodelId, options)(
            this.http,
            this.baseUrl,
        );
    }

    async getSubmodelElement(
        submodelId: string,
        idShortPath: string,
        options?: object,
    ): Promise<ApiResponseWrapper<MultiLanguageValueOnly>> {
        return SubmodelRepositoryApiFp(this.configuration).getSubmodelElement(
            submodelId,
            idShortPath,
            options,
        )(this.http, this.baseUrl);
    }

    async getAttachmentFromSubmodelElement(
        submodelId: string,
        submodelElementPath: string,
        options?: any,
    ): Promise<ApiResponseWrapper<Blob>> {
        return SubmodelRepositoryApiFp(this.configuration).getAttachmentFromSubmodelElement(
            submodelId,
            submodelElementPath,
            options,
        )(this.http, this.baseUrl);
    }

    async querySubmodels(
        query: Query,
        limit?: number,
        cursor?: string,
        options: Omit<RequestInit, 'body' | 'method'> = {},
    ): Promise<ApiResponseWrapper<PaginationData<QueryResultSubmodelResultInner[]>>> {
        // `Object.assign` only copies a plain object's own enumerable properties, so it silently drops
        // every entry of a `Headers` instance or a header-tuple array (both valid `RequestInit.headers`
        // shapes) instead of merging them — a caller-supplied Authorization header would vanish. Going
        // through `Headers` normalizes all three accepted shapes and also de-dupes a caller's
        // differently-cased 'content-type' against our default instead of sending both.
        const requestHeaders = new Headers(options.headers);
        if (!requestHeaders.has('Content-Type')) requestHeaders.set('Content-Type', 'application/json');
        options.headers = Object.fromEntries(requestHeaders.entries());
        const queryParams = new URLSearchParams();
        if (limit !== undefined) queryParams.set('limit', String(limit));
        if (cursor) queryParams.set('cursor', cursor);
        const reqOptions = {
            ...options,
            body: JSON.stringify(query),
            method: 'POST',
        };
        // baseUrl is a client-supplied, egress-guarded repository URL (see submodelRepositoryActions):
        // the guard only validates its host, not its path/query/fragment, so appending the endpoint
        // via naive string concatenation lets a crafted baseUrl (e.g. ending in "#") push "/query/submodels"
        // into the URL fragment, which is never sent over the wire — the request would then silently hit
        // "/submodels" (the repository's create-submodel endpoint) instead. Building on the parsed URL and
        // clearing search/hash keeps the intended request path regardless of what baseUrl contains.
        const requestUrl = new URL(this.baseUrl);
        requestUrl.pathname = `${requestUrl.pathname.replace(/\/+$/, '')}/query/submodels`;
        requestUrl.search = queryParams.toString();
        requestUrl.hash = '';
        return this.http.fetch<PaginationData<QueryResultSubmodelResultInner[]>>(requestUrl.toString(), reqOptions);
    }

}

/**
 * SubmodelRepositoryApi - functional programming interface
 */
export const SubmodelRepositoryApiFp = function (configuration?: Configuration) {
    return {
        /**
         * @summary Retrieves the submodel
         * @param {string} submodelId The Submodels unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getSubmodelById(submodelId: string, options?: any) {
            const localVarFetchArgs = SubmodelRepositoryApiFetchParamCreator(configuration).getSubmodelById(
                encodeBase64(submodelId),
                options,
            );
            return async (requestHandler: FetchAPI, baseUrl: string) => {
                return requestHandler.fetch<Submodel>(baseUrl + localVarFetchArgs.url, localVarFetchArgs.options);
            };
        },

        getSubmodelByIdValueOnly(submodelId: string, options?: any) {
            const localVarFetchArgs = SubmodelRepositoryApiFetchParamCreator(configuration).getSubmodelByIdValueOnly(
                encodeBase64(submodelId),
                options,
            );
            return async (requestHandler: FetchAPI, baseUrl: string) => {
                return requestHandler.fetch<SubmodelElementValue>(
                    baseUrl + localVarFetchArgs.url,
                    localVarFetchArgs.options,
                );
            };
        },
        /**
         * @summary Retrieves the submodel metadata
         * @param {string} submodelId The Submodels unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getSubmodelMetadataById(submodelId: string, options?: any) {
            const localVarFetchArgs = SubmodelRepositoryApiFetchParamCreator(configuration).getSubmodelMetaDataById(
                encodeBase64(submodelId),
                options,
            );
            return async (requestHandler: FetchAPI, baseUrl: string) => {
                return requestHandler.fetch<Submodel>(baseUrl + localVarFetchArgs.url, localVarFetchArgs.options);
            };
        },
        /**
         * @summary Retrieves the submodel metadata
         * @param {string} submodelId The Submodels unique id
         * @param idShortPath the ID short path
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getSubmodelElement(submodelId: string, idShortPath: string, options?: any) {
            const localVarFetchArgs = SubmodelRepositoryApiFetchParamCreator(configuration).getSubmodelElement(
                encodeBase64(submodelId),
                idShortPath,
                options,
            );
            return async (requestHandler: FetchAPI, baseUrl: string) => {
                return requestHandler.fetch<MultiLanguageValueOnly>(
                    baseUrl + localVarFetchArgs.url,
                    localVarFetchArgs.options,
                );
            };
        },
        /**
         * @summary Retrieves the attachment from a submodel element
         * @param submodelId The id of the submodel, the submodel element is part of
         * @param submodelElementPath The path to the submodel element
         * @param {*} [options] Override http request option
         */
        getAttachmentFromSubmodelElement(submodelId: string, submodelElementPath: string, options?: any) {
            const localVarFetchArgs = SubmodelRepositoryApiFetchParamCreator(
                configuration,
            ).getAttachmentFromSubmodelElement(submodelId, submodelElementPath, options);
            return async (requestHandler: FetchAPI, baseUrl: string) => {
                return requestHandler.fetch<Blob>(baseUrl + localVarFetchArgs.url, localVarFetchArgs.options);
            };
        },

    };
};

/**
 * SubmodelRepositoryApi - fetch parameter creator
 */
export const SubmodelRepositoryApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * @summary Retrieves the meta data of a submodel
         * @param {string} submodelId The Submodels unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getSubmodelMetaDataById(submodelId: string, options: any = {}): FetchArgs {
            // verify required parameter 'submodelId' is not null or undefined
            if (submodelId === null || submodelId === undefined) {
                throw new RequiredError(
                    'submodelId',
                    'Required parameter submodelId was null or undefined when calling getSubmodelMetaDataById.',
                );
            }
            const localVarPath = `/submodels/{submodelId}/$metadata?level=core`.replace(
                `{submodelId}`,
                encodeURIComponent(String(submodelId)),
            );
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * @summary Retrieves the submodel
         * @param {string} submodelId The Submodels unique id
         * @param {*} [options] Override http request option
         * @throws {RequiredError}
         */
        getSubmodelById(submodelId: string, options: any = {}): FetchArgs {
            // verify required parameter 'submodelId' is not null or undefined
            if (submodelId === null || submodelId === undefined) {
                throw new RequiredError(
                    'submodelId',
                    'Required parameter submodelId was null or undefined when calling getSubmodelById.',
                );
            }
            const localVarPath = `/submodels/{submodelId}`.replace(
                `{submodelId}`,
                encodeURIComponent(String(submodelId)),
            );
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },

        getSubmodelByIdValueOnly(submodelId: string, options: any = {}): FetchArgs {
            // verify required parameter 'submodelId' is not null or undefined
            if (submodelId === null || submodelId === undefined) {
                throw new RequiredError(
                    'submodelId',
                    'Required parameter submodelId was null or undefined when calling getSubmodelById.',
                );
            }
            const localVarPath = `/submodels/{submodelId}/$value`.replace(
                `{submodelId}`,
                encodeURIComponent(String(submodelId)),
            );
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * @summary Retrieves the attachment from a submodel element
         * @param submodelId The id of the submodel element is part of
         * @param submodelElementPath The path to the submodel element
         * @param {*} [options] Override http request option
         */
        getAttachmentFromSubmodelElement(
            submodelId: string,
            submodelElementPath: string,
            options: any = {},
        ): FetchArgs {
            // verify required parameter 'submodelId' is not null or undefined
            if (submodelId === null || submodelId === undefined) {
                throw new RequiredError(
                    'submodelId',
                    'Required parameter submodelId was null or undefined when calling getSubmodelById.',
                );
            }
            const localVarPath = `/submodels/{submodelId}/submodel-elements/{submodelElementPath}/attachment`
                .replace(`{submodelId}`, encodeURIComponent(String(encodeBase64(submodelId))))
                .replace(`{submodelElementPath}`, encodeSubmodelElementPath(submodelElementPath));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },

        getSubmodelElement(submodelId: string, idShortPath: string, options: any = {}): FetchArgs {
            // verify required parameter 'submodelId' is not null or undefined
            if (submodelId === null || submodelId === undefined) {
                throw new RequiredError(
                    'submodelId',
                    'Required parameter submodelId was null or undefined when calling getSubmodelMetaDataById.',
                );
            }
            const localVarPath = `/submodels/{submodelId}/submodel-elements/{idShortPath}/$value`
                .replace(`{submodelId}`, encodeURIComponent(String(submodelId)))
                .replace(`{idShortPath}`, String(idShortPath));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};

/**
 * SerializationApi - object-oriented interface
 * @class SerializationApi
 */
export class SerializationApi implements ISerializationApi {
    private constructor(
        private basePath: string,
        private http: FetchAPI,
        private configuration?: Configuration,
    ) {}

    static create(baseUrl: string, http: FetchAPI, configuration?: Configuration): SerializationApi {
        return new SerializationApi(baseUrl, http, configuration);
    }

    getBaseUrl(): string {
        return this.basePath;
    }

    async downloadAAS(
        aasId: string | string[],
        submodelIds: string[],
        includeConceptDescriptions: boolean = true,
        outputFormat: 'xml' | 'json' | 'aasx' = 'aasx',
        options?: object,
    ): Promise<ApiResponseWrapper<Blob>> {
        return SerializationApiFp(this.configuration).downloadAAS(
            aasId,
            submodelIds,
            includeConceptDescriptions,
            outputFormat,
            options,
        )(this.http, this.basePath);
    }
}

/**
 * SerializationApi - functional programming interface
 */
export const SerializationApiFp = function (configuration?: Configuration) {
    return {
        /**
         * @summary Downloads the Asset Administration Shell (AAS) and its submodels.
         * @param {string | string[]} aasId - The ID(s) of the Asset Administration Shell(s) to be downloaded.
         * @param {string[]} submodelIds - An array of IDs of the submodels to be included in the download.
         * @param {boolean} [includeConceptDescriptions=true] - Optional. Whether to include concept descriptions in the download.
         * @param {'xml' | 'json' | 'aasx'} [outputFormat='aasx'] - The format of the downloaded AAS.
         * @param {object} [options] - Optional. Additional options to override the default HTTP request settings.
         * @throws {RequiredError}
         */
        downloadAAS(
            aasId: string | string[],
            submodelIds: string[],
            includeConceptDescriptions: boolean = true,
            outputFormat: 'xml' | 'json' | 'aasx' = 'aasx',
            options?: any,
        ) {
            return async (requestHandler: FetchAPI, basePath: string) => {
                const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
                
                // Set appropriate Accept header based on output format
                let acceptHeader = 'application/asset-administration-shell-package+xml';
                if (outputFormat === 'json') {
                    acceptHeader = 'application/json';
                } else if (outputFormat === 'xml') {
                    acceptHeader = 'application/xml';
                }
                
                const localVarHeaderParameter = {
                    Accept: acceptHeader,
                };

                localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options?.headers);

                const aasIdsEncoded = Array.isArray(aasId)
                    ? aasId.map((id) => encodeBase64(id))
                    : [encodeBase64(aasId)];
                const aasIdsQuery = aasIdsEncoded.map((id) => `aasIds=${id}`).join('&');
                const submodelIdsEncoded = submodelIds.map((id) => encodeBase64(id));
                const submodelIdsQuery = submodelIdsEncoded.map((id) => `submodelIds=${id}`).join('&');
                
                const url = `${basePath}/serialization?${aasIdsQuery}&${submodelIdsQuery}&includeConceptDescriptions=${includeConceptDescriptions}&outputFormat=${outputFormat}`;

                return await requestHandler.fetch<Blob>(url, localVarRequestOptions);
            };
        },
    };
};
