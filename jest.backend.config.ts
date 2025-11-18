import { Config } from 'jest';

const config: Config = {
    moduleDirectories: ['node_modules', 'src'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    modulePathIgnorePatterns: ['cypress', 'dist/standalone/'],
    // Transform all node_modules to handle ES modules
    transformIgnorePatterns: [],
};

export default config;
