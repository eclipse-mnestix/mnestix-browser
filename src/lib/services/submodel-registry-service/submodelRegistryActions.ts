'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { Submodel } from 'lib/api/aas/models';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { mnestixFetch } from 'lib/api/infrastructure';

export async function getSubmodelFromSubmodelDescriptor(url: string): Promise<ApiResponseWrapper<Submodel>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'getSubmodelFromSubmodelDescriptor', 'Requested Submodel', { submodelDescriptor: url });
    const localFetch = mnestixFetch();
    return localFetch.fetch<Submodel>(url, {
        method: 'GET',
    });
}
