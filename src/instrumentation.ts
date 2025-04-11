import { validateEnvs } from '../scripts/validateEnvs.js';

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // This is file is indented to setup Telemetry by vercel but as this
        // file is only run once on server startup we use it for validation too.
        if (process.env.NODE_ENV === 'development') {
            // Envs are already validated in start.sh but this is for development.
            validateEnvs(process.env);
        }
    }
}
