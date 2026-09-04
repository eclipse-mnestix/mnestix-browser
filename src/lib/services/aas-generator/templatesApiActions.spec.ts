import { getTemplates } from './templatesApiActions';
import { requireRole } from 'lib/util/securityHelpers/authGuard';
import { MnestixRole } from 'components/authentication/AllowedRoutes';
import { createVersionedAasGeneratorClients } from './aasGeneratorVersioning';

jest.mock('lib/util/securityHelpers/authGuard', () => ({
    requireAdmin: jest.fn(),
    requireRole: jest.fn(),
    getAuthError: jest.fn(),
}));
jest.mock('./aasGeneratorVersioning', () => ({
    ...jest.requireActual('./aasGeneratorVersioning'),
    createVersionedAasGeneratorClients: jest.fn(),
}));

const mockedRequireRole = requireRole as jest.MockedFunction<typeof requireRole>;
const mockedCreateVersionedAasGeneratorClients = createVersionedAasGeneratorClients as jest.MockedFunction<
    typeof createVersionedAasGeneratorClients
>;

describe('getTemplates authorization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rejects and never creates the aas-generator clients when requireRole denies', async () => {
        mockedRequireRole.mockRejectedValue(new Error('denied'));

        await expect(getTemplates()).rejects.toThrow('denied');

        expect(mockedRequireRole).toHaveBeenCalledWith(MnestixRole.MnestixAdmin, MnestixRole.MnestixUser);
        expect(mockedCreateVersionedAasGeneratorClients).not.toHaveBeenCalled();
    });

    it('creates the aas-generator clients once when requireRole allows', async () => {
        mockedRequireRole.mockResolvedValue(undefined);
        mockedCreateVersionedAasGeneratorClients.mockResolvedValue({
            v1: {
                shellApi: {
                    getTemplates: jest.fn().mockResolvedValue({ isSuccess: true }),
                },
                templateClient: {},
            },
            v2: {
                templatesApi: {},
                blueprintsApi: {},
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        await getTemplates();

        expect(mockedCreateVersionedAasGeneratorClients).toHaveBeenCalledTimes(1);
    });
});
