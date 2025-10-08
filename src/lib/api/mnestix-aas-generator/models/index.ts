/* tslint:disable */
/* eslint-disable */
/**
 *
 * @export
 * @interface Aas
 */
export interface Aas {
    /**
     *
     * @type {string}
     * @memberof Aas
     */
    aasId?: string;
    /**
     *
     * @type {string}
     * @memberof Aas
     */
    assetIdShort?: string | null;
}
/**
 *
 * @export
 * @interface AasDataSupplyResult
 */
export interface AasDataSupplyResult {
    /**
     *
     * @type {string}
     * @memberof AasDataSupplyResult
     */
    templateId?: string;
    /**
     *
     * @type {boolean}
     * @memberof AasDataSupplyResult
     */
    success?: boolean;
    /**
     *
     * @type {string}
     * @memberof AasDataSupplyResult
     */
    message?: string;
    /**
     *
     * @type {string}
     * @memberof AasDataSupplyResult
     */
    generatedSubmodelId?: string;
}
/**
 *
 * @export
 * @interface AasIds
 */
export interface AasIds {
    /**
     *
     * @type {string}
     * @memberof AasIds
     */
    assetId?: string;
    /**
     *
     * @type {string}
     * @memberof AasIds
     */
    assetIdShort?: string;
    /**
     *
     * @type {string}
     * @memberof AasIds
     */
    aasId?: string;
    /**
     *
     * @type {string}
     * @memberof AasIds
     */
    aasIdShort?: string;
}
/**
 *
 * @export
 * @interface AddDataToAasRequest
 */
export interface AddDataToAasRequest {
    /**
     *
     * @type {string}
     * @memberof AddDataToAasRequest
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof AddDataToAasRequest
     */
    data: any | null;
    /**
     *
     * @type {Array<string>}
     * @memberof AddDataToAasRequest
     */
    customTemplateIds: Array<string>;
}
/**
 *
 * @export
 * @interface AddDataToAasResponse
 */
export interface AddDataToAasResponse {
    /**
     *
     * @type {Array<AasDataSupplyResult>}
     * @memberof AddDataToAasResponse
     */
    results?: Array<AasDataSupplyResult>;
}
/**
 *
 * @export
 * @interface CreateAasResponse
 */
export interface CreateAasResponse {
    /**
     *
     * @type {string}
     * @memberof CreateAasResponse
     */
    assetId?: string;
    /**
     *
     * @type {string}
     * @memberof CreateAasResponse
     */
    base64EncodedAssetId?: string;
    /**
     *
     * @type {string}
     * @memberof CreateAasResponse
     */
    aasId?: string;
    /**
     *
     * @type {string}
     * @memberof CreateAasResponse
     */
    base64EncodedAasId?: string;
}
/**
 *
 * @export
 * @interface ProblemDetails
 */
export interface ProblemDetails {
    [key: string]: any | any;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    type?: string | null;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    title?: string | null;
    /**
     *
     * @type {number}
     * @memberof ProblemDetails
     */
    status?: number | null;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    detail?: string | null;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    instance?: string | null;
    /**
     *
     * @type {{ [key: string]: any; }}
     * @memberof ProblemDetails
     */
    extensions?: { [key: string]: any };
}
