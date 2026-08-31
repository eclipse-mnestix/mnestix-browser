import type { SubmodelVisualizationMap } from 'components/visualizations/submodel.types';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';

/**
 * Returns the submodel visualization registry used by {@link SubmodelDetail}.
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this whole
 * file and spreads the OSS map so upstream entries keep flowing in, e.g.
 *
 *     return { ...submodelCustomVisualizationMap, [mySemanticId]: MyDetail };
 *
 * Entries added after the spread win over OSS entries with the same semanticId. The
 * shared types come from the read-only `components/visualizations/submodel.types`
 * module — do not redeclare them here.
 *
 * OSS contributors register stock visualizations in `SubmodelCustomVisualizationMap.ts`
 * instead; this file stays a thin indirection on purpose.
 */
export function getSubmodelVisualizationMap(): SubmodelVisualizationMap {
    return submodelCustomVisualizationMap;
}
