export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    version: string;
    buildDate: string;
}
