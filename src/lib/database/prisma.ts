import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '../../constants';

/**
 * For using prisma with Next.js, it is recommended to use the PrismaClient as Singleton.
 */
const prismaClientSingleton = () => {
    const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
