import { applyConsumerGatewayPrefix } from './consumerGatewayUrl';
import { envs } from 'lib/env/MnestixEnv';

jest.mock('lib/env/MnestixEnv');

const mockedEnvs = envs as jest.Mocked<typeof envs>;

describe('applyConsumerGatewayPrefix', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedEnvs.CONSUMER_GATEWAY_URL = 'https://gateway.consumer';
    });

    it('should rewrite a raw provider URL to the gateway /external form', () => {
        const result = applyConsumerGatewayPrefix('https://registry.provider.com/context/api');

        expect(result).toBe('https://gateway.consumer/external/registry.provider.com/context/api');
    });

    it('should preserve the provider port in the host segment', () => {
        const result = applyConsumerGatewayPrefix('https://registry.provider.com:8443/repo');

        expect(result).toBe('https://gateway.consumer/external/registry.provider.com:8443/repo');
    });

    it('should drop a bare root path', () => {
        const result = applyConsumerGatewayPrefix('https://registry.provider.com/');

        expect(result).toBe('https://gateway.consumer/external/registry.provider.com');
    });

    it('should trim a trailing slash from the provider path', () => {
        const result = applyConsumerGatewayPrefix('https://registry.provider.com/repo/');

        expect(result).toBe('https://gateway.consumer/external/registry.provider.com/repo');
    });

    it('should be idempotent for already-prefixed URLs', () => {
        const alreadyPrefixed = 'https://gateway.consumer/external/registry.provider.com/repo';

        expect(applyConsumerGatewayPrefix(alreadyPrefixed)).toBe(alreadyPrefixed);
    });

    it('should return the raw URL unchanged when the gateway is not configured', () => {
        mockedEnvs.CONSUMER_GATEWAY_URL = undefined as unknown as string;

        const raw = 'https://registry.provider.com/repo';
        expect(applyConsumerGatewayPrefix(raw)).toBe(raw);
    });

    it('should return the input unchanged when it is not a valid URL', () => {
        expect(applyConsumerGatewayPrefix('not-a-url')).toBe('not-a-url');
    });

    it('should return an empty string unchanged', () => {
        expect(applyConsumerGatewayPrefix('')).toBe('');
    });
});
