'use client';

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useHealthCheck } from 'lib/hooks/UseHealthCheck';
import { HealthCheckResponse } from 'lib/types/HealthCheckTypes';

type HealthCheckContextValue = {
    healthStatus: HealthCheckResponse | null;
    isLoading: boolean;
    hasError: boolean;
};

const HealthCheckContext = createContext<HealthCheckContextValue | undefined>(undefined);

export function useHealthCheckContext(): HealthCheckContextValue {
    const context = useContext(HealthCheckContext);
    if (context === undefined) {
        throw new Error('useHealthCheckContext must be used within a HealthCheckProvider');
    }
    return context;
}

export function HealthCheckProvider({ children }: PropsWithChildren) {
    const healthCheckState = useHealthCheck();

    const contextValue = useMemo<HealthCheckContextValue>(
        () => ({
            healthStatus: healthCheckState.healthStatus,
            isLoading: healthCheckState.isLoading,
            hasError: healthCheckState.hasError,
        }),
        [healthCheckState.healthStatus, healthCheckState.hasError, healthCheckState.isLoading],
    );

    return <HealthCheckContext.Provider value={contextValue}>{children}</HealthCheckContext.Provider>;
}
