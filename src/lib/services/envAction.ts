'use server';

/**
 * NextJs application normally use NEX_PUBLIC_ prefix for public envs. https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
 * This is not the case for Mnestix, because we don't want to have the prefix
 * before all our public envs.
 *
 * This decision costs about 100ms from out LCP (Largest Contentful Paint) time
 * which is tolerable for us.
 */

import { publicEnvs } from 'lib/env/MnestixEnv';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Action to load the public envs from server.
 */
export const getEnv = async () => {
    const THEME_BASE64_LOGO = publicEnvs.THEME_BASE64_LOGO || loadImage();

    // Disables the comparison feature for now as it is broken
    // TODO MNE-299: Make Comparison Feature work again
    publicEnvs.COMPARISON_FEATURE_FLAG = false;
    return {
        ...publicEnvs,
        THEME_BASE64_LOGO,
    };
};

function loadImage() {
    // Load the image from the public folder and provide it to the theming as base64 image with mime type
    if (
        !publicEnvs.THEME_BASE64_LOGO &&
        publicEnvs.THEME_LOGO_MIME_TYPE &&
        publicEnvs.THEME_LOGO_MIME_TYPE.startsWith('image/')
    ) {
        try {
            const imagePath = path.resolve('./public/logo');
            const imageBuffer = fs.readFileSync(imagePath);
            const imageBase64 = imageBuffer.toString('base64');
            return `data:${publicEnvs.THEME_LOGO_MIME_TYPE};base64,${imageBase64}`;
        } catch {
            console.error('Could not load Logo, using default...');
        }
    }
    return undefined;
}
