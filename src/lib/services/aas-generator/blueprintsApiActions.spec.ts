import { createBlueprint, updateBlueprint, getBlueprints, getBlueprintById, deleteBlueprintById } from './blueprintsApiActions';
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

describe('blueprintsApiActions authorization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const denyingCases: [string, () => Promise<unknown>][] = [
        ['createBlueprint', () => createBlueprint({} as never)],
        ['updateBlueprint', () => updateBlueprint({} as never, 'id')],
        ['getBlueprints', () => getBlueprints()],
        ['getBlueprintById', () => getBlueprintById('id')],
        ['deleteBlueprintById', () => deleteBlueprintById('id')],
    ];

    describe.each(denyingCases)('%s', (_name, invoke) => {
        it('rejects and never creates the aas-generator clients when requireRole denies', async () => {
            mockedRequireRole.mockRejectedValue(new Error('denied'));

            await expect(invoke()).rejects.toThrow('denied');

            expect(mockedRequireRole).toHaveBeenCalledWith(MnestixRole.MnestixAdmin, MnestixRole.MnestixUser);
            expect(mockedCreateVersionedAasGeneratorClients).not.toHaveBeenCalled();
        });

        it('creates the aas-generator clients once when requireRole allows', async () => {
            mockedRequireRole.mockResolvedValue(undefined);
            mockedCreateVersionedAasGeneratorClients.mockResolvedValue({
                v1: {
                    shellApi: {
                        getBlueprints: jest.fn().mockResolvedValue({ isSuccess: true }),
                        getBlueprint: jest.fn().mockResolvedValue({ isSuccess: true }),
                        deleteBlueprintById: jest.fn().mockResolvedValue({ isSuccess: true }),
                    },
                    templateClient: {
                        templateCreateCustomSubmodel: jest.fn().mockResolvedValue('id'),
                        templateUpdateCustomSubmodel: jest.fn().mockResolvedValue(undefined),
                    },
                },
                v2: {
                    templatesApi: {},
                    blueprintsApi: {},
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            await invoke();

            expect(mockedCreateVersionedAasGeneratorClients).toHaveBeenCalledTimes(1);
        });
    });
});
