// Import commands.js
import './commands';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        export type Options = Partial<Loggable & Timeoutable & Withinable & Shadow>;

        interface Chainable {
            /**
             * @description Set viewport size of the test.
             * @param res - Either an array with entries width and height or a string representing the presets Cypress provides.
             */
            setResolution(res: [number, number] | ViewportPreset): Chainable;

            /**
             * @description Visit the viewer page of the given AAS ID.
             * @param {string} aasId - The AAS ID for the AAS we want to view.
             */
            visitViewer(aasId: string): Chainable;

            /**
             * @description Get an element by its data-testid value.
             * @param {string} dataTestId - The data-testid of the element we want to get.
             * @param option - Options passed to internal get method.
             */
            getByTestId(dataTestId: string, option?: Options): Chainable;

            /**
             * @description Find an element by its data-testid value.
             * @param {string} dataTestId - The data-testid of the element we want to find.
             */
            findByTestId(dataTestId: string): Chainable;

            /**
             * @description Make a request to /repo/shells/base64EncodedAasId
             * @param requestMethod - The request method. For example PUT, GET, DELETE, ...
             * @param urlPath - Url path where the request will be sent
             * @param requestBody - The request body
             */
            repoRequest(requestMethod: string, urlPath: string, requestBody: string | object | null): Chainable;

            /**
             * @description Make a request to the integrated BaSyx registry (proxied under
             * /registry), e.g. to delete an orphaned shell or submodel descriptor.
             * @param requestMethod - The request method. For example DELETE, GET, ...
             * @param urlPath - Url path (relative to /registry) where the request will be sent
             */
            registryRequest(requestMethod: string, urlPath: string): Chainable;

            /**
             * @description Poll the AAS repository (through the proxy) until it answers
             * successfully, so data seeding does not run against a not-yet-ready backend.
             */
            waitForRepoReady(): Chainable;

            /**
             * @description POST a resource to the repository as seed data, retrying on
             * transient failures and throwing if it ultimately cannot be created. Treats
             * 409 (already exists) as success so seeding stays idempotent.
             * @param urlPath - Url path where the resource will be created, e.g. '/shells'
             * @param body - The resource body to create
             */
            postSeed(urlPath: string, body: string | object): Chainable;

            /**
             * @description Seed a shell idempotently. Clears any orphaned registry
             * descriptor and stale repository shell before creating it, so basyx-go's
             * integrated-registry auto-registration cannot fail with a 409 conflict.
             * @param aasBody - The shell body to create (must contain an `id`)
             */
            postShell(aasBody: { id: string } & Record<string, unknown>): Chainable;

            /**
             * @description Seed a submodel idempotently. Clears any orphaned registry
             * descriptor and stale repository submodel before creating it.
             * @param submodelBody - The submodel body to create (must contain an `id`)
             */
            postSubmodel(submodelBody: { id: string } & Record<string, unknown>): Chainable;

            /**
             * @description Put the test AAS found under cypress/fixtures/ to the repo
             */
            postTestAas(): Chainable;

            /**
             * @description Delete the test AAS found under cypress/fixtures/ from the repo
             */
            deleteTestAas(): Chainable;

            /**
             * @description Delete the test AAS Bom Component found under cypress/fixtures/ from the repo
             */
            deleteTestAasBomComponent(): Chainable;

            /**
             * @description Put the test AAS found in cyListAasMockData.json to the repo
             */
            postListAasMockData(): Chainable;

            /**
             * @description Delete the test AAS found in cyListAasMockData.json from the repo
             */
            deleteListAasMockData(): Chainable;

            /**
             * @description Put a Submodel to an existing AAS
             * @param base64EncodedAasId - The base64 encoded AasId of the shell to put the submodel to
             * @param submodelBody - The body of the submodel
             * @param submodelRef - The reference to the submodel
             */
            postSubmodelToAas(
                base64EncodedAasId: string,
                submodelBody: { id: string } & Record<string, unknown>,
                submodelRef: string | object,
            ): Chainable;

            /**
             * @description Posts compare mock data into the repository
             */
            postCompareMockData(): Chainable;

            /**
             * @description Deletes compare mock data into the repository
             */
            deleteCompareMockData(): Chainable;

            /**
             * @description Posts compare mock data into the repository
             */
            postQrScannerMockData(): Chainable;

            /**
             * @description Deletes compare mock data into the repository
             */
            deleteQrScannerMockData(): Chainable;

            /**
             * Call the Scanner callback function with the given string.
             *
             * @param value The value to be given to the Callback.
             */
            callScannerCallback(value: string): Chainable;

            /**
             * Checks, if a notification is sent through the notificationSpawner.
             *
             * @param msg The message to search for.
             */
            isNotificationSent(msg: string): Chainable;

            postTestThumbnailAas(): Chainable;

            deleteTestThumbnailAas(): Chainable;

            uploadThumbnailToAas(aasId: string): Chainable;

            deleteThumbnailFromAas(aasId: string): Chainable;

            keycloakLogin(login: string, password: string): Chainable;

            keycloakLogout(): Chainable;
        }
    }
}

// Ensure the backend data path is ready before any spec seeds or reads data.
// This prevents cold-start races where seeding POSTs are silently dropped.
before(() => {
    cy.waitForRepoReady();
});
