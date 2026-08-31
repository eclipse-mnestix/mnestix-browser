import type { SubmodelElementVisualizationMap } from 'components/visualizations/submodel.types';
import { submodelElementCustomVisualizationMap } from './SubmodelElementCustomVisualizationMap';

/**
 * Returns the submodel-element visualization registry used by
 * {@link GenericSubmodelDetailComponent}.
 *
 * This is the OVERRIDE surface for customizations: a customization replaces this whole
 * file and spreads the OSS map so upstream entries keep flowing in, e.g.
 *
 *     return { ...submodelElementCustomVisualizationMap, [mySemanticId]: MyElement };
 *
 * Entries added after the spread win over OSS entries with the same semanticId. The
 * shared types come from the read-only `components/visualizations/submodel.types`
 * module — do not redeclare them here.
 *
 * OSS contributors register stock element visualizations in
 * `SubmodelElementCustomVisualizationMap.ts` instead; this file stays a thin
 * indirection on purpose.
 */
export function getSubmodelElementVisualizationMap(): SubmodelElementVisualizationMap {
    return submodelElementCustomVisualizationMap;
}
