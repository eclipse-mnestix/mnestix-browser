import { useState, useCallback } from 'react';
import { performHealthCheck } from 'lib/services/healthcheck/HealthCheckActions';
import { HealthCheckResponse } from 'lib/types/HealthCheckTypes';

/**
 * Hook to manage health check state
 * Provides a simple way to fetch and store health check data on-demand
 * @returns Health status, loading state, error state, and fetch function
 */
export function useHealthCheck() {
    const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const fetchHealthCheck = useCallback(async () => {
        try {
            setIsLoading(true);
            setHasError(false);
            const response = await performHealthCheck();

            if (response.isSuccess) {
                setHealthStatus(response.result);
                setHasError(false);
            } else {
                setHasError(true);
                setHealthStatus(null);
            }
        } catch {
            setHasError(true);
            setHealthStatus(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { healthStatus, isLoading, hasError, fetchHealthCheck };
}
