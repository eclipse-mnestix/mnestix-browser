import { base64ToBlob, blobToBase64 } from 'lib/util/Base64Util';
import { ApiResultStatus, httpStatusMessage } from 'lib/util/apiResponseWrapper/apiResultStatus';
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',

export type ApiFileDto = {
    fileContent: string;
    fileType: string;
    400: ApiResultStatus.BAD_REQUEST,
    403: ApiResultStatus.FORBIDDEN,
};

const getStatus = (statusCode: number): ApiResultStatus => {
    if (statusCode in httpStatusMessage) return httpStatusMessage[statusCode];
    if (statusCode >= 400 && statusCode < 500) return ApiResultStatus.UNKNOWN_ERROR;
    if (statusCode >= 500) return ApiResultStatus.INTERNAL_SERVER_ERROR;
    return ApiResultStatus.SUCCESS;
};

export type ApiResponseWrapper<T> = ApiResponseWrapperSuccess<T> | ApiResponseWrapperError<T>;

export type ApiResponseWrapperSuccess<T> = {
    isSuccess: true;
    result: T;
};

export type ApiResponseWrapperError<T> = {
    isSuccess: false;
    result?: T;
    errorCode: ApiResultStatus;
    message: string;
};

export function wrapSuccess<T>(result: T): ApiResponseWrapperSuccess<T> {
    return {
        isSuccess: true,
        result: result,
    };
}

export function wrapErrorCode<T>(error: ApiResultStatus, message: string, result?: T): ApiResponseWrapperError<T> {
    return {
        isSuccess: false,
        result: result,
        errorCode: error,
        message: message,
    };
}

export async function wrapFile(content: Blob): Promise<ApiResponseWrapperSuccess<ApiFileDto>> {
    return {
        isSuccess: true,
        result: await mapBlobToFileDto(content),
    };
}

export async function wrapResponse<T>(response: Response): Promise<ApiResponseWrapper<T>> {
    if (!(response.status >= 200 && response.status < 300)) {

        const result = await response.json().catch((e) => console.warn(e.message));
        const status = getStatus(response.status);
        return wrapErrorCode(status, response.statusText, result);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType || contentType.includes('application/json')) {
        const result = await response.json().catch((e) => console.warn(e.message));
        return wrapSuccess(result);
    }

    const fileFromResponse = await response.blob();
    return wrapSuccess(fileFromResponse as T);
}

export function mapFileDtoToBlob(fileDto: ApiFileDto): Blob {
    return base64ToBlob(fileDto.fileContent, fileDto.fileType);
}

export async function mapBlobToFileDto(content: Blob): Promise<ApiFileDto> {
    return {
        fileContent: await blobToBase64(content),
        fileType: content.type,
    };
}
