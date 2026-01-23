import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { HealthCheckIndicator } from './HealthCheckIndicator';
import { useHealthCheckContext } from 'components/contexts/HealthCheckContext';
import { CustomRender } from 'test-utils/CustomRender';

jest.mock('../contexts/HealthCheckContext');

const makeHealthStatus = () => ({
    status: 'Healthy' as const,
    totalDuration: '0',
    entries: {
        application_info: {
            status: 'Healthy' as const,
            description: '',
            duration: '0',
            data: {
                applicationVersion: '1.0.0',
                apiVersion: '2.0.0',
                buildDate: new Date('2024-01-01T00:00:00Z').toISOString(),
            },
        },
    },
});

describe('HealthCheckIndicator', () => {
    const useHealthCheckContextMock = useHealthCheckContext as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display the loading indicator while health check is in progress', () => {
        useHealthCheckContextMock.mockReturnValue({
            healthStatus: null,
            isLoading: true,
            hasError: false,
            fetchHealthCheck: jest.fn(),
        });

        CustomRender(<HealthCheckIndicator />);

        const map = screen.getByTestId('health-loading-indicator');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();
    });

    it('should render the offline state when health check fails', () => {
        useHealthCheckContextMock.mockReturnValue({
            healthStatus: null,
            isLoading: false,
            hasError: true,
            fetchHealthCheck: jest.fn(),
        });

        CustomRender(<HealthCheckIndicator />);

        const offlineChip = screen.getByTestId('health-offline-indicator');
        expect(offlineChip).toBeDefined();
        expect(offlineChip).toBeInTheDocument();
        expect(offlineChip).toHaveTextContent('Offline');
    });

    it('should show health details when the service is healthy', () => {
        useHealthCheckContextMock.mockReturnValue({
            healthStatus: makeHealthStatus(),
            isLoading: false,
            hasError: false,
            fetchHealthCheck: jest.fn(),
        });

        CustomRender(<HealthCheckIndicator />);

        const statusChip = screen.getByTestId('health-status-indicator');
        expect(statusChip).toBeDefined();
        expect(statusChip).toBeInTheDocument();
        expect(statusChip).toHaveTextContent('Application Version: 1.0.0');
        expect(statusChip).toHaveTextContent('API Version: 2.0.0');
    });
});
