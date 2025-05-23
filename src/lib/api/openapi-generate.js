#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// In IDE process is not defined as we are in a browser context
process.on('uncaughtException', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.chdir(__dirname);

function run(command) {
    execSync(command, { stdio: 'inherit', shell: true });
}

// cli cannot be run from yarn as this ignores the config file
run('npx --yes --package @openapitools/openapi-generator-cli@2.20.0 openapi-generator-cli generate');

// Format generated TypeScript so there are nicer diffs
run('npx --yes --package prettier@3.5.3 prettier --write "aas/**/*.ts"');

// Apply patches
const patchDir = join(__dirname, 'patches');
const patches = readdirSync(patchDir)
    .filter((name) => name.endsWith('.patch'))
    .sort();

for (const patch of patches) {
    const patchPath = join(patchDir, patch);
    console.log(`Applying patch ${patchPath}`);
    run(`git apply "${patchPath}"`);
}
