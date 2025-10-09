/* tslint:disable */
/* eslint-disable */
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
