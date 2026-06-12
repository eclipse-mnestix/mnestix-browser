/**
 * Interface for Company Lookup Service API
 */

import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { ApiResponseWrapper } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

export interface ICompanyLookupServiceApi {
    /**
     * Search companies by name
     * @param name The company name to search for (will be base64url encoded)
     * @returns Promise with array of matching companies
     */
    getCompaniesByName(name: string): Promise<ApiResponseWrapper<Company[]>>;

    /**
     * Get the base URL of this API client
     */
    getBaseUrl(): string;
}
