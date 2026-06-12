/**
 * Unit tests for CompanyLookupService
 */

import { CompanyLookupService } from 'lib/services/company-lookup-service/CompanyLookupService';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';

describe('CompanyLookupService', () => {
    const mockCompanies: Company[] = [
        {
            name: 'Siemens AG',
            domain: 'siemens.com',
            endpoints: [
                {
                    protocolInformation: {
                        href: 'https://registry.siemens.com',
                        endpointProtocol: 'HTTPS',
                    },
                    interface: 'AAS-REGISTRY-3.1',
                },
            ],
        },
        {
            name: 'Festo',
            domain: 'festo.com',
            endpoints: [
                {
                    protocolInformation: {
                        href: 'https://discovery.festo.com',
                        endpointProtocol: 'HTTPS',
                    },
                    interface: 'AAS-DISCOVERY-3.0',
                },
            ],
        },
    ];

    describe('createNull', () => {
        it('should create a null instance for testing', () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            expect(service).toBeDefined();
        });
    });

    describe('searchCompaniesByName', () => {
        it('should search companies by name (null instance)', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result = await service.searchCompaniesByName('Siemens');

            expect(result.isSuccess).toBe(true);
            expect(result.result).toHaveLength(1);
            expect(result.result[0].name).toBe('Siemens AG');
        });

        it('should return all companies for empty search', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result = await service.searchCompaniesByName('');

            expect(result.isSuccess).toBe(true);
            expect(result.result).toHaveLength(2);
        });

        it('should find multiple companies with partial matches', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result = await service.searchCompaniesByName('s');

            expect(result.isSuccess).toBe(true);
            expect(result.result.length).toBeGreaterThanOrEqual(1);
        });

        it('should return empty array when no matches found', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result = await service.searchCompaniesByName('NonExistentCompany');

            expect(result.isSuccess).toBe(true);
            expect(result.result).toHaveLength(0);
        });

        it('should handle case-insensitive search', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result1 = await service.searchCompaniesByName('siemens');
            const result2 = await service.searchCompaniesByName('SIEMENS');
            const result3 = await service.searchCompaniesByName('Siemens');

            expect(result1.result).toHaveLength(1);
            expect(result2.result).toHaveLength(1);
            expect(result3.result).toHaveLength(1);
        });

        it('should search by domain', async () => {
            const service = CompanyLookupService.createNull(mockCompanies);
            const result = await service.searchCompaniesByName('festo.com');

            expect(result.isSuccess).toBe(true);
            expect(result.result).toHaveLength(1);
            expect(result.result[0].domain).toBe('festo.com');
        });
    });
});
