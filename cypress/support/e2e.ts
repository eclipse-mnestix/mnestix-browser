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
                submodelBody: string | object,
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
