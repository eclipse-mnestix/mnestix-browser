import { envs } from 'lib/env/MnestixEnv';
import { validateEnvs } from 'lib/env/validateEnvs';

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // This is file is indented to setup Telemetry by vercel but as this
        // file is only run once on server startup we use it for validation too.
        validateEnvs(envs);
    }
}
