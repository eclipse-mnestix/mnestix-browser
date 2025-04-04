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

#### Run prettier check

```sh
yarn prettier
```

#### Run prettier (be aware, this changes files!)

```sh
yarn format
```

#### Check your code for formatting issues

```sh
yarn lint
```

If you want specific files or folders to be excluded from linting (e.g. generated files), you can add them
to `.eslintignore` and `.prettierignore`

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
