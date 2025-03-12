import { base64ToBlob, blobToBase64 } from 'lib/util/Base64Util';

export const ApiResultStatus = {
    SUCCESS: 'SUCCESS',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ApiResultStatus = (typeof ApiResultStatus)[keyof typeof ApiResultStatus];

export type ApiFileDto = {
    fileContent: string;
    fileType: string;
};

const httpStatusMessage: Record<number, ApiResultStatus> = {
    200: ApiResultStatus.SUCCESS,
    400: ApiResultStatus.BAD_REQUEST,
    401: ApiResultStatus.UNAUTHORIZED,
    403: ApiResultStatus.FORBIDDEN,
    404: ApiResultStatus.NOT_FOUND,
    500: ApiResultStatus.INTERNAL_SERVER_ERROR,
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
    const status = getStatus(response.status);

    if (status !== ApiResultStatus.SUCCESS) {
        const result = await response.json().catch((e) => console.warn(e.message));
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
