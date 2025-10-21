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
    assetIdShort?: string;
}
/**
 *
 * @export
 * @interface AasGeneratorErrorInfo
 */
export interface AasGeneratorErrorInfo {
    /**
     *
     * @type {Array<string>}
     * @memberof AasGeneratorErrorInfo
     */
    logs?: Array<string>;
    /**
     *
     * @type {string}
     * @memberof AasGeneratorErrorInfo
     */
    qualifier?: string;
    /**
     *
     * @type {string}
     * @memberof AasGeneratorErrorInfo
     */
    qualifierPath?: string;
}
/**
 *
 * @export
 * @interface AasGeneratorResult
 */
export interface AasGeneratorResult {
    /**
     *
     * @type {string}
     * @memberof AasGeneratorResult
     */
    blueprintId?: string;
    /**
     *
     * @type {boolean}
     * @memberof AasGeneratorResult
     */
    success?: boolean;
    /**
     *
     * @type {string}
     * @memberof AasGeneratorResult
     */
    message?: string;
    /**
     *
     * @type {string}
     * @memberof AasGeneratorResult
     */
    generatedSubmodelId?: string;
    /**
     *
     * @type {AasGeneratorResultErrorInfo}
     * @memberof AasGeneratorResult
     */
    errorInfo?: AasGeneratorResultErrorInfo;
}
/**
 * @type AasGeneratorResultErrorInfo
 *
 * @export
 */
export type AasGeneratorResultErrorInfo = AasGeneratorErrorInfo;
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
    blueprintsIds: Array<string>;
}
/**
 *
 * @export
 * @interface AddDataToAasResponse
 */
export interface AddDataToAasResponse {
    /**
     *
     * @type {Array<AasGeneratorResult>}
     * @memberof AddDataToAasResponse
     */
    results?: Array<AasGeneratorResult>;
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
    type?: string;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    title?: string;
    /**
     *
     * @type {number}
     * @memberof ProblemDetails
     */
    status?: number;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    detail?: string;
    /**
     *
     * @type {string}
     * @memberof ProblemDetails
     */
    instance?: string;
    /**
     *
     * @type {{ [key: string]: any; }}
     * @memberof ProblemDetails
     */
    extensions?: { [key: string]: any };
}
