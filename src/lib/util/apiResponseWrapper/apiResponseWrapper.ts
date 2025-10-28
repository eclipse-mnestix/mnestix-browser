import { base64ToBlob, blobToBase64 } from 'lib/util/Base64Util';
import { ApiResultStatus, httpStatusMessage } from 'lib/util/apiResponseWrapper/apiResultStatus';

export type ApiFileDto = {
    fileContent: string;
    fileType: string;
};

const getStatus = (statusCode: number): ApiResultStatus => {
    if (statusCode in httpStatusMessage) return httpStatusMessage[statusCode];
    if (statusCode >= 400 && statusCode < 500) return ApiResultStatus.UNKNOWN_ERROR;
    if (statusCode >= 500) return ApiResultStatus.INTERNAL_SERVER_ERROR;
    return ApiResultStatus.SUCCESS;
};

export type ApiResponseWrapper<T> = ApiResponseWrapperSuccess<T> | ApiResponseWrapperError<T>;

export type ApiResponseWrapperBase = {
    httpStatus?: number;
    httpText?: ApiResultStatus;
};

export type ApiResponseWrapperSuccess<T> = ApiResponseWrapperBase & {
    isSuccess: true;
    result: T;
};

export type ApiResponseWrapperError<T> = ApiResponseWrapperBase & {
    isSuccess: false;
    result?: T;
    errorCode: ApiResultStatus;
    message: string;
};

export function wrapSuccess<T>(
    result: T,
    httpStatus?: number,
    httpText?: ApiResultStatus,
): ApiResponseWrapperSuccess<T> {
    return {
        isSuccess: true,
        result: result,
        httpStatus: httpStatus,
        httpText: httpText,
    };
}

export function wrapErrorCode<T>(
    error: ApiResultStatus,
    message: string,
    httpStatus?: number,
    result?: T,
): ApiResponseWrapperError<T> {
    return {
        isSuccess: false,
        errorCode: error,
        message: message,
        httpStatus: httpStatus,
        result: result,
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
        const status = getStatus(response.status);
        if (response.headers.get('content-length') === '0') {
            return wrapErrorCode(status, response.statusText, response.status);
        }
        const result = await response.json().catch((e) => console.warn(e.message));
        return wrapErrorCode(status, response.statusText, response.status, result);
    }

    const contentType = response.headers.get('Content-Type');

    // Check if it's a binary content type (images, etc.)
    const binaryContentTypes = ['image/', 'application/octet-stream', 'application/pdf', 'video/', 'audio/'];
    const isBinaryContent = binaryContentTypes.some((type) => contentType?.includes(type));

    if (isBinaryContent) {
        const fileFromResponse = await response.blob();
        return wrapSuccess(fileFromResponse as T, response.status, getStatus(response.status));
    }

    // For all other content types, read as text
    const text = await response.text();
    if (!text?.trim()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return wrapSuccess(undefined as any, response.status, getStatus(response.status));
    }

    // Try to parse as JSON if Content-Type says so or if it looks like JSON
    const isJsonContentType = contentType?.includes('application/json');
    const trimmed = text.trim();
    const looksLikeJson = /^[\[{"']|^(-?\d+\.?\d*|true|false|null)$/.test(trimmed);

    if (isJsonContentType || looksLikeJson) {
        try {
            const jsonResult = JSON.parse(text);
            return wrapSuccess(jsonResult as T, response.status, getStatus(response.status));
        } catch (error) {
            if (isJsonContentType) {
                console.warn('Failed to parse JSON response despite application/json Content-Type:', error);
            }
        }
    }

    // Default to Blob for plain text
    const blob = new Blob([text], { type: contentType || 'text/plain' });
    return wrapSuccess(blob as T, response.status, getStatus(response.status));
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
