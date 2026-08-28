import { envs } from 'lib/env/MnestixEnv';
import { InfrastructureConnection, InfrastructureSecurity } from 'lib/services/database/InfrastructureMappedTypes';
import { decryptSecret } from './Encryption';
import { getServerSession } from 'next-auth';
import { authOptions } from 'components/authentication/authConfig';

export async function createSecurityHeaders(
    infrastructure?: InfrastructureConnection,
): Promise<Record<string, string> | null> {
    if (!infrastructure) {
        return null;
    }

    const securityType = infrastructure.infrastructureSecurity?.securityType;
    const securityData = infrastructure.infrastructureSecurity as InfrastructureSecurity;

    if (infrastructure.isDefault) {
        return createDefaultSecurityHeaders(await getBearerToken());
    }

    if (!securityData || !securityType) {
        return null;
    }

    switch (securityType) {
        case 'NONE':
            return null;
        case 'HEADER': {
            // Return the header configuration for HEADER security type
            if (!securityData.securityHeader || securityData.securityHeader.name === undefined) return null;

            const headerValue = decryptSecret(
                securityData.securityHeader.value,
                securityData.securityHeader.initVector,
                securityData.securityHeader.authTag,
            );

            return {
                [securityData.securityHeader.name]: headerValue,
            };
        }
        case 'PROXY': {
            // Return proxy authorization header
            if (!securityData.securityProxy) return null;

            const headerValue = decryptSecret(
                securityData.securityProxy.value,
                securityData.securityProxy.initVector,
                securityData.securityProxy.authTag,
            );
            return {
                ['X-API-KEY']: headerValue,
            };
        }
        default:
            return null;
    }
}

function createDefaultSecurityHeaders(bearerToken: string): Record<string, string> | null {
    if (envs.AUTHENTICATION_FEATURE_FLAG && bearerToken) {
        return {
            Authorization: `Bearer ${bearerToken}`,
        };
    } else if (!envs.AUTHENTICATION_FEATURE_FLAG) {
        return {
            ['X-API-KEY']: envs.MNESTIX_BACKEND_API_KEY || '',
        };
    }
    return null;
}

const getBearerToken = async () => {
    const session = await getServerSession(authOptions);
    if (session && session.accessToken) {
        return session.accessToken;
    } else {
        return '';
    }
};
