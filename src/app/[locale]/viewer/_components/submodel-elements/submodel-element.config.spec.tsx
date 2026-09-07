import { describe, expect, it } from '@jest/globals';
import { getSubmodelElementVisualizationMap } from './submodel-element.config';
import { submodelElementCustomVisualizationMap } from './SubmodelElementCustomVisualizationMap';

describe('getSubmodelElementVisualizationMap', () => {
    // Subset, not equality: a customization overriding this file spreads the OSS map and adds
    // its own entries, and this spec must keep passing in such a build.
    it('exposes every OSS-registered element visualization', () => {
        const map = getSubmodelElementVisualizationMap();

        expect(Object.keys(map)).toEqual(expect.arrayContaining(Object.keys(submodelElementCustomVisualizationMap)));
    });

    it('maps every semanticId to a renderable component', () => {
        for (const component of Object.values(getSubmodelElementVisualizationMap())) {
            expect(typeof component).toBe('function');
        }
    });
});
