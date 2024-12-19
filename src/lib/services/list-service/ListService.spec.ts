import { expect } from '@jest/globals';
import { AasListDto, ListService } from 'lib/services/list-service/ListService';
import testData from 'lib/services/list-service/ListService.data.json';
import { AssetAdministrationShell, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import ServiceReachable from 'test-utils/TestUtils';

const assetAdministrationShells = testData.assetAdministrationShells as unknown as AssetAdministrationShell[];
const expectedData = testData.expectedResult as AasListDto;

describe('ListService: Return List Entities', function () {
    it('returns proper object when aas list is returned from aas repository', async () => {
        // ARRANGE
        const listService = ListService.createNull(assetAdministrationShells);

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult).toEqual(expectedData);
    });

    it('returns empty object when no aas is returned from aas repository', async () => {
        // ARRANGE
        const listService = ListService.createNull();

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult).toEqual({
            success: true,
            entities: [],
            cursor: '',
        });
    });

    it('return success false when aas repository is not reachable and returns error', async () => {
        // ARRANGE
        const listService = ListService.createNull([], [], ServiceReachable.No);

        //ACT
        const listServiceResult = await listService.getAasListEntities(5);

        //ASSERT
        expect(listServiceResult.success).toEqual(false);
        expect(listServiceResult).toHaveProperty('error');
    });

    const submodel = {
        modelType: 'Submodel',
        kind: 'Instance',
        displayName: 'Nameplate',
        semanticId: {
            keys: [
                {
                    type: 'Submodel',
                    value: 'https://admin-shell.io/zvei/nameplate/1/0/Nameplate',
                },
            ],
            type: 'ExternalReference',
        },
        administration: {
            revision: '0',
            version: '1',
        },
        id: 'https://i40.xitaso.com/testNameplate_01',
        idShort: 'Nameplate',
        submodelElements: [
            {
                modelType: 'MultiLanguageProperty',
                semanticId: {
                    keys: [
                        {
                            type: 'ConceptDescription',
                            value: '0173-1#02-AAO677#002',
                        },
                    ],
                    type: 'ExternalReference',
                },
                value: [
                    {
                        language: 'de',
                        text: 'Gottfried Wilhelm Leibniz Universität Hannover',
                    },
                    {
                        language: 'en',
                        text: 'Gottfried Wilhelm Leibniz Universität Hannover',
                    },
                ],
                category: 'PARAMETER',
                idShort: 'ManufacturerName',
            },
            {
                modelType: 'MultiLanguageProperty',
                semanticId: {
                    keys: [
                        {
                            type: 'ConceptDescription',
                            value: '0173-1#02-AAW338#001',
                        },
                    ],
                    type: 'ExternalReference',
                },
                value: [
                    {
                        language: 'de',
                        text: 'Individueller Kugelschreiber',
                    },
                    {
                        language: 'en',
                        text: 'Individual ballpen',
                    },
                ],
                category: 'PARAMETER',
                idShort: 'ManufacturerProductDesignation',
            },
        ],
        extensions: '',
        category: '',
        description: '',
        supplementalSemanticIds: '',
    };

    const expectedResult = {
        success: true,
        manufacturerName: {
            de: 'Gottfried Wilhelm Leibniz Universität Hannover',
            en: 'Gottfried Wilhelm Leibniz Universität Hannover',
        },
        manufacturerProductDesignation: {
            de: 'Individueller Kugelschreiber',
            en: 'Individual ballpen',
        },
    };

    it('returns nameplate data when existing in the repository', async () => {
        const listService = ListService.createNull(
            assetAdministrationShells,
            [submodel as unknown as Submodel],
            ServiceReachable.Yes,
        );

        const nameplateResult = await listService.getNameplateValuesForAAS('https://i40.xitaso.com/aas/testListAas_00');

        expect(nameplateResult).toEqual(expectedResult);
    });
});
