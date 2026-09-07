import { envs } from 'lib/env/MnestixEnv';
import { getServerSession } from 'next-auth';
import { authOptions } from 'components/authentication/authConfig';
import { MnestixRole } from 'components/authentication/AllowedRoutes';

export class AuthorizationError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'AuthorizationError';
        this.status = status;
    }
}

export type AuthError = { status: number; message: string };

/**
 * Non-throwing authorization check. Returns an {@link AuthError} when the caller is not allowed,
 * or `undefined` when the request may proceed. Passes through when authentication is disabled.
 */
export async function getAuthError(allowed: MnestixRole[]): Promise<AuthError | undefined> {
    if (!envs.AUTHENTICATION_FEATURE_FLAG) {
        return undefined;
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return { status: 401, message: 'Unauthorized' };
    }

    const roles = session.user.roles ?? [];
    if (!allowed.some((role) => roles.includes(role))) {
        return { status: 403, message: 'Forbidden' };
    }

    return undefined;
}

/** Throwing guard for server actions. Throws {@link AuthorizationError} when the caller lacks an allowed role. */
export async function requireRole(...allowed: MnestixRole[]): Promise<void> {
    const error = await getAuthError(allowed);
    if (error) {
        throw new AuthorizationError(error.status, error.message);
    }
}

export async function requireAdmin(): Promise<void> {
    return requireRole(MnestixRole.MnestixAdmin);
}
