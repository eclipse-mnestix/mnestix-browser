import { transferAasWithSubmodels } from 'lib/services/transfer-service/transferActions';
import { TransferService } from 'lib/services/transfer-service/TransferService';
import { TransferDto, TransferResult } from 'lib/types/TransferServiceData';
import { requireAdmin } from 'lib/util/securityHelpers/authGuard';

jest.mock('lib/util/securityHelpers/authGuard', () => ({
    requireAdmin: jest.fn(),
    requireRole: jest.fn(),
    getAuthError: jest.fn(),
}));
jest.mock('lib/services/transfer-service/TransferService');

const requireAdminMock = requireAdmin as jest.Mock;
const transferServiceCreateMock = TransferService.create as jest.Mock;

const repo = { url: 'https://repo.example.com', infrastructureName: 'TestInfra' };

const transferDto = {
    aas: { originalAasId: 'original-aas-id', aas: { id: 'aas-id' } },
    submodels: [],
    targetAasRepository: repo,
    sourceAasRepository: repo,
    targetSubmodelRepository: repo,
    sourceSubmodelRepository: repo,
} as unknown as TransferDto;

describe('transferAasWithSubmodels', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rejects and never creates a TransferService when the caller is not authorized', async () => {
        const authError = new Error('Forbidden');
        requireAdminMock.mockRejectedValue(authError);

        await expect(transferAasWithSubmodels(transferDto)).rejects.toThrow(authError);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(transferServiceCreateMock).not.toHaveBeenCalled();
    });

    it('proceeds with the transfer when the caller is authorized', async () => {
        requireAdminMock.mockResolvedValue(undefined);
        const expectedResult: TransferResult[] = [
            { success: true, operationKind: 'AasRepository', resourceId: 'aas-id', error: '' },
        ];
        const transferAasWithSubmodelsMock = jest.fn().mockResolvedValue(expectedResult);
        transferServiceCreateMock.mockResolvedValue({ transferAasWithSubmodels: transferAasWithSubmodelsMock });

        const result = await transferAasWithSubmodels(transferDto);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(transferServiceCreateMock).toHaveBeenCalledTimes(1);
        expect(transferAasWithSubmodelsMock).toHaveBeenCalledWith(transferDto.aas, transferDto.submodels);
        expect(result).toBe(expectedResult);
    });
});
