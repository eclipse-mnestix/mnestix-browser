export interface HealthCheckResponse {
    status: 'Healthy' | 'Unhealthy' | 'Degraded';
    totalDuration: string;
    entries: {
        application_info: {
            status: 'Healthy' | 'Unhealthy' | 'Degraded';
            description: string;
            duration: string;
            data: {
                applicationVersion: string;
                apiVersion: string;
                buildDate: string;
            };
        };
    };
}
