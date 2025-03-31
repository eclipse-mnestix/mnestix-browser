import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom/jest-globals';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            /**
             * @deprecated
             */
            [key: string]: never;
        }
    }
}
