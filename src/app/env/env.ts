'use server';

import { publicEnvs } from 'MnestixEnv';

export const getEnv = async () => {
    // Feature Flags
    return publicEnvs;
};
