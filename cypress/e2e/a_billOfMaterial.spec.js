// intentionally named a_ to run this test in first batch
import resolutions from '../fixtures/resolutions.json';
import testAAS from '../fixtures/testAAS.json';
import AASBomComponent from '../fixtures/cypress_e2e/cyTestAas_BoM_Component.json';

const testdata = {
    entityToTest: 0,
    bomSubmodelName: 'BillOfMaterial',
    redirectComponentName: 'Cy BoM Component',
    propertyTestCollection: 'Cypress Test 02',
    multiLanguageTest: 'MultiLanguageProperty',
    multiLangEn: 'Bill Of Material Multilanguage',
    booleanTest: 'Boolean',
    booleanTrueTest: true,
};

describe('Test the Bill-of-Material', function () {
    before(function () {
        cy.postTestAas();
        cy.repoRequest('POST', '/shells', AASBomComponent);
        cy.repoRequest('GET', '/shells/aHR0cHM6Ly9tbmVzdGl4LmlvL2Fhcy9jeXByZXNzVGVzdA');
    });
    resolutions.forEach((res) => {
        describe('test on resolution: ' + res, function () {
            beforeEach(function () {
                cy.setResolution(res);
                cy.visitViewer(testAAS.aasId);
                cy.getByTestId('submodel-tab').contains(testdata.bomSubmodelName).click();
            });

            it('Test the info box popup opening and closing', function () {
                //open and test contents of the popup
                cy.getByTestId('entity-info-icon').should('exist').as('bom-info-icons');
                cy.get('@bom-info-icons').eq(testdata.entityToTest).click();
                cy.getByTestId('bom-info-popup').should('exist').and('be.visible');
                cy.getByTestId('data-row-title').contains('asset').should('exist').as('assetIdDataRow');

                //close the popup
                cy.get('body').click(0, 0);
                cy.getByTestId('bom-info-popup').should('not.exist');
            });

            it('Test closing and opening the tree tabs', function () {
                //close the first item of the tree and assert the tree only has one item left
                cy.getByTestId('expand-entity-icon').should('exist').eq(0).as('FirstEntityOpen');
                cy.get('@FirstEntityOpen').click();
                cy.getByTestId('bom-entity').should('have.length', 1);
                cy.getByTestId('expand-entity-icon').should('exist').eq(0).as('FirstEntityClosed');

                //open the first item of the tree again and assert that there are more items now
                cy.get('@FirstEntityClosed').click();
                cy.getByTestId('bom-entity').should('have.length.gt', 1);
            });

            it('Checks if Button to redirect to the Bom Component exists', function () {
                cy.getByTestId('bom-entity')
                    .contains(testdata.redirectComponentName)
                    .parents('[data-testid="bom-entity"]')
                    .as('cyBomComponent');
                cy.get('@cyBomComponent').findByTestId('view-asset-button').as('cyBomComponent_Button');
                cy.get('@cyBomComponent_Button').should('exist');
            });

            it('Finds a MultiLang String under "Cypress Test 02"', function () {
                //this needs to be adjusted once you can choose your language
                cy.getByTestId('bom-entity')
                    .contains(testdata.propertyTestCollection)
                    .parents('[data-testid="bom-entity"]')
                    .as('cyPropertyTestCollection');
                cy.get('@cyPropertyTestCollection').findByTestId('expand-entity-icon').click();
                cy.getByTestId('bom-entity')
                    .contains(testdata.multiLanguageTest)
                    .parents('[data-testid="bom-entity"]')
                    .as('cyMultiLangTest');
                cy.get('@cyMultiLangTest').should('contain', testdata.multiLangEn);
            });

            it('Finds a Boolean under Cypress Test 02"', function () {
                cy.getByTestId('bom-entity')
                    .contains(testdata.propertyTestCollection)
                    .parents('[data-testid="bom-entity"]')
                    .as('cyPropertyTestCollection');
                cy.get('@cyPropertyTestCollection').findByTestId('expand-entity-icon').click();
                cy.getByTestId('bom-entity')
                    .contains(testdata.booleanTest)
                    .parents('[data-testid="bom-entity"]')
                    .as('cyBooleanTest');
                cy.get('@cyBooleanTest').should('contain', testdata.booleanTrueTest);
            });
        });
    });
    after(function () {
        cy.deleteTestAas();
        cy.deleteTestAasBomComponent();
    });
});
