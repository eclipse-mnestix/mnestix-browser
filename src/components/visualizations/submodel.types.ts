import type { ComponentType } from 'react';
import type { Submodel, SubmodelElementCollection, SubmodelElementList } from 'lib/api/aas/models';

/**
 * Public contract for submodel and submodel-element visualizations. Part of the
 * `src/components/**` public API surface: customizations IMPORT these types but never
 * override this file. The overridable registry factories live in
 * `src/app/[locale]/viewer/_components/submodel/submodel.config.ts` and
 * `src/app/[locale]/viewer/_components/submodel-elements/submodel-element.config.ts`.
 */

/** Props every custom submodel visualization receives. */
export type SubmodelVisualizationProps = {
    readonly submodel: Submodel;
    readonly repositoryUrl?: string;
};

/** Props every custom submodel-element visualization receives. */
export interface CustomSubmodelElementComponentProps {
    readonly submodelElement: SubmodelElementCollection | SubmodelElementList;
    readonly hasDivider: boolean;
    readonly submodelId: string;
    readonly repositoryUrl?: string;
}

/**
 * Registry of submodel visualizations, keyed by the submodel's semanticId. A submodel
 * whose semanticId is absent falls back to the generic visualization.
 */
export type SubmodelVisualizationMap = Record<string, ComponentType<SubmodelVisualizationProps>>;

/**
 * Registry of submodel-element visualizations, keyed by the element's semanticId.
 * An element whose semanticId is absent falls back to the generic element component.
 */
export type SubmodelElementVisualizationMap = Record<string, ComponentType<CustomSubmodelElementComponentProps>>;
