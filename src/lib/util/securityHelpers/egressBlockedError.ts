import { assertEgressAllowed } from './repositoryFetchGuard';
import { ApiResponseWrapperError, wrapErrorCode } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';

/**
 * Runs the egress guard and translates a block into a FORBIDDEN response wrapper instead of throwing.
 * Returns `undefined` when egress is allowed, so call sites read as a single early return:
 *
 * ```ts
 * const blocked = await egressBlockedError(repository.url, repository.infrastructureName);
 * if (blocked) return blocked;
 * ```
 *
 * Callers that return a DTO rather than an `ApiResponseWrapper` embed it instead,
 * e.g. `if (blocked) return { success: false, error: blocked };`
 *
 * Lives outside `repositoryFetchGuard` on purpose: that module stays free of the API-response layer,
 * and tests that mock the guard keep controlling this helper's outcome through `assertEgressAllowed`.
 */
export async function egressBlockedError(
    url: string,
    infrastructureName: string,
): Promise<ApiResponseWrapperError<never> | undefined> {
    try {
        await assertEgressAllowed(url, infrastructureName);
        return undefined;
    } catch (e) {
        return wrapErrorCode<never>(ApiResultStatus.FORBIDDEN, (e as Error).message);
    }
}
