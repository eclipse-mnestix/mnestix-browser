'use client';
import React, { createContext, useContext, useState } from 'react';
import { getEnv } from './env';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';

type EnvironmentalVariables = Awaited<ReturnType<typeof getEnv>>;

export const initialEnvValues: EnvironmentalVariables = {
    AAS_LIST_FEATURE_FLAG: false,
    COMPARISON_FEATURE_FLAG: false,
    TRANSFER_FEATURE_FLAG: false,
    AUTHENTICATION_FEATURE_FLAG: false,
    LOCK_TIMESERIES_PERIOD_FEATURE_FLAG: false,
    KEYCLOAK_ENABLED: false,
    DISCOVERY_API_URL: '',
    REGISTRY_API_URL: '',
    SUBMODEL_REGISTRY_API_URL: '',
    AAS_REPO_API_URL: '',
    SUBMODEL_REPO_API_URL: '',
    MNESTIX_BACKEND_API_URL: '',
    THEME_PRIMARY_COLOR: undefined,
    THEME_SECONDARY_COLOR: undefined,
    THEME_BASE64_LOGO: undefined,
    THEME_LOGO_URL: undefined,
    IMPRINT_URL: '',
    DATA_PRIVACY_URL: '',
    USE_BASYX_RBAC: false,
    WHITELIST_FEATURE_FLAG: false,
    SUBMODEL_WHITELIST: '',
};

export const EnvContext = createContext(initialEnvValues);

export const EnvProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [env, setEnv] = useState<EnvironmentalVariables>(initialEnvValues);
    const [renderChildren, setChildren] = useState<boolean>(false);
    useAsyncEffect(async () => {
        const env = await getEnv();
        setEnv(env);
        setChildren(true);
    }, []);

    return renderChildren ? (
        <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
    ) : (
        <CenteredLoadingSpinner />
    );
};

export const useEnv = () => {
    return useContext(EnvContext);
};
