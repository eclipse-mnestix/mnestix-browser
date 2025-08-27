import { envs } from 'lib/env/MnestixEnv';
import { InfrastructureConnection, InfrastructureSecurity } from 'lib/services/database/InfrastructureMappedTypes';
import { decryptSecret } from './Encryption';

export function createSecurityHeaders(infrastructure: InfrastructureConnection): Record<string, string> | null {
    const securityType = infrastructure.infrastructureSecurity?.securityType;
    const securityData = infrastructure.infrastructureSecurity as InfrastructureSecurity;
    const header = envs.MNESTIX_V2_ENABLED ? 'X-API-KEY' : 'ApiKey';

    if (!securityData || !securityType) {
        return null;
    }

    switch (securityType) {
        case 'NONE':
            return null;
        case 'HEADER': {
            // Return the header configuration for HEADER security type
            if (securityData.securityHeader?.name === undefined) return null;

            const headerValue = decryptSecret(
                securityData.securityHeader?.value || '',
                securityData.securityHeader?.iv || '',
                securityData.securityHeader?.authTag || '',
            );

            return {
                [securityData.securityHeader.name]: headerValue,
            };
        }
        case 'PROXY': {
            // Return proxy authorization header
            const headerValue = decryptSecret(
                securityData.securityProxy?.value || '',
                securityData.securityProxy?.iv || '',
                securityData.securityProxy?.authTag || '',
            );
            return {
                [header]: headerValue,
            };
        }
        default:
            return null;
    }
}
