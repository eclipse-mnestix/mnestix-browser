import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { performHealthCheck } from './HealthCheckActions';
import { mnestixFetch } from 'lib/api/infrastructure';
import { getDefaultInfrastructure } from 'lib/services/database/infrastructureDatabaseActions';
import { createSecurityHeaders } from 'lib/util/securityHelpers/SecurityConfiguration';

jest.mock('lib/api/infrastructure', () => ({
    mnestixFetch: jest.fn(),
}));

jest.mock('lib/env/MnestixEnv', () => ({
    envs: {
        MNESTIX_AAS_GENERATOR_API_URL: 'https://example.com',
    },
}));

jest.mock('lib/services/database/infrastructureDatabaseActions', () => ({
    getDefaultInfrastructure: jest.fn(),
}));

jest.mock('lib/util/securityHelpers/SecurityConfiguration', () => ({
    createSecurityHeaders: jest.fn(),
}));

jest.mock('lib/util/Logger', () => ({
    createRequestLogger: jest.fn(() => ({
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    })),
    logResponseDebug: jest.fn(),
}));

jest.mock('next/headers', () => ({
    headers: jest.fn(() => Promise.resolve(new Headers())),
}));

const fetchMock = mnestixFetch as unknown as jest.Mock;
const getDefaultInfrastructureMock = getDefaultInfrastructure as jest.Mock;
const createSecurityHeadersMock = createSecurityHeaders as jest.Mock;

describe('performHealthCheck', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should invoke mnestixFetch with the generated security headers', async () => {
        const infrastructure = { id: 'infra-1' };
        const securityHeader = { Authorization: 'Bearer token' };
        const mockResponse = { isSuccess: true, result: { status: 'Healthy' } };
        const fetchResult = { fetch: jest.fn().mockResolvedValue(mockResponse) };

        getDefaultInfrastructureMock.mockResolvedValue(infrastructure);
        createSecurityHeadersMock.mockResolvedValue(securityHeader);
        fetchMock.mockReturnValue(fetchResult);

        const response = await performHealthCheck();

        expect(getDefaultInfrastructureMock).toHaveBeenCalledTimes(1);
        expect(createSecurityHeadersMock).toHaveBeenCalledWith(infrastructure);
        expect(fetchMock).toHaveBeenCalledWith(securityHeader);
        expect(fetchResult.fetch).toHaveBeenCalledWith('https://example.com/api/health', {
            method: 'GET',
            cache: 'no-store',
        });
        expect(response).toEqual(mockResponse);
    });
});
