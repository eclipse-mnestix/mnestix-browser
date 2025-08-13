import { Submodel } from 'lib/api/aas/models';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';
import { GenericSubmodelDetailComponent } from './generic-submodel/GenericSubmodelDetailComponent';
import { Box } from '@mui/material';
import { findSemanticIdInMap } from 'lib/util/SubmodelResolverUtil';
import React, { createContext, useContext } from 'react';

type SubmodelDetailProps = {
    submodel: Submodel;
    repositoryUrl: string;
};

export function SubmodelDetail(props: SubmodelDetailProps) {
    const submodelElements = props.submodel?.submodelElements;
    if (!props.submodel || !submodelElements) return <></>;

    const key = findSemanticIdInMap(props.submodel.semanticId, submodelCustomVisualizationMap);

    const CustomSubmodelComponent = key ? submodelCustomVisualizationMap[key] : undefined;

    return (
        <RepositoryUrlProvider repositoryUrl={props.repositoryUrl}>
            <Box width="100%" key={props.submodel?.id}>
                {CustomSubmodelComponent ? (
                    <CustomSubmodelComponent submodel={props.submodel} />
                ) : (
                    <GenericSubmodelDetailComponent submodel={props.submodel} />
                )}
            </Box>
        </RepositoryUrlProvider>
    );
}

export const RepositoryUrlContext = createContext<string | undefined>(undefined);

export function RepositoryUrlProvider({
    repositoryUrl,
    children,
}: {
    repositoryUrl: string;
    children: React.ReactNode;
}) {
    return <RepositoryUrlContext.Provider value={repositoryUrl}>{children}</RepositoryUrlContext.Provider>;
}

export function useRepositoryUrl() {
    const context = useContext(RepositoryUrlContext);
    if (context === undefined) {
        throw new Error('useRepositoryUrl muss innerhalb eines RepositoryUrlProvider verwendet werden');
    }
    return context;
}
