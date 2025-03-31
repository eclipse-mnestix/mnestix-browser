'use server';

import { publicEnvs } from 'MnestixEnv';
import path from 'node:path';
import fs from 'node:fs';

export const getEnv = async () => {
    const THEME_BASE64_LOGO = loadImage() || publicEnvs.THEME_BASE64_LOGO;

    return { ...publicEnvs, THEME_BASE64_LOGO };
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
