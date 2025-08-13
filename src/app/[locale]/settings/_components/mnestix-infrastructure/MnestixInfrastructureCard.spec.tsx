import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';

import MnestixInfrastructureCard from './MnestixInfrastructureCard';

import MnestixInfrastructureForm from './MnestixInfrastructureForm';
jest.mock('./MnestixInfrastructureForm', () => {
    const MockComponent = jest.fn(() => <div data-testid="infrastructure-form">Infrastructure Form</div>);
    return {
        __esModule: true,
        default: MockComponent,
    };
});

import {
    getInfrastructuresAction,
    deleteInfrastructureAction,
} from './../../../../../lib/services/database/connectionServerActions';
jest.mock('./../../../../../lib/services/database/connectionServerActions', () => ({
    getInfrastructuresAction: jest.fn(),
    createInfrastructureAction: jest.fn(),
    updateInfrastructureAction: jest.fn(),
    deleteInfrastructureAction: jest.fn(),
}));

import { useNotificationSpawner } from './../../../../../lib/hooks/UseNotificationSpawner';
jest.mock('./../../../../../lib/hooks/UseNotificationSpawner');

jest.mock('next-intl', () => ({
    useTranslations: (scope?: string) => (key: string) => (scope ? `${scope}.${key}` : key),
}));

jest.mock('./../../../../../components/basics/CenteredLoadingSpinner', () => ({
    CenteredLoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock infrastructure data that matches the expected format from getInfrastructuresAction
const mockInfrastructures = [
    {
        id: 'infra-1',
        name: 'Test Infrastructure 1',
        logo: 'https://example.com/logo1.png',
        securityType: {
            id: 'sec-1',
            typeName: 'NONE',
        },
        connections: [
            {
                id: 'conn-1',
                url: 'https://api.example.com',
                types: [
                    {
                        type: {
                            id: 'type-1',
                            typeName: 'AAS_REPOSITORY',
                        },
                    },
                ],
            },
        ],
        securitySettingsHeaders: [],
        securitySettingsProxies: [],
    },
    {
        id: 'infra-2',
        name: 'Test Infrastructure 2',
        logo: null,
        securityType: {
            id: 'sec-2',
            typeName: 'HEADER',
        },
        connections: [
            {
                id: 'conn-2',
                url: 'https://api2.example.com',
                types: [
                    {
                        type: {
                            id: 'type-2',
                            typeName: 'AAS_REGISTRY',
                        },
                    },
                ],
            },
        ],
        securitySettingsHeaders: [
            {
                id: 'header-1',
                headerName: 'Authorization',
                headerValue: 'Bearer token',
            },
        ],
        securitySettingsProxies: [],
    },
];

const messages = {
    getInfrastructuresAction_error: 'Failed to fetch infrastructures',
};

function setupMocks() {
    (useNotificationSpawner as jest.Mock).mockReturnValue({ spawn: jest.fn() });
    (getInfrastructuresAction as jest.Mock).mockResolvedValue(mockInfrastructures);
}

function setupErrorMocks() {
    (useNotificationSpawner as jest.Mock).mockReturnValue({ spawn: jest.fn() });
    (getInfrastructuresAction as jest.Mock).mockRejectedValue(new Error(messages.getInfrastructuresAction_error));
}

async function renderMnestixInfrastructureCard() {
    await act(async () => {
        render(<MnestixInfrastructureCard />);
    });
}

describe('MnestixInfrastructureCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', async () => {
        setupMocks();
        await renderMnestixInfrastructureCard();
    });

    it('shows existing infrastructures', async () => {
        setupMocks();
        await renderMnestixInfrastructureCard();

        // Wait for the component to load and display the infrastructures
        await waitFor(() => {
            // Check that both infrastructure names are displayed
            expect(screen.getByText('Test Infrastructure 1')).toBeInTheDocument();
            expect(screen.getByText('Test Infrastructure 2')).toBeInTheDocument();
        });

        // Verify that getInfrastructuresAction was called
        expect(getInfrastructuresAction).toHaveBeenCalledTimes(1);

        // Verify that edit and delete buttons are present for each infrastructure
        expect(screen.getByLabelText('Edit Test Infrastructure 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Edit Test Infrastructure 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Delete Test Infrastructure 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Delete Test Infrastructure 2')).toBeInTheDocument();
    });

    it('opens a new infrastructure from on create', async () => {
        setupMocks();
        await renderMnestixInfrastructureCard();

        // Wait for the component to load and display the infrastructures
        await waitFor(() => {
            // Check that both infrastructure names are displayed
            expect(screen.getByLabelText('Create new infrastructure')).toBeInTheDocument();
        });

        // Find and click the Create Button - wrap in act()
        await act(async () => {
            fireEvent.click(screen.getByLabelText('Create new infrastructure'));
        });

        // Check if InfrastructureForm was opened with an empty infrastructure
        await waitFor(() => {
            expect(screen.getByTestId('infrastructure-form')).toBeInTheDocument();

            // Access the first call's first argument directly
            const callArg = (MnestixInfrastructureForm as jest.Mock).mock.calls[0][0];
            expect(callArg.infrastructure).toMatchObject({
                id: '',
                name: '',
            });
        });
    });

    it('opens the correct infrastructure form on edit', async () => {
        setupMocks();
        await renderMnestixInfrastructureCard();

        // Wait for the component to load and display the infrastructures
        await waitFor(() => {
            // Check that both infrastructure names are displayed
            expect(screen.getByText('Test Infrastructure 1')).toBeInTheDocument();
        });

        // Find and click the Edit Button - wrap in act()
        await act(async () => {
            fireEvent.click(screen.getByLabelText('Edit Test Infrastructure 1'));
        });

        // Check if the infrastructure form was opened with correct infrastructure ID
        await waitFor(() => {
            expect(screen.getByTestId('infrastructure-form')).toBeInTheDocument();
            // Access the first call's first argument directly
            const callArg = (MnestixInfrastructureForm as jest.Mock).mock.calls[0][0];
            expect(callArg.infrastructure).toMatchObject({
                id: 'infra-1',
                name: 'Test Infrastructure 1',
            });
        });
    });

    it('requires an extra step to delete an infrastructure', async () => {
        setupMocks();
        await renderMnestixInfrastructureCard();

        // Wait for the component to load and display the infrastructures
        await waitFor(() => {
            // Check that both infrastructure names are displayed
            expect(screen.getByText('Test Infrastructure 1')).toBeInTheDocument();
        });

        // Find and click the Delete Button - wrap in act()
        await act(async () => {
            fireEvent.click(screen.getByLabelText('Delete Test Infrastructure 1'));
        });

        // Check if the infrastructure delete dialog was opened with correct infrastructure ID
        await waitFor(() => {
            expect(screen.getByTestId('delete-dialog')).toBeInTheDocument();
            // Delete should not have been called at all
            expect(deleteInfrastructureAction).toHaveBeenCalledTimes(0);
        });
    });

    it('shows an error when no infrastructures are available', async () => {
        setupErrorMocks();
        await renderMnestixInfrastructureCard();

        // Wait for the component to load and display the no infrastructures message
        await waitFor(() => {
            expect(useNotificationSpawner().spawn).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: String('Error: ' + messages.getInfrastructuresAction_error),
                    severity: 'error',
                }),
            );
        });
    });
});
