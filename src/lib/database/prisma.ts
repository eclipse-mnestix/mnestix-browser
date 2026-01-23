import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../../prisma/generated/client';

/**
 * For using prisma with Next.js, it is recommended to use the PrismaClient as Singleton.
 */
const prismaClientSingleton = () => {
    const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/database/mnestix-database.db' });
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
