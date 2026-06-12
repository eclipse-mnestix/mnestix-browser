/**
 * In-memory implementation of Company Lookup Service API for testing
 */

import { ICompanyLookupServiceApi } from 'lib/api/company-lookup-api/companyLookupServiceApiInterface';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';
import { ApiResponseWrapper, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import ServiceReachable from 'test-utils/TestUtils';

export class CompanyLookupServiceApiInMemory implements ICompanyLookupServiceApi {
    private constructor(
        protected baseUrl: string,
        protected companies: Company[],
        protected reachable: ServiceReachable = ServiceReachable.Yes,
    ) {}

    static create(
        baseUrl: string,
        companies: Company[] = [],
        reachable: ServiceReachable = ServiceReachable.Yes,
    ): CompanyLookupServiceApiInMemory {
        return new CompanyLookupServiceApiInMemory(baseUrl, companies, reachable);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    async getCompaniesByName(name: string): Promise<ApiResponseWrapper<Company[]>> {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (this.reachable === ServiceReachable.No) {
            return {
                isSuccess: false,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message: 'Service unreachable',
            };
        }

        // If empty search, return all companies
        if (!name || name.trim() === '') {
            return wrapSuccess(this.companies);
        }

        // Simple in-memory search (case-insensitive, partial match on name and domain)
        const searchTerm = name.toLowerCase();
        const results = this.companies.filter(
            (company) =>
                company.name.toLowerCase().includes(searchTerm) || company.domain.toLowerCase().includes(searchTerm),
        );

        return wrapSuccess(results);
    }
}
