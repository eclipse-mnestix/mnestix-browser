'use client';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { AssetAdministrationShell, Submodel } from 'lib/api/aas/models';
import { RegistryAasData } from 'lib/types/registryServiceTypes';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';

export type CurrentAasContextType = {
    aasState: [
        AssetAdministrationShell | undefined,
        React.Dispatch<React.SetStateAction<AssetAdministrationShell | undefined>>,
    ];
    submodelState: [SubmodelOrIdReference[], React.Dispatch<React.SetStateAction<SubmodelOrIdReference[]>>];
    registryAasData: [RegistryAasData | undefined, React.Dispatch<React.SetStateAction<RegistryAasData | undefined>>];
    aasOriginUrl: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
    isLoadingAas: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    isLoadingSubmodels: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    infrastructureName: [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>];
};

export type SubmodelOrIdReference = {
    id: string;
    submodel?: Submodel;
    repositoryUrl?: string;
    error?: string | Error;
};

const CurrentAasContext = createContext<CurrentAasContextType | undefined>(undefined);

export function useCurrentAasContext() {
    const context = useContext(CurrentAasContext);
    if (!context) {
        throw new Error('useCurrentAasContext must be used within a CurrentAasContextProvider');
    }
    return {
        aas: context.aasState[0],
        submodels: context.submodelState[0],
        registryAasData: context.registryAasData[0],
        aasOriginUrl: context.aasOriginUrl[0],
        isLoadingAas: context.isLoadingAas[0],
        isLoadingSubmodels: context.isLoadingSubmodels[0],
        infrastructureName: context.infrastructureName[0],
    };
}

export const CurrentAasContextProvider = (
    props: PropsWithChildren<{ aasId: string; repoUrl?: string; infrastructureName?: string }>,
) => {
    const aasState = useState<AssetAdministrationShell>();
    const registryAasData = useState<RegistryAasData>();
    const submodelState = useState<SubmodelOrIdReference[]>([]);
    const aasOriginUrl = useState<string>();
    const isLoadingAas = useState<boolean>(true);
    const isLoadingSubmodels = useState<boolean>(true);
    const infrastructureName = useState<string>(props.infrastructureName);

    const context = {
        aasState,
        registryAasData,
        submodelState,
        aasOriginUrl,
        isLoadingAas,
        isLoadingSubmodels,
        infrastructureName,
    };
    useAasLoader(context, props.aasId, props.repoUrl);

    return <CurrentAasContext.Provider value={context}> {props.children}</CurrentAasContext.Provider>;
};
