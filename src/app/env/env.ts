'use server';

import * as path from 'node:path';
import * as fs from 'node:fs';
import * as process from 'node:process';

export const getEnv = async (): Promise<EnvironmentalVariables> => {
    // Feature Flags
    const featureFlags = {
        LOCK_TIMESERIES_PERIOD_FEATURE_FLAG:
            process.env.LOCK_TIMESERIES_PERIOD_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase(),
        AUTHENTICATION_FEATURE_FLAG: false,
        COMPARISON_FEATURE_FLAG: process.env.COMPARISON_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase(),
        TRANSFER_FEATURE_FLAG: process.env.TRANSFER_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase(),
        AAS_LIST_FEATURE_FLAG: process.env.AAS_LIST_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase(),
        AAS_LIST_V2_FEATURE_FLAG:  process.env.AAS_LIST_V2_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase(),
    };

    // If BackendAPI is present evaluate the FeatureFlags else they stay the default value
    if (process.env.MNESTIX_BACKEND_API_URL) {
        featureFlags.AUTHENTICATION_FEATURE_FLAG =
            process.env.AUTHENTICATION_FEATURE_FLAG?.toLowerCase() === 'true'.toLowerCase();
    }

    if (
        !process.env.MNESTIX_BACKEND_API_URL &&
        featureFlags.AAS_LIST_FEATURE_FLAG &&
        !featureFlags.AAS_LIST_V2_FEATURE_FLAG
    ) {
        console.warn('Only AAS_LIST_V2_FEATURE_FLAG environment variables can be set without Mnestix API');
        featureFlags.AAS_LIST_V2_FEATURE_FLAG = true;
    }

    const otherVariables = {
        AD_CLIENT_ID: process.env.AD_CLIENT_ID,
        AD_TENANT_ID: process.env.AD_TENANT_ID,
        APPLICATION_ID_URI: process.env.APPLICATION_ID_URI,
        DISCOVERY_API_URL: process.env.DISCOVERY_API_URL,
        REGISTRY_API_URL: process.env.REGISTRY_API_URL,
        SUBMODEL_REGISTRY_API_URL: process.env.SUBMODEL_REGISTRY_API_URL,
        AAS_REPO_API_URL: process.env.AAS_REPO_API_URL,
        SUBMODEL_REPO_API_URL: process.env.SUBMODEL_REPO_API_URL,
        MNESTIX_BACKEND_API_URL: process.env.MNESTIX_BACKEND_API_URL,
        KEYCLOAK_ENABLED: process.env.KEYCLOAK_ENABLED?.toLowerCase() === 'true'.toLowerCase(),
        IMPRINT_URL: process.env.IMPRINT_URL,
        DATA_PRIVACY_URL: process.env.DATA_PRIVACY_URL,
    };

    const themingVariables = {
        THEME_PRIMARY_COLOR: process.env.THEME_PRIMARY_COLOR,
        THEME_SECONDARY_COLOR: process.env.THEME_SECONDARY_COLOR,
        THEME_BASE64_LOGO: process.env.THEME_LOGO_MIME_TYPE ? '' : undefined,
        THEME_LOGO_URL: process.env.THEME_LOGO_URL,
    };

    // Load the image from the public folder and provide it to the theming as base64 image with mime type
    // possible TODO automatically parse mimetype but not based on file path but on file content
    if (process.env.THEME_LOGO_MIME_TYPE && process.env.THEME_LOGO_MIME_TYPE.startsWith('image/')) {
        try {
            const imagePath = path.resolve('./public/logo');
            const imageBuffer = fs.readFileSync(imagePath);
            const imageBase64 = imageBuffer.toString('base64');
            themingVariables.THEME_BASE64_LOGO = `data:${process.env.THEME_LOGO_MIME_TYPE};base64,${imageBase64}`;
        } catch {
            console.error('Could not load Logo, using default...');
        }
    }

    return { ...featureFlags, ...otherVariables, ...themingVariables };
};

export type EnvironmentalVariables = {
    AD_CLIENT_ID: string | undefined;
    AD_TENANT_ID: string | undefined;
    APPLICATION_ID_URI: string | undefined;
    LOCK_TIMESERIES_PERIOD_FEATURE_FLAG: boolean;
    AUTHENTICATION_FEATURE_FLAG: boolean;
    COMPARISON_FEATURE_FLAG: boolean;
    AAS_LIST_FEATURE_FLAG: boolean;
    AAS_LIST_V2_FEATURE_FLAG: boolean;
    TRANSFER_FEATURE_FLAG: boolean;
    DISCOVERY_API_URL: string | undefined;
    REGISTRY_API_URL: string | undefined;
    SUBMODEL_REGISTRY_API_URL: string | undefined;
    AAS_REPO_API_URL: string | undefined;
    SUBMODEL_REPO_API_URL: string | undefined;
    MNESTIX_BACKEND_API_URL: string | undefined;
    THEME_PRIMARY_COLOR: string | undefined;
    THEME_SECONDARY_COLOR: string | undefined;
    THEME_BASE64_LOGO: string | undefined;
    THEME_LOGO_URL: string | undefined;
    KEYCLOAK_ENABLED: boolean;
    IMPRINT_URL: string | undefined;
    DATA_PRIVACY_URL: string | undefined;
};
