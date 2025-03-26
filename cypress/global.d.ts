declare global {
    interface Window {
        Cypress: {
            scannerCallback: (string: string) => Promise<void>;
        };
    }
}

export {};
