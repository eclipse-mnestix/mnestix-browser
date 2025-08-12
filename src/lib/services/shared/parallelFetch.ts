import {
    ApiResponseWrapper,
    ApiResponseWrapperSuccess,
    wrapErrorCode,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

export async function fetchFromMultipleEndpoints<T, R>(
    urls: { url: string; infrastructureName: string }[],
    kernel: (url: string) => Promise<ApiResponseWrapper<T>>,
    errorMsg: string,
    mapResult: (result: ApiResponseWrapperSuccess<T>, url: string, infrastructureName: string) => R,
): Promise<ApiResponseWrapper<R[]>> {
    const promises = urls.map(({ url, infrastructureName }) =>
        kernel(url).then((response) => ({ response, url, infrastructureName })),
    );

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter(
        (r) => r.status === 'fulfilled' && r.value.response.isSuccess,
    ) as PromiseFulfilledResult<{ response: ApiResponseWrapperSuccess<T>; url: string; infrastructureName: string }>[];

    if (fulfilled.length === 0) {
        return wrapErrorCode(ApiResultStatus.NOT_FOUND, errorMsg);
    }

    return wrapSuccess(fulfilled.map((f) => mapResult(f.value.response, f.value.url, f.value.infrastructureName)));
}
