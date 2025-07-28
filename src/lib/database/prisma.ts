import { PrismaClient } from '@prisma/client';

/**
 * For using prisma with Next.js, it is recommended to use the PrismaClient as Singleton.
 */
const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
