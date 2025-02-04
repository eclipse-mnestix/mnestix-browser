> [!TIP]
> You may add `-d` to most `yarn docker:` scripts to start up the docker images in detached mode.
> You will not see the output of every container, but just the startup status.
> This might be of value if you use another service to monitor docker.

### Development technologies

- Next.js

### Prerequisites

Before you begin, ensure you have the following tools installed on your system:

1. **Node.js**

2. **Yarn**

3. **Docker**: Docker is required to create and run the application containers.

    - [Install Docker](https://docs.docker.com/get-docker/)

4. **Docker Compose**: Docker Compose is a tool for defining and running multi-container Docker applications.
    - [Install Docker Compose](https://docs.docker.com/compose/install/)

Windows users may use WSL for their docker instance.

### Run Mnestix as Complete AAS Application

The easiest way to get Mnestix up and running is by using the prepared development environment.
This setup includes:

- Mnestix Browser (This repository)
- Mnestix Backend
- BaSyx Repository
- BaSyx Discovery Service
- BaSyx Registry
- BaSyx Submodel Registry

To start all mentioned services together, run the following command:

```shell
yarn docker:dev
```

This will build the Mnestix Browser and start all mentioned services with a default configuration, to adapt this setup
have a look at [configuration](mnestix-configuration-settings).
The Mnestix Browser is now running on http://localhost:3000.

### Install Mnestix Browser from local build

Install all packages for the frontend.

```sh
yarn install
```

### Run Mnestix through IDE

If you want to start the browser through your IDE separately start BaSyx and the backend with

```shell
yarn docker:backend
```

In your IDE you can then simply start the dev environment with hot reloading by running

```shell
yarn dev
```

The Mnestix Browser is now running on http://localhost:3000 and will update on changed files.

If you want to activate debug breakpoints in the code, you may have to open the website through a debug environment:

- In `JetBrains WebStorm` you can run a debug browser with the `JS Debug` run configuration.
- In `Visual Studio Code` you can set up a debug browser by creating a `launch.json` file in the `Run and Debug` tab and
  create a run configuration for your preferred browser.

You may need to set the initial URL to http://localhost:3000.

### Other launch options

To check what other options exist to run the Mnestix Browser, see the yarn scripts in `package.json`. Highlights are:

- `yarn dev` to start the browser in a hot reloading dev environment.
- `yarn prettier`, `yarn format` and `yarn lint` to apply code formatting and linting.
- `yarn test` and `yarn test:headless` to run cypress tests locally.
- `yarn docker:prod` will build everything with the production flag.
- `yarn docker:test` will run all tests in the docker environment.
- `yarn docker:prune` will stop all docker containers, remove them from the list and prune all volumes. Start with a
  blank slate :)
- `yarn docker:keycloak` will setup a local keycloak instance and start Mnestix with keycloak support enabled
