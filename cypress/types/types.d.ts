declare namespace Cypress {
    namespace Cypress {
        interface Chainable {
            setResolution(res: [number, number] | ViewportPreset): Chainable;
            visitViewer(aasId: string): Chainable;
            getByTestId(dataTestId: string): Chainable;
        }
    }
}
