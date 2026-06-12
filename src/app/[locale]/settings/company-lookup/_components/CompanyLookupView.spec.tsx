/**
 * Component tests for CompanyLookupView
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompanyLookupView } from 'app/[locale]/settings/company-lookup/_components/CompanyLookupView';
import * as companyLookupActions from 'lib/services/company-lookup-service/companyLookupActions';
import * as infrastructureDatabaseActions from 'lib/services/database/infrastructureDatabaseActions';
import { Company } from 'lib/api/company-lookup-api/companyLookupServiceApiTypes';

// Mock the server actions
jest.mock('lib/services/company-lookup-service/companyLookupActions');
jest.mock('lib/services/database/infrastructureDatabaseActions');
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock useTranslations
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

describe('CompanyLookupView', () => {
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
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render search input and button', () => {
        render(<CompanyLookupView />);

        expect(screen.getByPlaceholderText('searchPlaceholder')).toBeInTheDocument();
        expect(screen.getByText('searchButton')).toBeInTheDocument();
    });

    it('should render back button', () => {
        render(<CompanyLookupView />);

        const backButton = screen.getByText('backButton');
        expect(backButton).toBeInTheDocument();
    });

    it('should display title', () => {
        render(<CompanyLookupView />);

        expect(screen.getByText('title')).toBeInTheDocument();
    });

    it('should call searchCompaniesByName when search button is clicked', async () => {
        (companyLookupActions.searchCompaniesByName as jest.Mock).mockResolvedValue({
            isSuccess: true,
            result: mockCompanies,
        });

        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        await userEvent.type(searchInput, 'Siemens');

        const searchButton = screen.getByText('searchButton');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(companyLookupActions.searchCompaniesByName).toHaveBeenCalledWith('Siemens');
        });
    });

    it('should display search results', async () => {
        (companyLookupActions.searchCompaniesByName as jest.Mock).mockResolvedValue({
            isSuccess: true,
            result: mockCompanies,
        });

        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        await userEvent.type(searchInput, 'Siemens');

        const searchButton = screen.getByText('searchButton');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Siemens AG')).toBeInTheDocument();
            expect(screen.getByText('siemens.com')).toBeInTheDocument();
        });
    });

    it('should allow searching via Enter key', async () => {
        (companyLookupActions.searchCompaniesByName as jest.Mock).mockResolvedValue({
            isSuccess: true,
            result: mockCompanies,
        });

        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        await userEvent.type(searchInput, 'Siemens');
        fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(companyLookupActions.searchCompaniesByName).toHaveBeenCalledWith('Siemens');
        });
    });

    it('should show no results message when search returns empty', async () => {
        (companyLookupActions.searchCompaniesByName as jest.Mock).mockResolvedValue({
            isSuccess: true,
            result: [],
        });

        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        await userEvent.type(searchInput, 'NonExistent');

        const searchButton = screen.getByText('searchButton');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('noResults')).toBeInTheDocument();
        });
    });

    it('should disable search button when input is empty', () => {
        render(<CompanyLookupView />);

        const searchButton = screen.getByText('searchButton') as HTMLButtonElement;
        expect(searchButton).toBeDisabled();
    });

    it('should enable search button when input has text', async () => {
        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        const searchButton = screen.getByText('searchButton') as HTMLButtonElement;

        expect(searchButton).toBeDisabled();

        await userEvent.type(searchInput, 'Siemens');

        expect(searchButton).not.toBeDisabled();
    });

    it('should display error message on search failure', async () => {
        (companyLookupActions.searchCompaniesByName as jest.Mock).mockResolvedValue({
            isSuccess: false,
            errorCode: 'INTERNAL_SERVER_ERROR',
            message: 'Search failed',
        });

        render(<CompanyLookupView />);

        const searchInput = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement;
        await userEvent.type(searchInput, 'Test');

        const searchButton = screen.getByText('searchButton');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('searchError')).toBeInTheDocument();
        });
    });
});
