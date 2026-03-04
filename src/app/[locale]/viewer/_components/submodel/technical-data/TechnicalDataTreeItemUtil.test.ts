import { collectAllTreeItemIds } from './TechnicalDataTreeItemUtil';
import { ISubmodelElement } from '@aas-core-works/aas-core3.0-typescript/types';

describe('collectAllTreeItemIds', () => {
    it('should return an empty array for an empty element list', () => {
        expect(collectAllTreeItemIds([])).toEqual([]);
    });

    it('should return an empty array when no collections are present', () => {
        const elements = [
            { idShort: 'PropA', modelType: 'Property', valueType: 'xs:string', value: 'a' },
            { idShort: 'PropB', modelType: 'Property', valueType: 'xs:string', value: 'b' },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual([]);
    });

    it('should collect the idShort of a top-level SubmodelElementCollection', () => {
        const elements = [
            {
                idShort: 'GroupA',
                modelType: 'SubmodelElementCollection',
                value: [
                    { idShort: 'PropA', modelType: 'Property', valueType: 'xs:string', value: 'a' },
                ],
            },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual(['GroupA']);
    });

    it('should recursively collect idShorts from nested SubmodelElementCollections', () => {
        const elements = [
            {
                idShort: 'GroupA',
                modelType: 'SubmodelElementCollection',
                value: [
                    {
                        idShort: 'NestedGroup',
                        modelType: 'SubmodelElementCollection',
                        value: [
                            {
                                idShort: 'DeepNestedGroup',
                                modelType: 'SubmodelElementCollection',
                                value: [
                                    { idShort: 'DeepProp', modelType: 'Property', valueType: 'xs:string', value: 'v' },
                                ],
                            },
                        ],
                    },
                    { idShort: 'PropA', modelType: 'Property', valueType: 'xs:string', value: 'a' },
                ],
            },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual(['GroupA', 'NestedGroup', 'DeepNestedGroup']);
    });

    it('should collect idShorts from a SubmodelElementList', () => {
        const elements = [
            {
                idShort: 'MyList',
                modelType: 'SubmodelElementList',
                value: [
                    { idShort: 'Item0', modelType: 'Property', valueType: 'xs:string', value: 'v' },
                ],
            },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual(['MyList']);
    });

    it('should skip elements with no idShort', () => {
        const elements = [
            {
                modelType: 'SubmodelElementCollection',
                value: [],
            },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual([]);
    });

    it('should collect ids from multiple sibling collections', () => {
        const elements = [
            {
                idShort: 'GroupA',
                modelType: 'SubmodelElementCollection',
                value: [],
            },
            {
                idShort: 'GroupB',
                modelType: 'SubmodelElementCollection',
                value: [
                    {
                        idShort: 'NestedInB',
                        modelType: 'SubmodelElementCollection',
                        value: [],
                    },
                ],
            },
        ] as unknown as ISubmodelElement[];

        expect(collectAllTreeItemIds(elements)).toEqual(['GroupA', 'GroupB', 'NestedInB']);
    });
});

