import { useEffect, useState } from 'react';
import { performHealthCheck } from 'lib/services/healthcheck/HealthCheckActions';
import { HealthCheckResponse } from 'lib/types/HealthCheckTypes';

/**
 * Hook to periodically check the health status of the AAS backend
 * @param interval - Check interval in milliseconds (default: 30000)
 * @returns Health status, loading state, and error state
 */
export function useHealthCheck(interval: number = 30000) {
    const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        async function checkHealth() {
            try {
                setIsLoading(true);
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
        }

        checkHealth();
        const intervalId = setInterval(checkHealth, interval);

        return () => clearInterval(intervalId);
    }, [interval]);

    return { healthStatus, isLoading, hasError };
}
