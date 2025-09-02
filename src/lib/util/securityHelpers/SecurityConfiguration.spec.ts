import { createSecurityHeaders } from './SecurityConfiguration';
import { envs } from 'lib/env/MnestixEnv';
import { decryptSecret } from './Encryption';
import { getServerSession } from 'next-auth';
import { InfrastructureConnection } from 'lib/services/database/InfrastructureMappedTypes';

// Mock all dependencies
jest.mock('lib/env/MnestixEnv');
jest.mock('./Encryption');
jest.mock('next-auth');
jest.mock('components/authentication/authConfig');

const mockedEnvs = envs as jest.Mocked<typeof envs>;
const mockedDecryptSecret = decryptSecret as jest.MockedFunction<typeof decryptSecret>;
const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

/**
 * Creates a mock InfrastructureConnection with customizable properties
 * @param overrides - Partial properties to override defaults
 * @returns InfrastructureConnection object
 */
function createMockInfrastructure(overrides: Partial<InfrastructureConnection> = {}): InfrastructureConnection {
    return {
        isDefault: false,
        name: 'Test Infrastructure',
        submodelRegistryUrls: [],
        submodelRepositoryUrls: [],
        aasRegistryUrls: [],
        aasRepositoryUrls: [],
        conceptDescriptionRepositoryUrls: [],
        discoveryUrls: [],
        infrastructureSecurity: undefined,
        ...overrides,
    };
}

describe('createSecurityHeaders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedEnvs.MNESTIX_V2_ENABLED = false;
        mockedEnvs.AUTHENTICATION_FEATURE_FLAG = false;
        mockedEnvs.MNESTIX_BACKEND_API_KEY = 'test-api-key';
    });

    describe('when infrastructure is undefined or null', () => {
        it('should return null when infrastructure is undefined', async () => {
            const result = await createSecurityHeaders(undefined);
            expect(result).toBeNull();
        });
    });

    describe('when infrastructure is default', () => {
        it('should return bearer token headers when authentication is enabled and token exists', async () => {
            const mockDefaultInfrastructure = createMockInfrastructure({ isDefault: true });
            mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
            mockedGetServerSession.mockResolvedValue({
                accessToken: 'test-bearer-token',
            });

            const result = await createSecurityHeaders(mockDefaultInfrastructure);

            expect(result).toEqual({
                Authorization: 'Bearer test-bearer-token',
            });
        });

        it('should return API key headers when authentication is disabled and V2 is disabled', async () => {
            const mockDefaultInfrastructure = createMockInfrastructure({ isDefault: true });
            mockedEnvs.AUTHENTICATION_FEATURE_FLAG = false;
            mockedEnvs.MNESTIX_V2_ENABLED = false;
            mockedEnvs.MNESTIX_BACKEND_API_KEY = 'test-api-key';

            const result = await createSecurityHeaders(mockDefaultInfrastructure);

            expect(result).toEqual({
                ApiKey: 'test-api-key',
            });
        });

        it('should return X-API-KEY headers when authentication is disabled and V2 is enabled', async () => {
            const mockDefaultInfrastructure = createMockInfrastructure({ isDefault: true });
            mockedEnvs.AUTHENTICATION_FEATURE_FLAG = false;
            mockedEnvs.MNESTIX_V2_ENABLED = true;
            mockedEnvs.MNESTIX_BACKEND_API_KEY = 'test-api-key';

            const result = await createSecurityHeaders(mockDefaultInfrastructure);

            expect(result).toEqual({
                'X-API-KEY': 'test-api-key',
            });
        });

        it('should return null when authentication is enabled but no bearer token exists', async () => {
            const mockDefaultInfrastructure = createMockInfrastructure({ isDefault: true });
            mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
            mockedGetServerSession.mockResolvedValue({
                accessToken: '',
            });

            const result = await createSecurityHeaders(mockDefaultInfrastructure);

            expect(result).toBeNull();
        });

        it('should return null when authentication is enabled but session is null', async () => {
            const mockDefaultInfrastructure = createMockInfrastructure({ isDefault: true });
            mockedEnvs.AUTHENTICATION_FEATURE_FLAG = true;
            mockedGetServerSession.mockResolvedValue(null);

            const result = await createSecurityHeaders(mockDefaultInfrastructure);

            expect(result).toBeNull();
        });
    });

    describe('when security type is NONE', () => {
        it('should return null', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'NONE',
                },
            });

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toBeNull();
        });
    });

    describe('when security type is HEADER', () => {
        it('should return custom header when security header is valid', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'HEADER',
                    securityHeader: {
                        name: 'Custom-Auth',
                        value: 'encrypted-value',
                        initVector: 'init-vector',
                        authTag: 'auth-tag',
                    },
                },
            });

            mockedDecryptSecret.mockReturnValue('decrypted-value');

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(mockedDecryptSecret).toHaveBeenCalledWith('encrypted-value', 'init-vector', 'auth-tag');
            expect(result).toEqual({
                'Custom-Auth': 'decrypted-value',
            });
        });

        it('should return null when security header is missing', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'HEADER',
                },
            });

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toBeNull();
        });
    });

    describe('when security type is PROXY', () => {
        it('should return API key header when security proxy is valid and V2 is disabled', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'PROXY',
                    securityProxy: {
                        value: 'encrypted-proxy-value',
                        initVector: 'proxy-init-vector',
                        authTag: 'proxy-auth-tag',
                    },
                },
            });

            mockedEnvs.MNESTIX_V2_ENABLED = false;
            mockedDecryptSecret.mockReturnValue('decrypted-proxy-value');

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(mockedDecryptSecret).toHaveBeenCalledWith(
                'encrypted-proxy-value',
                'proxy-init-vector',
                'proxy-auth-tag',
            );
            expect(result).toEqual({
                ApiKey: 'decrypted-proxy-value',
            });
        });

        it('should return X-API-KEY header when security proxy is valid and V2 is enabled', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'PROXY',
                    securityProxy: {
                        value: 'encrypted-proxy-value',
                        initVector: 'proxy-init-vector',
                        authTag: 'proxy-auth-tag',
                    },
                },
            });

            mockedEnvs.MNESTIX_V2_ENABLED = true;
            mockedDecryptSecret.mockReturnValue('decrypted-proxy-value');

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toEqual({
                'X-API-KEY': 'decrypted-proxy-value',
            });
        });

        it('should return null when security proxy is missing', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'PROXY',
                },
            });

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toBeNull();
        });
    });

    describe('when security data is invalid', () => {
        it('should return null when securityType is undefined', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: undefined,
                },
            });

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toBeNull();
        });

        it('should return null when securityType is unknown', async () => {
            const mockInfrastructure = createMockInfrastructure({
                isDefault: false,
                infrastructureSecurity: {
                    securityType: 'UNKNOWN',
                },
            });

            const result = await createSecurityHeaders(mockInfrastructure);

            expect(result).toBeNull();
        });
    });
});
