import { ResponseError } from 'lib/api/mnestix-aas-generator/v1';
import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { mapStatusToResult } from 'lib/util/apiResponseWrapper/apiResultStatus';

export const handleResponseError = async <T>(error: ResponseError): Promise<ApiResponseWrapper<T>> => {
    let parsedBody: T | undefined;

    try {
        const clone = error.response.clone();
        const contentType = clone.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
            parsedBody = (await clone.json()) as T;
        }
    } catch {
        // ignore json parsing errors, we'll return without body information
    }

    return wrapErrorCode(
        mapStatusToResult(error.response.status),
        error.response.statusText,
        error.response.status,
        parsedBody,
    );
};