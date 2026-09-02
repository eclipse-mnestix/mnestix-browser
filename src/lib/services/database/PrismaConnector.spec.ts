import { PrismaConnector } from './PrismaConnector';
import type { InfrastructureFormData } from 'app/[locale]/settings/_components/mnestix-infrastructure/InfrastructureTypes';

// Mock the prisma client: $transaction runs its callback with a shared tx mock we can assert against.
jest.mock('lib/database/prisma', () => {
    const tx = {
        securityType: { findFirst: jest.fn() },
        mnestixInfrastructure: { create: jest.fn(), update: jest.fn() },
        mnestixConnection: { create: jest.fn(), findMany: jest.fn() },
        mnestixConnectionTypeRelation: { create: jest.fn() },
        connectionType: { findFirst: jest.fn() },
        securitySettingsHeader: { create: jest.fn(), deleteMany: jest.fn() },
        securitySettingsProxy: { create: jest.fn(), deleteMany: jest.fn() },
    };
    return {
        prisma: {
            __tx: tx,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            $transaction: jest.fn(async (cb: (tx: any) => unknown) => cb(tx)),
        },
    };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
const tx = (jest.requireMock('lib/database/prisma') as any).prisma.__tx;

function formData(overrides: Partial<InfrastructureFormData> = {}): InfrastructureFormData {
    return {
        name: 'Test Infra',
        securityType: 'HEADER',
        connections: [],
        ...overrides,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
}

describe('PrismaConnector security-header validation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        tx.securityType.findFirst.mockResolvedValue({ id: 'security-type-1' });
        tx.mnestixInfrastructure.create.mockResolvedValue({ id: 'infra-1' });
    });

    it.each(['Authorization', 'authorization', 'CoOkIe'])(
        'rejects a dangerous header key "%s" and never persists the header',
        async (headerName) => {
            const connector = PrismaConnector.create();

            await expect(
                connector.createInfrastructure(formData({ securityHeader: { name: headerName, value: 'v' } })),
            ).rejects.toThrow(/Invalid header key/);

            expect(tx.securitySettingsHeader.create).not.toHaveBeenCalled();
        },
    );

    it('rejects a header value with an injection payload and never persists the header', async () => {
        const connector = PrismaConnector.create();

        await expect(
            connector.createInfrastructure(formData({ securityHeader: { name: 'X-Custom', value: '<script>x</script>' } })),
        ).rejects.toThrow(/Invalid header value/);

        expect(tx.securitySettingsHeader.create).not.toHaveBeenCalled();
    });

    it('persists a valid header', async () => {
        const connector = PrismaConnector.create();

        await connector.createInfrastructure(formData({ securityHeader: { name: 'X-Custom-Token', value: 'abc123' } }));

        expect(tx.securitySettingsHeader.create).toHaveBeenCalledTimes(1);
    });
});
