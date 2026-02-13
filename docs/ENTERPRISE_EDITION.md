# Enterprise Edition Setup Guide

This guide explains how to set up the Enterprise Edition (EE) extension for Mnestix using git submodules.

## Architecture Overview

The Enterprise Edition uses a build-time code generation approach to keep the Community Edition (CE) repository completely free of EE code while still allowing seamless EE builds.

- **CE Repository**: Contains only open-source routes and components
- **EE Submodule**: Private repository containing enterprise-specific routes and features
- **Build-time Assembly**: Merges CE + EE routes into a temporary directory before Next.js builds

## Setup Steps

### 1. Install Required Dependencies

```bash
yarn add --dev fs-extra @types/fs-extra
```

### 2. Add the EE Submodule (when ready)

```bash
# Add the EE private repository as a submodule
git submodule add <your-private-ee-repo-url> ee

# Initialize and update submodules
git submodule init
git submodule update --remote
```

### 3. EE Directory Structure

The EE submodule should follow this structure:

```
ee/
└── app-ee/                    # EE routes that mirror the [locale] structure
    └── [locale]/              # Locale-specific routes
        └── ee/                # EE-specific pages
            ├── admin/
            │   └── page.tsx
            ├── settings/
            │   └── page.tsx
            └── viewer/
                └── audit/
                    └── page.tsx
```

### 4. Building Different Editions

#### Community Edition (default)

```bash
yarn build
# or explicitly
EDITION=ce yarn build
```

#### Enterprise Edition

```bash
EDITION=ee yarn build
```

### 5. Development Workflow

#### CE Development

- Work in `src/app/[locale]/...` as usual
- All changes are CE-only and safe to commit to the OSS repo

#### EE Development

- Work in `ee/app-ee/[locale]/ee/...`
- EE routes are private and contained in the submodule
- Use `EDITION=ee yarn dev` to test locally with EE features

#### Full-stack Development

```bash
# Start with EE features enabled locally
EDITION=ee yarn dev
```

## CI/CD Configuration

### GitHub Actions Example

```yaml
name: Build Both Editions
on: [push, pull_request]

jobs:
    build:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                edition: [ce, ee]

        steps:
            - name: Checkout with submodules
              uses: actions/checkout@v4
              with:
                  fetch-depth: 0
                  submodules: recursive # Important: pulls EE at pinned commit

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: 24
                  cache: 'yarn'

            - name: Install dependencies
              run: yarn install --frozen-lockfile

            - name: Build ${{ matrix.edition }} edition
              run: EDITION=${{ matrix.edition }} yarn build
              env:
                  MNX_EE_LICENSE_KEY: ${{ secrets.MNX_EE_LICENSE_KEY }}
```

## Environment Variables

### EE-specific Environment Variables

- `EDITION`: Set to `ce` or `ee` to control which edition is built
- `MNX_EE_LICENSE_KEY`: Enterprise license key for EE builds

### Build Process

1. **Assembly Phase**: The `tools/assemble-app.ts` script:
    - Copies all CE routes from `src/app`
    - If `EDITION=ee`, merges EE routes from `ee/app-ee`
    - Creates `.generated/app` with the combined route tree

2. **Symlink Phase**: Creates a symlink from `src/app` to `.generated/app`

3. **Build Phase**: Next.js builds from the assembled route tree

## EE Route Examples

### Example Enterprise Route

```typescript
// ee/app-ee/[locale]/ee/admin/page.tsx
import { useTranslations } from 'next-intl';

export default function AdminPage() {
  const t = useTranslations('ee.admin');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Example EE Component Override

```typescript
// ee/app-ee/[locale]/viewer/[base64Aas]/page.tsx
// This would override the CE viewer with EE features
import { ViewerPageEE } from '../../../components/ViewerEE';

export default ViewerPageEE;
```

## Translations

EE translations should be added to locale files in the EE submodule:

```
ee/
└── locale/
    ├── en.json
    └── de.json
```

The build system can merge these with CE translations if needed.

## Security & Access Control

- EE routes should implement proper access control
- Use middleware to gate EE features based on licensing/entitlement
- Keep sensitive EE logic in the private submodule

## Troubleshooting

### Submodule Issues

```bash
# Update submodule to latest
git submodule update --remote

# Reset submodule if corrupted
git submodule deinit ee
git submodule init
git submodule update
```

### Build Issues

```bash
# Clean generated files
rm -rf .generated
yarn prebuild

# Force rebuild
yarn clean && yarn build
```

### Windows Symlink Issues

If symlinks fail on Windows, the build script automatically falls back to copying the generated directory.
