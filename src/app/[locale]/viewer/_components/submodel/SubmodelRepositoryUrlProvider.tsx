import React, { createContext, useContext } from 'react';

export const SubmodelRepositoryUrlContext = createContext<string | undefined>(undefined);

/**
 * Provides the submodel repository URL to all its children components (e.g. needed for loading attachments of a submodel).
 * @param repositoryUrl
 * @param children
 * @constructor
 */
export function SubmodelRepositoryUrlProvider({
    repositoryUrl,
    children,
}: {
    repositoryUrl: string;
    children: React.ReactNode;
}) {
    return (
        <SubmodelRepositoryUrlContext.Provider value={repositoryUrl}>{children}</SubmodelRepositoryUrlContext.Provider>
    );
}

export function useSubmodelRepositoryUrl() {
    const context = useContext(SubmodelRepositoryUrlContext);
    if (context === undefined) {
        throw new Error('useSubmodelRepositoryUrl not defined');
    }
    return context;
}
