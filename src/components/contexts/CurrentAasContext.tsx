'use client';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { AssetAdministrationShell, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { RegistryAasData } from 'lib/types/registryServiceTypes';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';

export type CurrentAasContextType = {
    aasState: [AssetAdministrationShell | null, React.Dispatch<React.SetStateAction<AssetAdministrationShell | null>>];
    submodelState: [SubmodelOrIdReference[], React.Dispatch<React.SetStateAction<SubmodelOrIdReference[]>>];
    registryAasData: [RegistryAasData | null, React.Dispatch<React.SetStateAction<RegistryAasData | null>>];
    aasOriginSource: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
    isLoadingAas: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    isLoadingSubmodels: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

export type SubmodelOrIdReference = {
    id: string;
    submodel?: Submodel;
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
        aasOriginSource: context.aasOriginSource[0],
        isLoadingAas: context.isLoadingAas[0],
        isLoadingSubmodels: context.isLoadingSubmodels[0],
    };
}

export const useAasState = () => {
    const context = useContext(CurrentAasContext);
    if (!context) {
        throw new Error('useAasState must be used within a CurrentAasContextProvider');
    }
    return context.aasState;
};

// only used together with setAas.
// to clear the context
export const useAasOriginSourceState = () => {
    const context = useContext(CurrentAasContext);
    if (!context) {
        throw new Error('useAasRepoSourceState must be used within a CurrentAasContextProvider');
    }
    return context.aasOriginSource;
};

// only used together with setAas and setAasOriginSourceState
export const useRegistryAasState = () => {
    const context = useContext(CurrentAasContext);
    if (!context) {
        throw new Error('useRegistryAasState must be used within a CurrentAasContextProvider');
    }
    return context.registryAasData;
};

// has to be only the submodels of an AAS
export const useSubmodelState = () => {
    const context = useContext(CurrentAasContext);
    if (!context) {
        throw new Error('useSubmodelState must be used within a CurrentAasContextProvider');
    }
    return context.submodelState;
};

export const CurrentAasContextProvider = (props: PropsWithChildren<{ aasId: string; repoUrl?: string }>) => {
    const aasState = useState<AssetAdministrationShell | null>(null);
    const registryAasData = useState<RegistryAasData | null>(null);
    const submodelState = useState<SubmodelOrIdReference[]>([]);
    const aasOriginSource = useState<string | null>(null);
    const isLoadingAas = useState<boolean>(true);
    const isLoadingSubmodels = useState<boolean>(true);

    const context = {
        aasState,
        registryAasData,
        submodelState,
        aasOriginSource,
        isLoadingAas,
        isLoadingSubmodels,
    };
    useAasLoader(context, props.aasId, props.repoUrl);

    return <CurrentAasContext.Provider value={context}> {props.children}</CurrentAasContext.Provider>;
};
