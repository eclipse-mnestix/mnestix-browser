import {
    generateSubmodelViewObjectFromSubmodelElement,
    viewObjectHasDataValue,
    splitIdIntoArray,
    rewriteNodeIds,
    updateNodeIds,
} from './SubmodelViewObjectUtil';
import {
    KeyTypes,
    Property,
    SubmodelElementList,
    SubmodelElementCollection,
    Entity,
    File,
    MultiLanguageProperty,
} from 'lib/api/aas/models';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { describe, it, expect } from '@jest/globals';

describe('SubmodelViewObjectUtil', () => {
    describe('generateSubmodelViewObjectFromSubmodelElement', () => {
        it('should generate view object for Property with displayName in German', () => {
            const property: Property = {
                modelType: KeyTypes.Property,
                idShort: 'testProperty',
                valueType: 'xs:string',
                value: 'test value',
                displayName: [
                    { language: 'de', text: 'Test Eigenschaft' },
                    { language: 'en', text: 'Test Property' },
                ],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(property, '0', 'de');

            expect(result.id).toBe('0');
            expect(result.name).toBe('Test Eigenschaft');
            expect(result.children).toEqual([]);
            expect(result.hasValue).toBe(true);
            expect(result.propertyValue).toBe('test value');
            expect(result.data).toEqual(property);
        });

        it('should fallback to English displayName when German is not available', () => {
            const property: Property = {
                modelType: KeyTypes.Property,
                idShort: 'testProperty',
                valueType: 'xs:string',
                value: 'test value',
                displayName: [{ language: 'en', text: 'Test Property' }],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(property, '0', 'de');

            expect(result.name).toBe('Test Property');
        });

        it('should fallback to idShort when displayName is not available', () => {
            const property: Property = {
                modelType: KeyTypes.Property,
                idShort: 'testProperty',
                valueType: 'xs:string',
                value: 'test value',
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(property, '0', 'de');

            expect(result.name).toBe('testProperty');
        });

        it('should fallback to modelType when both displayName and idShort are not available', () => {
            const property: Property = {
                modelType: KeyTypes.Property,
                valueType: 'xs:string',
                value: 'test value',
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(property, '0', 'de');

            expect(result.name).toBe('Property');
        });

        it('should generate view object for SubmodelElementList with children', () => {
            const childProperty: Property = {
                modelType: KeyTypes.Property,
                idShort: 'childProperty',
                valueType: 'xs:string',
                value: 'child value',
                displayName: [{ language: 'de', text: 'Kind Eigenschaft' }],
            };

            const submodelElementList: SubmodelElementList = {
                modelType: KeyTypes.SubmodelElementList,
                idShort: 'testList',
                displayName: [{ language: 'de', text: 'Test Liste' }],
                orderRelevant: true,
                typeValueListElement: 'Property',
                value: [childProperty],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(submodelElementList, '0', 'de');

            expect(result.id).toBe('0');
            expect(result.name).toBe('Test Liste');
            expect(result.children).toHaveLength(1);
            expect(result.children[0].id).toBe('0-0');
            expect(result.children[0].name).toBe('Kind Eigenschaft');
            expect(result.hasValue).toBe(false);
            expect((result.data as SubmodelElementList).value).toEqual([]);
        });

        it('should generate view object for SubmodelElementCollection with children', () => {
            const childProperty: Property = {
                modelType: KeyTypes.Property,
                idShort: 'childProperty',
                valueType: 'xs:string',
                value: 'child value',
                displayName: [{ language: 'de', text: 'Kind Eigenschaft' }],
            };

            const submodelElementCollection: SubmodelElementCollection = {
                modelType: KeyTypes.SubmodelElementCollection,
                idShort: 'testCollection',
                displayName: [{ language: 'de', text: 'Test Sammlung' }],
                value: [childProperty],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(submodelElementCollection, '0', 'de');

            expect(result.id).toBe('0');
            expect(result.name).toBe('Test Sammlung');
            expect(result.children).toHaveLength(1);
            expect(result.children[0].id).toBe('0-0');
            expect(result.children[0].name).toBe('Kind Eigenschaft');
            expect(result.hasValue).toBe(false);
            expect((result.data as SubmodelElementCollection).value).toEqual([]);
        });

        it('should generate view object for Entity with statements', () => {
            const statement: Property = {
                modelType: KeyTypes.Property,
                idShort: 'statement',
                valueType: 'xs:string',
                value: 'statement value',
                displayName: [{ language: 'de', text: 'Aussage' }],
            };

            const entity: Entity = {
                modelType: KeyTypes.Entity,
                idShort: 'testEntity',
                displayName: [{ language: 'de', text: 'Test Entität' }],
                entityType: 'SelfManagedEntity',
                statements: [statement],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(entity, '0', 'de');

            expect(result.id).toBe('0');
            expect(result.name).toBe('Test Entität');
            expect(result.children).toHaveLength(1);
            expect(result.children[0].id).toBe('0-0');
            expect(result.children[0].name).toBe('Aussage');
            expect(result.hasValue).toBe(false);
            expect((result.data as Entity).statements).toEqual([]);
        });

        it('should handle empty SubmodelElementList value', () => {
            const submodelElementList: SubmodelElementList = {
                modelType: KeyTypes.SubmodelElementList,
                idShort: 'emptyList',
                displayName: [{ language: 'de', text: 'Leere Liste' }],
                orderRelevant: true,
                typeValueListElement: 'Property',
                value: [],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(submodelElementList, '0', 'de');

            expect(result.children).toHaveLength(0);
            expect(result.name).toBe('Leere Liste');
        });

        it('should handle null/undefined children in collections', () => {
            const submodelElementList: SubmodelElementList = {
                modelType: KeyTypes.SubmodelElementList,
                idShort: 'listWithNulls',
                displayName: [{ language: 'de', text: 'Liste mit Nullen' }],
                orderRelevant: true,
                typeValueListElement: 'Property',
                value: [null, undefined] as (Property | null | undefined)[],
            };

            const result = generateSubmodelViewObjectFromSubmodelElement(submodelElementList, '0', 'de');

            expect(result.children).toHaveLength(0);
        });
    });

    describe('viewObjectHasDataValue', () => {
        it('should return true for Property with value', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.Property,
                    value: 'test value',
                } as Property,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(true);
        });

        it('should return false for Property without value', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.Property,
                } as Property,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(false);
        });

        it('should return true for File with value', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.File,
                    value: '/path/to/file',
                } as File,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(true);
        });

        it('should return true for MultiLanguageProperty with array value', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.MultiLanguageProperty,
                    value: [{ language: 'de', text: 'test' }],
                } as MultiLanguageProperty,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(true);
        });

        it('should return false for MultiLanguageProperty with empty array', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.MultiLanguageProperty,
                    value: [],
                } as MultiLanguageProperty,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(false);
        });

        it('should return false for unsupported model types', () => {
            const viewObject: SubmodelViewObject = {
                id: '0',
                name: 'test',
                children: [],
                data: {
                    modelType: KeyTypes.SubmodelElementCollection,
                } as SubmodelElementCollection,
            };

            expect(viewObjectHasDataValue(viewObject)).toBe(false);
        });
    });

    describe('splitIdIntoArray', () => {
        it('should split single id into array', () => {
            expect(splitIdIntoArray('0')).toEqual([0]);
        });

        it('should split nested id into array', () => {
            expect(splitIdIntoArray('0-1-2')).toEqual([0, 1, 2]);
        });

        it('should handle empty string', () => {
            expect(splitIdIntoArray('')).toEqual([NaN]);
        });
    });

    describe('rewriteNodeIds', () => {
        it('should rewrite ids recursively', async () => {
            const element: SubmodelViewObject = {
                id: '0',
                name: 'Parent',
                children: [
                    {
                        id: '0-0',
                        name: 'Child1',
                        children: [],
                    },
                    {
                        id: '0-1',
                        name: 'Child2',
                        children: [
                            {
                                id: '0-1-0',
                                name: 'Grandchild',
                                children: [],
                            },
                        ],
                    },
                ],
            };

            await rewriteNodeIds(element, 'new');

            expect(element.id).toBe('new');
            expect(element.children[0].id).toBe('new-0');
            expect(element.children[1].id).toBe('new-1');
            expect(element.children[1].children[0].id).toBe('new-1-0');
        });
    });

    describe('updateNodeIds', () => {
        it('should update node ids by replacing original with new parent id', () => {
            const parent: SubmodelViewObject = {
                id: 'old-0',
                name: 'Parent',
                children: [
                    {
                        id: 'old-0-0',
                        name: 'Child',
                        children: [
                            {
                                id: 'old-0-0-0',
                                name: 'Grandchild',
                                children: [],
                            },
                        ],
                    },
                ],
            };

            updateNodeIds('old', 'new', parent);

            expect(parent.id).toBe('new-0');
            expect(parent.children[0].id).toBe('new-0-0');
            expect(parent.children[0].children[0].id).toBe('new-0-0-0');
        });
    });
});
