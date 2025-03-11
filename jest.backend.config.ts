import { Config } from 'jest';

const config: Config = {
    moduleDirectories: ['node_modules', 'src'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    modulePathIgnorePatterns: ['cypress'],
};

export default config;
