import { describe, expect, it } from '@jest/globals';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { getSubmodelVisualizationMap } from './submodel.config';
import { submodelCustomVisualizationMap } from './SubmodelCustomVisualizationMap';

describe('getSubmodelVisualizationMap', () => {
    // Subset, not equality: a customization overriding this file spreads the OSS map and adds
    // its own entries, and this spec must keep passing in such a build.
    it('exposes every OSS-registered visualization', () => {
        const map = getSubmodelVisualizationMap();

        expect(Object.keys(map)).toEqual(expect.arrayContaining(Object.keys(submodelCustomVisualizationMap)));
        expect(map[SubmodelSemanticIdEnum.CarbonFootprint]).toBeDefined();
    });

    it('maps every semanticId to a renderable component', () => {
        for (const component of Object.values(getSubmodelVisualizationMap())) {
            expect(typeof component).toBe('function');
        }
    });
});
