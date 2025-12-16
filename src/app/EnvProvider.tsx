'use client';
import React, { createContext, useContext, useState } from 'react';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { getEnv } from 'lib/services/envAction';

type EnvironmentalVariables = Awaited<ReturnType<typeof getEnv>>;

export const initialEnvValues: EnvironmentalVariables = {
    AAS_LIST_FEATURE_FLAG: false,
    COMPARISON_FEATURE_FLAG: false,
    TRANSFER_FEATURE_FLAG: false,
    EXPERIMENTAL_PRODUCT_VIEW_FEATURE_FLAG: false,
    KEYCLOAK_ENABLED: false,
    LOCK_TIMESERIES_PERIOD_FEATURE_FLAG: false,
    DISCOVERY_API_URL: undefined,
    REGISTRY_API_URL: undefined,
    SUBMODEL_REGISTRY_API_URL: undefined,
    AAS_REPO_API_URL: undefined,
    SUBMODEL_REPO_API_URL: undefined,
    CONCEPT_DESCRIPTION_REPO_API_URL: undefined,
    MNESTIX_AAS_GENERATOR_API_URL: undefined,
    THEME_PRIMARY_COLOR: undefined,
    THEME_SECONDARY_COLOR: undefined,
    THEME_BASE64_LOGO: undefined,
    THEME_MENU_COLOR: undefined,
    LOG_LEVEL: 'info',
    THEME_LOGO_URL: undefined,
    IMPRINT_URL: undefined,
    DATA_PRIVACY_URL: undefined,
    BASYX_RBAC_ENABLED: false,
    WHITELIST_FEATURE_FLAG: false,
    AUTHENTICATION_FEATURE_FLAG: false,
    SUBMODEL_WHITELIST: '',
    THEME_LOGO_MIME_TYPE: undefined,
    KEYCLOAK_ISSUER: undefined,
    KEYCLOAK_LOCAL_URL: undefined,
    KEYCLOAK_REALM: undefined,
    KEYCLOAK_CLIENT_ID: undefined,
    SERIALIZATION_API_URL: undefined,
    EXPERIMENTAL_HIGHLIGHT_DATA_FLAG: false,
    EXTERNAL_LINKS: [],
};

const EnvContext = createContext(initialEnvValues);

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

/**
 * Hook for using environmental variables in client components.
 */
export const useEnv = () => {
    return useContext(EnvContext);
};
