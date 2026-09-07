import { getIdGenerationSettings, putSingleIdGenerationSetting } from './configurationApiActions';
import { requireAdmin } from 'lib/util/securityHelpers/authGuard';
import { getDefaultInfrastructure } from '../database/infrastructureDatabaseActions';

jest.mock('lib/util/securityHelpers/authGuard', () => ({
    requireAdmin: jest.fn(),
    requireRole: jest.fn(),
    getAuthError: jest.fn(),
}));
jest.mock('../database/infrastructureDatabaseActions', () => ({
    getDefaultInfrastructure: jest.fn(),
}));
jest.mock('lib/util/securityHelpers/SecurityConfiguration', () => ({
    createSecurityHeaders: jest.fn(),
}));
jest.mock('lib/api/infrastructure', () => ({ mnestixFetch: jest.fn() }));
const configurationShellApiStub = {
    getIdGenerationSettings: jest.fn(),
    putSingleIdGenerationSetting: jest.fn(),
};
jest.mock('lib/api/configuration-shell-api/configurationShellApi', () => ({
    ConfigurationShellApi: { create: jest.fn(() => configurationShellApiStub) },
}));
jest.mock('lib/api/configuration-shell-api/configurationShellApiV2', () => ({
    ConfigurationShellApiV2: { create: jest.fn(() => configurationShellApiStub) },
}));

const mockedRequireAdmin = requireAdmin as jest.MockedFunction<typeof requireAdmin>;
const mockedGetDefaultInfrastructure = getDefaultInfrastructure as jest.Mock;

describe('configurationApiActions authorization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getIdGenerationSettings', () => {
        it('rejects and never resolves the configuration api when requireAdmin denies', async () => {
            mockedRequireAdmin.mockRejectedValue(new Error('denied'));

            await expect(getIdGenerationSettings()).rejects.toThrow('denied');

            expect(mockedRequireAdmin).toHaveBeenCalled();
            expect(mockedGetDefaultInfrastructure).not.toHaveBeenCalled();
        });

        it('resolves the configuration api when requireAdmin allows', async () => {
            mockedRequireAdmin.mockResolvedValue(undefined);
            mockedGetDefaultInfrastructure.mockResolvedValue(undefined);

            await getIdGenerationSettings();

            expect(mockedGetDefaultInfrastructure).toHaveBeenCalledTimes(1);
        });
    });

    describe('putSingleIdGenerationSetting', () => {
        it('rejects and never resolves the configuration api when requireAdmin denies', async () => {
            mockedRequireAdmin.mockRejectedValue(new Error('denied'));

            await expect(putSingleIdGenerationSetting('id', { prefix: '', dynamicPart: '' })).rejects.toThrow(
                'denied',
            );

            expect(mockedRequireAdmin).toHaveBeenCalled();
            expect(mockedGetDefaultInfrastructure).not.toHaveBeenCalled();
        });

        it('resolves the configuration api when requireAdmin allows', async () => {
            mockedRequireAdmin.mockResolvedValue(undefined);
            mockedGetDefaultInfrastructure.mockResolvedValue(undefined);

            await putSingleIdGenerationSetting('id', { prefix: '', dynamicPart: '' });

            expect(mockedGetDefaultInfrastructure).toHaveBeenCalledTimes(1);
        });
    });
});
