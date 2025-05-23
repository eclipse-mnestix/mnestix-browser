#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Exit on errors (similar to `set -e`)
process.on('uncaughtException', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});

// Get current script directory (works in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to script directory
process.chdir(__dirname);

// Run OpenAPI Generator CLI
execSync('../../../node_modules/.bin/openapi-generator-cli generate', { stdio: 'inherit' });

// Format generated TypeScript files with Prettier
execSync('../../../node_modules/.bin/prettier --write aas/**/*.ts', { stdio: 'inherit' });

// Apply all patches in order
const patchDir = join(__dirname, 'patches');
const patches = readdirSync(patchDir)
    .filter((name) => name.endsWith('.patch'))
    .sort();

for (const patch of patches) {
    const patchPath = join(patchDir, patch);
    console.log(`Applying patch ${patchPath}`);
    execSync(`git apply "${patchPath}"`, { stdio: 'inherit' });
}
