#!/usr/bin/env node
/* eslint-disable no-undef */

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
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

const { generatorName, inputSpec, output, additionalProperties } = JSON.parse(
    readFileSync(join(script_dir, 'openapitools.json'), 'utf-8'),
)['generator-cli'].generators['aas-api'];

// The upstream spec declares "openapi: 3.1.0", which makes openapi-generator fully
// inline the recursive AASQL query schemas (boolOperand, logicalExpression, Query, ...)
// using its OpenAPI 3.1/JSON-Schema code path. That path crashes with a Jackson
// "Document nesting depth exceeds the maximum allowed" error on these self-referencing
// schemas (https://github.com/OpenAPITools/openapi-generator/issues/22587, still open,
// reproduced up to generator version 7.26.0). The spec itself doesn't use any
// OpenAPI-3.1-only features (verified: no 3.1-only type-array/const/prefixItems/numeric
// exclusiveMinimum usage anywhere in the spec), so we clone the spec repository, downgrade
// the entry file's declared version to 3.0.3, and let the generator use its OpenAPI 3.0
// code path instead, which resolves the same recursive schemas without issue. Cloning the
// whole repo (instead of just patching the entry file) keeps all relative $refs between the
// spec's files intact, since openapi-generator resolves nested relative $refs against the
// spec repository's directory layout rather than against each referenced file's own location.
const inputSpecUrl = new URL(inputSpec);
const [, owner, repo, ref, entryFilePath] = inputSpecUrl.pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
const cloneDir = join(script_dir, '.tmp-spec-repo');
try {
    run(`git clone --quiet --depth 1 --branch "${ref}" "https://github.com/${owner}/${repo}.git" "${cloneDir}"`);

    const entryFileAbsolutePath = join(cloneDir, entryFilePath);
    const patchedSpec = readFileSync(entryFileAbsolutePath, 'utf-8').replace(
        /^openapi:\s*3\.1\.\d+\s*$/m,
        'openapi: 3.0.3',
    );
    writeFileSync(entryFileAbsolutePath, patchedSpec);

    const additionalPropertiesArg = Object.entries(additionalProperties)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');

    // cli cannot be run from yarn as this ignores the config file
    run(
        `npx --yes --package @openapitools/openapi-generator-cli@2.20.0 openapi-generator-cli generate ` +
            `--input-spec="${entryFileAbsolutePath}" --generator-name="${generatorName}" --output="${output}" ` +
            `--additional-properties="${additionalPropertiesArg}"`,
    );
} finally {
    rmSync(cloneDir, { recursive: true, force: true });
}

// Format generated TypeScript so there are nicer diffs
run(`yarn prettier --write "${script_dir}/**/*.ts"`);

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
