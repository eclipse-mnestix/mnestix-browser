import { Config } from 'jest';

const config: Config = {
    moduleDirectories: ['node_modules', 'src'],
    // Next aliases the bare `server-only` specifier during a build, but Jest does not. Map it to the no-op
    // `empty.js` that Next vendors — the copy its `react-server` export condition resolves to in a server
    // context. (`index.js` is the client-context stub, which throws on import by design.)
    moduleNameMapper: {
        '^server-only$': '<rootDir>/node_modules/next/dist/compiled/server-only/empty.js',
    },
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    modulePathIgnorePatterns: ['cypress', 'dist/standalone/'],
};

export default config;
