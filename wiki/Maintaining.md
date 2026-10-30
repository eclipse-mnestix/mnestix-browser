### Setting up VSCode

#### Extensions

See `.vscode/extensions.json` for a list of recommended extensions.
VSCode will suggest to install them when opening the project.

#### Settings

See `.vscode/settings.json` for defined workspace settings.

### Setting up Rider

Check the configurations for Rider under `.idea/` folder

### Installing and adding/removing frontend packages

### Formatting & Linting

We use Prettier and ESLint to keep our frontend code clean. Having a ESLint warning **will break the pipeline**. It's
therefore always a good idea to run `yarn format` and `yarn lint` before you commit.

#### Run prettier (be aware, this changes files!)

```sh
yarn format
```

#### Check your code for formatting issues

```sh
yarn lint
```

If you want specific files or folders to be excluded from linting (e.g. generated files), you can add them
to the `ignores` config in `eslint.config.js` and to `.prettierignore`

### Cypress Testing

We use Cypress for End-to-End-Testing. In order to navigate to the right folder and run Cypress you can use the
following command. In order to use cypress testing the Mnestix Browser must be running.

#### Open the cypress application

```sh
yarn test
```

#### Run cypress headless (runs all tests inside the integration folder)

```sh
yarn test:headless
```

Cypress will put videos and screenshots of the tests inside the cypress folder.

In order to run your own E2E-Tests you can put your test files in `/cypress/e2e`.

In the `fixtures` folder you can put data to use in your E2E-Tests as json files.

If you have commands you want to use in multiple tests you can put them into the `commands.ts` file inside
the `support` folder.
Don't forget to write the method header of your custom commands inside the `e2e.ts` file as well. This way the IDE
will stop marking your custom commands as wrong.

### Reverse Proxy Configuration

The YARP proxy route `/repo/shells` now limits resource and list returns to 104 elements due to the lack of pagination
support.
This change aims to prevent server overload and ensure smoother navigation through resource lists.


### Regenerate the OpenAPI clients
There are two generated OpenAPI clients. Regenerate them with:

```sh
yarn generate-aas-apis        # BaSyx AAS client
yarn generate-mnestix-apis    # Mnestix AAS Generator client
```

#### Mnestix AAS Generator client

Configured via `src/lib/api/mnestix-aas-generator/openapitools.json`. This one runs `openapi-generator-cli` directly,
so the `inputSpec` and `generator-cli.version` can be freely changed, e.g. to point at a different swagger/OpenAPI
URL or version.

#### BaSyx AAS client

Configured via `src/lib/api/aas/openapitools.json`, but **not every setting can be changed freely here**.
`src/lib/api/aas/openapi-generate.js` wraps the generator call with a workaround for an
[openapi-generator bug](https://github.com/OpenAPITools/openapi-generator/issues/22587) that crashes on the AAS
spec's recursive AASQL schemas when the spec is processed via the OpenAPI 3.1 code path. This imposes the following
constraints:

- **`inputSpec` must be a `raw.githubusercontent.com` URL** of the form
  `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path-to-entry-file>`. The script parses the owner, repo,
  ref and entry file path out of this URL to `git clone` the spec repository (needed to keep relative `$ref`s
  between the spec's files intact). Pointing it at a URL that doesn't match this pattern (e.g. a SwaggerHub or local
  file URL) will make the script throw an opaque `TypeError` instead of a helpful error message.
- **`git` must be available on `PATH`**, since the script shells out to `git clone`.
- The script **rewrites the entry file's `openapi: 3.1.x` version declaration down to `3.0.3`** in the cloned repo
  before generating, so that `openapi-generator` uses its OpenAPI 3.0 code path. This only works if the spec doesn't
  actually rely on any OpenAPI-3.1-only features (e.g. `type` arrays, `const`, `prefixItems`, numeric
  `exclusiveMinimum`/`exclusiveMaximum`). If a future spec version starts using such features, this downgrade will
  silently produce an incorrect client, and the workaround/version pin will need to be revisited.

If you only need to bump the spec version (same repo, same constraints as above), you can still just change the
`ref` segment of the `inputSpec` URL and the `generator-cli.version`. Changing the spec source to something other
than a GitHub-raw URL requires adjusting `openapi-generate.js` itself.