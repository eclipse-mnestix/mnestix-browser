import { ApiResponseWrapper, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within the timeout,
 * it will reject with a timeout error.
 *
 * @param promise The promise to wrap
 * @param timeoutMs The timeout in milliseconds
 * @param timeoutMessage Optional custom timeout message
 * @returns A promise that rejects if timeout is exceeded
 */
export function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string = 'Operation timed out',
): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs),
        ),
    ]);
}

/**
 * Wraps an API response promise with a timeout. If the promise doesn't resolve within the timeout,
 * it will return an error response.
 *
 * @param promise The promise to wrap
 * @param timeoutMs The timeout in milliseconds
 * @param timeoutMessage Optional custom timeout message
 * @returns A promise that resolves to an error response if timeout is exceeded
 */
export async function withTimeoutResponse<T>(
    promise: Promise<ApiResponseWrapper<T>>,
    timeoutMs: number,
    timeoutMessage: string = 'Repository request timed out',
): Promise<ApiResponseWrapper<T>> {
    try {
        return await withTimeout(promise, timeoutMs, timeoutMessage);
    } catch (error) {
        if (error instanceof Error && error.message === timeoutMessage) {
            return wrapErrorCode<T>(
                ApiResultStatus.GATEWAY_TIMEOUT,
                timeoutMessage,
            );
        }
        throw error;
    }
}
