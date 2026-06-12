/**
 * Service for searching companies via the Company Lookup API
 */

import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import logger, { logInfo, logResponseDebug } from 'lib/util/Logger';
import { ICompanyLookupServiceApi } from 'lib/api/company-lookup-api/companyLookupServiceApiInterface';
import { mnestixFetch } from 'lib/api/infrastructure';
import { CompanyLookupServiceApi } from 'lib/api/company-lookup-api/companyLookupServiceApi';
import { envs } from 'lib/env/MnestixEnv';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';

export class CompanyLookupService {
    private constructor(
        protected readonly getCompanyLookupApiClient: (basePath: string) => ICompanyLookupServiceApi | null,
        protected readonly apiUrl: string | null,
        private readonly log: typeof logger = logger,
    ) {}

    static create(log?: typeof logger): CompanyLookupService {
        const companyLookupLogger = log?.child({ Service: 'CompanyLookupService' });
        return new CompanyLookupService(
            (baseUrl) => CompanyLookupServiceApi.create(baseUrl, mnestixFetch(null), log),
            envs.COMPANY_LOOKUP_API_URL || null,
            companyLookupLogger,
        );
    }

    static createNull(companies: Company[] = []): CompanyLookupService {
        return new CompanyLookupService(
            () => CompanyLookupServiceApi.createNull('', companies) as unknown as ICompanyLookupServiceApi,
            '', // Use empty string to indicate null instance
            logger,
        );
    }

    async searchCompaniesByName(searchInput: string): Promise<ApiResponseWrapper<Company[]>> {
        // Skip env var validation for test instances (apiUrl === '')
        // For production instances, validate that the API URL is configured
        if (this.apiUrl !== '' && !this.apiUrl) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Company Lookup API URL is not configured');
        }

        logInfo(this.log, 'searchCompaniesByName', 'Searching companies', { searchInput });

        const client = this.getCompanyLookupApiClient(this.apiUrl || '');
        if (!client) {
            return wrapErrorCode(ApiResultStatus.INTERNAL_SERVER_ERROR, 'Company Lookup API client is not defined');
        }

        const response = await client.getCompaniesByName(searchInput);

        if (!response.isSuccess) {
            logResponseDebug(this.log, 'searchCompaniesByName', 'Company search unsuccessful', response, {
                searchInput,
            });
            return wrapErrorCode(response.errorCode, response.message);
        }

        logResponseDebug(this.log, 'searchCompaniesByName', 'Company search successful', response, {
            searchInput,
            resultCount: response.result.length,
        });

        return wrapSuccess(response.result);
    }
}
