import { GET, POST } from 'app/api/mnestixConnections/route';
import { prisma } from 'lib/database/prisma';
import { getAuthError } from 'lib/util/securityHelpers/authGuard';
import { NextRequest } from 'next/server';

jest.mock('lib/util/securityHelpers/authGuard', () => ({
    requireAdmin: jest.fn(),
    requireRole: jest.fn(),
    getAuthError: jest.fn(),
}));
jest.mock('lib/database/prisma', () => ({
    prisma: {
        mnestixConnection: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
        connectionType: {
            findFirst: jest.fn(),
        },
    },
}));

const getAuthErrorMock = getAuthError as jest.Mock;
const findManyMock = prisma.mnestixConnection.findMany as jest.Mock;
const createMock = prisma.mnestixConnection.create as jest.Mock;
const findFirstMock = prisma.connectionType.findFirst as jest.Mock;

function createPostRequest(body: unknown): NextRequest {
    return { json: jest.fn().mockResolvedValue(body) } as unknown as NextRequest;
}

describe('GET /api/mnestixConnections', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 and does not touch the database when unauthorized', async () => {
        getAuthErrorMock.mockResolvedValue({ status: 401, message: 'Unauthorized' });

        const response = await GET();

        expect(response.status).toBe(401);
        expect(findManyMock).not.toHaveBeenCalled();
    });

    it('returns 403 and does not touch the database when forbidden', async () => {
        getAuthErrorMock.mockResolvedValue({ status: 403, message: 'Forbidden' });

        const response = await GET();

        expect(response.status).toBe(403);
        expect(findManyMock).not.toHaveBeenCalled();
    });

    it('proceeds and queries the database when authorized', async () => {
        getAuthErrorMock.mockResolvedValue(undefined);
        findManyMock.mockResolvedValue([{ id: '1' }]);

        const response = await GET();

        expect(response.status).toBe(200);
        expect(findManyMock).toHaveBeenCalledTimes(1);
    });
});

describe('POST /api/mnestixConnections', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 and does not touch the database when unauthorized', async () => {
        getAuthErrorMock.mockResolvedValue({ status: 401, message: 'Unauthorized' });
        const req = createPostRequest({ url: 'https://example.com', type: 'someType' });

        const response = await POST(req);

        expect(response.status).toBe(401);
        expect(findFirstMock).not.toHaveBeenCalled();
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns 403 and does not touch the database when forbidden', async () => {
        getAuthErrorMock.mockResolvedValue({ status: 403, message: 'Forbidden' });
        const req = createPostRequest({ url: 'https://example.com', type: 'someType' });

        const response = await POST(req);

        expect(response.status).toBe(403);
        expect(findFirstMock).not.toHaveBeenCalled();
        expect(createMock).not.toHaveBeenCalled();
    });

    it('proceeds and writes to the database when authorized', async () => {
        getAuthErrorMock.mockResolvedValue(undefined);
        findFirstMock.mockResolvedValue({ id: 'type-1', typeName: 'someType' });
        createMock.mockResolvedValue({});
        const req = createPostRequest({ url: 'https://example.com', type: 'someType' });

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(findFirstMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledTimes(1);
    });
});
