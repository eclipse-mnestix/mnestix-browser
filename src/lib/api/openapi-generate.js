#!/usr/bin/env node
/* eslint-disable no-undef */

import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// In IDE process is not defined as we are in a browser context
process.on('uncaughtException', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});

const script_dir = dirname(fileURLToPath(import.meta.url));
process.chdir(script_dir);

function run(command) {
    execSync(command, { stdio: 'inherit', shell: true });
}

// cli cannot be run from yarn as this ignores the config file
run('npx --yes --package @openapitools/openapi-generator-cli@2.20.0 openapi-generator-cli generate');

// Format generated TypeScript so there are nicer diffs
run(`yarn prettier --write "${script_dir}/aas/**/*.ts"`);

// Apply patches
const patchDir = join(script_dir, 'patches');
const patches = readdirSync(patchDir)
    .filter((name) => name.endsWith('.patch'))
    .sort();

for (const patch of patches) {
    const patchPath = join(patchDir, patch);
    console.log(`Applying patch ${patchPath}`);
    run(`git apply --whitespace=fix "${patchPath}"`);
}
