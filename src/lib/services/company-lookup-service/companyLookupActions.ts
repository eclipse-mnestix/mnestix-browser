'use server';

import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { CompanyLookupService } from 'lib/services/company-lookup-service/CompanyLookupService';

/**
 * Server action to search companies by name
 * @param searchInput The company name to search for
 * @returns Array of matching companies
 */
export async function searchCompaniesByName(searchInput: string): Promise<ApiResponseWrapper<Company[]>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'searchCompaniesByName', 'Requested company search', { searchInput });
    const searcher = CompanyLookupService.create(logger);

    return searcher.searchCompaniesByName(searchInput);
}
