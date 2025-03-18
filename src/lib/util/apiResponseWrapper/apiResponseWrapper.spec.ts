import {
    ApiResponseWrapperError,
    wrapErrorCode,
    wrapResponse,
    wrapSuccess,
} from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { expect } from '@jest/globals';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

const options = {
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

describe('', () => {
    it('transforms the http code to a success code', async () => {
        const response = new Response(JSON.stringify('dummy value'), options);
        const successfulResponseWrapper = await wrapResponse(response);
        expect(successfulResponseWrapper.isSuccess).toBe(true);
        if (!successfulResponseWrapper.isSuccess) {
            expect(successfulResponseWrapper.errorCode).toBe(ApiResultStatus.SUCCESS);
        }
    });

    it('return data on success', async () => {
        const data = { name: 'John', age: 42 };
        const responseWrapper = wrapSuccess(data);

        expect(responseWrapper.isSuccess).toBe(true);
        if (responseWrapper.isSuccess) {
            expect(responseWrapper.result).toBe(data);
        }
    });

    it('return data on success even when not defined in code', async () => {
        const data = { name: 'John', age: 42 };
        const response = new Response(JSON.stringify(data), { status: 201, ...options });
        const responseWrapper = await wrapResponse(response);

        expect(responseWrapper.isSuccess).toBe(true);
        if (responseWrapper.isSuccess) {
            expect(responseWrapper.result).toEqual(data);
        }
    });

    it('return failure even when undefined code', async () => {
        const userErrorResponse = await wrapResponse(new Response('{}', { status: 402, ...options }));
        const serverErrorResponse = await wrapResponse(new Response('{}', { status: 502, ...options }));

        expect(userErrorResponse.isSuccess).toBe(false);
        expect((userErrorResponse as ApiResponseWrapperError<unknown>).errorCode).toBe(ApiResultStatus.UNKNOWN_ERROR);
        expect(serverErrorResponse.isSuccess).toBe(false);
        expect((serverErrorResponse as ApiResponseWrapperError<unknown>).errorCode).toBe(ApiResultStatus.BAD_GATEWAY);
    });

    it('keep the error code', async () => {
        const message = 'something bad happened';
        const responseWrapper = wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, message);

        expect(responseWrapper.isSuccess).toBe(false);
        if (!responseWrapper.isSuccess) {
            expect(responseWrapper.result).toBe(undefined);
            expect(responseWrapper.errorCode).toBe(ApiResultStatus.INTERNAL_SERVER_ERROR);
            expect(responseWrapper.message).toBe(message);
        }
    });
});
