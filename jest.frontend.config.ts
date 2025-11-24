import nextJest from 'next/jest.js';
import type { Config } from 'jest';
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
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    // mock all svg files
    moduleNameMapper: {
        '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.tsx',
    },
    testMatch: ['**/__tests__/**/*.tsx', '**/?(*.)+(spec|test).tsx'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transformIgnorePatterns: ['/node_modules/(?!(flat)/)'],
};

export default async (...args: any): Promise<Config> => {
    const fn = createJestConfig(config);
    // @ts-expect-error We don't know the type
    const res = await fn(...args);

    // Don't ignore specific node_modules during transformation. This is needed if a node_module doesn't return valid JavaScript files.
    res.transformIgnorePatterns = [
        ...res.transformIgnorePatterns!.filter((pattern) => !pattern.includes('/node_modules/')),
        '/node_modules/(?!.+)',
    ];

    return res;
};
