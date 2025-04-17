import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom/jest-globals';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            /**
             * @deprecated use lib/env/MnestixEnv.ts:envs
             */
            [key: string]: never;
        }
    }

    interface Function {
        /**
         * @deprecated Function names are minified in production.
         */
        name: never;
    }
}
