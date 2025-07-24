import { Submodel } from 'lib/api/aas/models';

export type SubmodelVisualizationProps = {
    readonly submodel: Submodel;
    readonly repositoryUrl?: string;
};
