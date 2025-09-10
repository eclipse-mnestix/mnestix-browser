import { SerializationService } from 'lib/services/serialization-service/SerializationService';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { getInfrastructureByName } from 'lib/services/database/infrastructureDatabaseActions';

jest.mock('lib/services/database/infrastructureDatabaseActions', () => ({
    getInfrastructuresIncludingDefault: jest.fn(),
    getInfrastructureByName: jest.fn(),
}));
jest.mock('lib/util/securityHelpers/SecurityConfiguration', () => ({
    createSecurityHeaders: jest.fn(),
}));

describe('SerializationService', () => {
    let service: SerializationService;

    beforeEach(() => {
        service = SerializationService.create();
        jest.clearAllMocks();
    });

    it('returns URL when infrastructure exists', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue({
            name: 'TestInfrastructure',
            serializationEndpointUrls: ['https://endpoint.com/serialize'],
        });
        const result = await service.getSerializationEndpointsFromInfrastructure('TestInfrastructure');
        expect(result.isSuccess).toBe(true);
        expect(result.result).toEqual(['https://endpoint.com/serialize']);
    });

    it('returns NOT_FOUND if infrastructure does not exist', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue([]);
        const result = await service.getSerializationEndpointsFromInfrastructure('unknown');
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns NOT_FOUND if infrastructure has no endpoints', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue({
            name: 'Infrastructure2',
            serializationEndpointUrls: [],
        });
        const result = await service.getSerializationEndpointsFromInfrastructure('Infrastructure2');
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.NOT_FOUND);
        }
    });

    it('returns serialization result if serialization succeeds', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue({
            name: 'TestInfrastructure',
            serializationEndpointUrls: ['https://endpoint.com/serialize'],
        });

        service = SerializationService.createNull(() => ({
            downloadAAS: jest.fn().mockResolvedValue({
                isSuccess: true,
                result: new Blob(['test']),
            }),
            getBaseUrl: jest.fn().mockReturnValue('https://endpoint.com/serialize'),
        }));

        const result = await service.serializeAasFromInfrastructure(
            'aasId',
            ['submodel1'],
            'TestInfrastructure',
            true,
            'aasx',
        );
        expect(result.isSuccess).toBe(true);
        expect(result.result?.blob).toBeInstanceOf(Blob);
        expect(result.result?.endpointUrl).toBe('https://endpoint.com/serialize');
        expect(result.result?.infrastructureName).toBe('TestInfrastructure');
    });

    it('returns error if all endpoints fail', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue({
            name: 'TestInfrastructure',
            serializationEndpointUrls: ['https://endpoint.com/serialize'],
        });

        service = SerializationService.createNull(() => ({
            downloadAAS: jest.fn().mockResolvedValue({
                isSuccess: false,
                errorCode: ApiResultStatus.INTERNAL_SERVER_ERROR,
                message: 'fail',
            }),
            getBaseUrl: jest.fn().mockReturnValue('https://endpoint.com/serialize'),
        }));

        const result = await service.serializeAasFromInfrastructure(
            'aasId',
            ['submodel1'],
            'TestInfrastructure',
            true,
            'aasx',
        );
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.INTERNAL_SERVER_ERROR);
        }
    });

    it('serializeAas returns error if client throws', async () => {
        (getInfrastructureByName as jest.Mock).mockResolvedValue({ name: 'TestInfrastructure' });

        service = SerializationService.createNull(() => ({
            downloadAAS: jest.fn().mockImplementation(() => {
                throw new Error('fail');
            }),
            getBaseUrl: jest.fn().mockReturnValue('https://endpoint.com/serialize'),
        }));

        const result = await service.serializeAas(
            'aasId',
            ['submodel1'],
            { url: 'https://endpoint.com/serialize', infrastructureName: 'TestInfrastructure' },
            true,
            'aasx',
        );
        expect(result.isSuccess).toBe(false);
        if (!result.isSuccess) {
            expect(result.errorCode).toBe(ApiResultStatus.INTERNAL_SERVER_ERROR);
        }
    });
});
