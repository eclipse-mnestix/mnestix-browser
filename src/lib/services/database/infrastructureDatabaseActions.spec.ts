import {
    createInfrastructureAction,
    updateInfrastructureAction,
    deleteInfrastructureAction,
    getInfrastructuresAction,
} from './infrastructureDatabaseActions';
import { requireAdmin } from 'lib/util/securityHelpers/authGuard';
import { PrismaConnector } from 'lib/services/database/PrismaConnector';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

jest.mock('lib/util/securityHelpers/authGuard', () => ({
    requireAdmin: jest.fn(),
    requireRole: jest.fn(),
    getAuthError: jest.fn(),
}));

jest.mock('lib/services/database/PrismaConnector');

const mockedRequireAdmin = requireAdmin as jest.MockedFunction<typeof requireAdmin>;
const mockedCreate = PrismaConnector.create as jest.MockedFunction<typeof PrismaConnector.create>;

const mockConnector = {
    getInfrastructures: jest.fn(),
    createInfrastructure: jest.fn(),
    updateInfrastructure: jest.fn(),
    deleteInfrastructureAction: jest.fn(),
};

const infrastructureData: InfrastructureFormData = {
    id: 'infra-1',
    name: 'Test Infrastructure',
    securityType: 'NONE',
    connections: [],
};

beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedCreate.mockReturnValue(mockConnector as any);
});

describe('createInfrastructureAction', () => {
    it('rejects and never calls PrismaConnector when requireAdmin denies', async () => {
        mockedRequireAdmin.mockRejectedValue(new Error('denied'));

        await expect(createInfrastructureAction(infrastructureData)).rejects.toThrow('denied');

        expect(mockConnector.createInfrastructure).not.toHaveBeenCalled();
    });

    it('calls PrismaConnector once when requireAdmin allows', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await createInfrastructureAction(infrastructureData);

        expect(mockConnector.createInfrastructure).toHaveBeenCalledTimes(1);
        expect(mockConnector.createInfrastructure).toHaveBeenCalledWith(infrastructureData);
    });

    it('invokes requireAdmin', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await createInfrastructureAction(infrastructureData);

        expect(mockedRequireAdmin).toHaveBeenCalledTimes(1);
    });
});

describe('updateInfrastructureAction', () => {
    it('rejects and never calls PrismaConnector when requireAdmin denies', async () => {
        mockedRequireAdmin.mockRejectedValue(new Error('denied'));

        await expect(updateInfrastructureAction(infrastructureData)).rejects.toThrow('denied');

        expect(mockConnector.updateInfrastructure).not.toHaveBeenCalled();
    });

    it('calls PrismaConnector once when requireAdmin allows', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await updateInfrastructureAction(infrastructureData);

        expect(mockConnector.updateInfrastructure).toHaveBeenCalledTimes(1);
        expect(mockConnector.updateInfrastructure).toHaveBeenCalledWith(infrastructureData);
    });

    it('invokes requireAdmin', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await updateInfrastructureAction(infrastructureData);

        expect(mockedRequireAdmin).toHaveBeenCalledTimes(1);
    });
});

describe('deleteInfrastructureAction', () => {
    it('rejects and never calls PrismaConnector when requireAdmin denies', async () => {
        mockedRequireAdmin.mockRejectedValue(new Error('denied'));

        await expect(deleteInfrastructureAction('infra-1')).rejects.toThrow('denied');

        expect(mockConnector.deleteInfrastructureAction).not.toHaveBeenCalled();
    });

    it('calls PrismaConnector once when requireAdmin allows', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await deleteInfrastructureAction('infra-1');

        expect(mockConnector.deleteInfrastructureAction).toHaveBeenCalledTimes(1);
        expect(mockConnector.deleteInfrastructureAction).toHaveBeenCalledWith('infra-1');
    });

    it('invokes requireAdmin', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await deleteInfrastructureAction('infra-1');

        expect(mockedRequireAdmin).toHaveBeenCalledTimes(1);
    });
});

describe('getInfrastructuresAction', () => {
    it('rejects and never calls PrismaConnector when requireAdmin denies', async () => {
        mockedRequireAdmin.mockRejectedValue(new Error('denied'));

        await expect(getInfrastructuresAction()).rejects.toThrow('denied');

        expect(mockConnector.getInfrastructures).not.toHaveBeenCalled();
    });

    it('calls PrismaConnector once when requireAdmin allows', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await getInfrastructuresAction();

        expect(mockConnector.getInfrastructures).toHaveBeenCalledTimes(1);
    });

    it('invokes requireAdmin', async () => {
        mockedRequireAdmin.mockResolvedValue(undefined);

        await getInfrastructuresAction();

        expect(mockedRequireAdmin).toHaveBeenCalledTimes(1);
    });
});
