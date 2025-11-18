import nextJest from 'next/jest.js';
import { Config } from 'jest';
import { TextDecoder, TextEncoder } from 'util';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

const config: Config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    modulePathIgnorePatterns: ['cypress', 'dist/standalone/'],
    globals: {
        TextEncoder: TextEncoder,
        TextDecoder: TextDecoder,
    },
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest', {
            jsc: {
                parser: {
                    syntax: 'typescript',
                    tsx: true,
                    dynamicImport: true,
                },
                transform: {
                    react: {
                        runtime: 'automatic',
                    },
                },
            },
            module: {
                type: 'commonjs',
            },
        }],
    },
    // mock all svg files
    moduleNameMapper: {
        '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.tsx',
    },
    testMatch: ['**/__tests__/**/*.tsx', '**/?(*.)+(spec|test).tsx'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transformIgnorePatterns: [],
};

export default async function (...args: any): Promise<Config> {
    const fn = createJestConfig(config);
    // @ts-expect-error We don't know the type
    const res = await fn(...args);

    // Transform specific ES module packages in node_modules
    res.transformIgnorePatterns = [
        ...res.transformIgnorePatterns!.filter((pattern) => !pattern.includes('/node_modules/')),
        '/node_modules/(?!(uuid|flat)/)'
    ];

    return res;
}
