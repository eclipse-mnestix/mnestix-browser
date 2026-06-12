/**
 * Production implementation of Company Lookup Service API
 */

import { ICompanyLookupServiceApi } from 'lib/api/company-lookup-api/companyLookupServiceApiInterface';
import { Company, CompanyLookupResponse } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { encodeBase64 } from 'lib/util/Base64Util';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logResponseDebug } from 'lib/util/Logger';
import { CompanyLookupServiceApiInMemory } from 'lib/api/company-lookup-api/companyLookupServiceApiInMemory';

export class CompanyLookupServiceApi implements ICompanyLookupServiceApi {
    private constructor(
        protected baseUrl: string,
        protected http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        private readonly log: typeof logger = logger,
    ) {}

    static create(
        baseUrl: string,
        http: {
            fetch<T>(url: RequestInfo, init?: RequestInit): Promise<ApiResponseWrapper<T>>;
        },
        log?: typeof logger,
    ): CompanyLookupServiceApi {
        const companyLookupLogger = log?.child({ Service: 'CompanyLookupServiceApi' });
        return new CompanyLookupServiceApi(baseUrl, http, companyLookupLogger ?? logger);
    }

    static createNull(baseUrl: string, companies: Company[] = []): CompanyLookupServiceApiInMemory {
        return CompanyLookupServiceApiInMemory.create(baseUrl, companies);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getCompaniesByName(name: string): Promise<ApiResponseWrapper<Company[]>> {
        // Encode company name as base64url for the API call
        const encodedName = encodeBase64(name);

        const url = `${this.baseUrl}/api/v2/companies?name=${encodedName}`;

        const response = await this.http.fetch<CompanyLookupResponse>(url);

        if (!response.isSuccess) {
            logResponseDebug(this.log, 'getCompaniesByName', 'Company lookup failed', response, { searchName: name });
            return wrapErrorCode(response.errorCode, `Company lookup failed: ${response.message}`);
        }

        if (!response.result || !response.result.result) {
            return wrapSuccess([]);
        }

        logResponseDebug(this.log, 'getCompaniesByName', 'Company lookup successful', response, {
            searchName: name,
            resultCount: response.result.result.length,
        });

        return wrapSuccess(response.result.result);
    }
}
