import { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useHealthCheckContext, HealthCheckProvider } from './HealthCheckContext';
import { useHealthCheck } from 'lib/hooks/UseHealthCheck';
import { HealthCheckResponse } from 'lib/types/HealthCheckTypes';

jest.mock('../../lib/hooks/UseHealthCheck', () => ({
    useHealthCheck: jest.fn(),
}));

const mockUseHealthCheck = useHealthCheck as jest.Mock;

const mockHealthStatus: HealthCheckResponse = {
    status: 'Healthy',
    totalDuration: '00:00:01',
    entries: {
        application_info: {
            status: 'Healthy',
            description: 'All good',
            duration: '00:00:01',
            data: {
                applicationVersion: '1.2.3',
                apiVersion: '4.5.6',
                buildDate: new Date('2024-05-10T12:34:56Z').toISOString(),
            },
        },
    },
};

describe('HealthCheckContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw when used outside of the provider', () => {
        expect(() => renderHook(() => useHealthCheckContext())).toThrow(
            'useHealthCheckContext must be used within a HealthCheckProvider',
        );
    });

    it('should expose health check state and invoke fetch on mount', async () => {
        const mockFetchHealthCheck = jest.fn().mockResolvedValue(undefined);
        mockUseHealthCheck.mockReturnValue({
            healthStatus: mockHealthStatus,
            isLoading: false,
            hasError: false,
            fetchHealthCheck: mockFetchHealthCheck,
        });

        const wrapper = ({ children }: PropsWithChildren) => <HealthCheckProvider>{children}</HealthCheckProvider>;

        const { result } = renderHook(() => useHealthCheckContext(), { wrapper });

        expect(result.current.healthStatus).toEqual(mockHealthStatus);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.hasError).toBe(false);
        expect(result.current.fetchHealthCheck).toBe(mockFetchHealthCheck);

        await waitFor(() => expect(mockFetchHealthCheck).toHaveBeenCalledTimes(1));
    });
});
