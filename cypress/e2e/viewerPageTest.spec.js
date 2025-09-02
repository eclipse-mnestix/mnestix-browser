import testAAS from '../fixtures/testAAS.json';
import resolutions from '../fixtures/resolutions.json';
import toBase64 from '../support/base64-conversion';
const testMobileResolution = 'iphone-6';

const testData = {
    submodelTabToClick: 'cyDropdown',
    dropdownContent: 'Test',
    testUrl: 'https://mnestix.io',
    testNoUrl: 'Test',
    propertyNoUrl: 'Property_no_link',
    propertyUrl: 'Property_link',
    mlpropertyNoUrl: 'MultiLanguageProperty_no_link',
    mlpropertyUrl: 'MultiLanguageProperty_link',
};

describe('Test the viewer page', function () {
    before(function () {
        cy.postTestAas();
    });

    describe('Check the submodel tabs', function () {
        beforeEach(function () {
            cy.visitViewer(testAAS.aasId);
        });
        resolutions.forEach((res) => {
            it('test on resolution: ' + res, function () {
                cy.setResolution(res);
                cy.getByTestId('submodel-tab').contains(testData.submodelTabToClick, { matchCase: false }).click();
                cy.getByTestId('data-row-title').contains('Cypress').should('exist').and('be.visible');
            });
        });
    });

    describe('Test the dropdown boxes', function () {
        describe('See if the dropdown box shows hidden content when clicked on', function () {
            beforeEach(function () {
                cy.visitViewer(testAAS.aasId);
            });

            resolutions.forEach((res) => {
                it('test on resolution: ' + res, function () {
                    cy.setResolution(res);

                    cy.getByTestId('submodel-tab').contains(testData.submodelTabToClick).click();
                    cy.getByTestId('submodelOverviewLoadingSkeleton', { timeout: 50000 }).should('not.exist');
                    cy.getByTestId('submodel-dropdown-button').contains('show', { matchCase: false }).as('dropdown');
                    cy.getByTestId('data-row-title')
                        .contains(testData.dropdownContent, { matchCase: false })
                        .should('not.exist');

                    cy.get('@dropdown').click();
                    cy.getByTestId('submodel-dropdown-button').contains('hide', { matchCase: false }).as('dropdown');
                    cy.getByTestId('data-row-title')
                        .contains(testData.dropdownContent, { matchCase: false })
                        .should('exist')
                        .and('be.visible');
                });
            });
        });
    });

    describe('Test if links are formatted correctly', function () {
        beforeEach(function () {
            cy.visitViewer(testAAS.aasId);
        });

        resolutions.forEach((res) => {
            it('test on resolution: ' + res, function () {
                cy.getByTestId('submodel-tab').contains(testData.submodelTabToClick).click();
                cy.getByTestId('submodel-dropdown-button').contains('show', { matchCase: false }).as('dropdown');
                cy.get('@dropdown').click();

                cy.getByTestId('data-row-title')
                    .contains(testData.propertyNoUrl, { matchCase: false })
                    .getByTestId('property-content')
                    .contains(testData.testNoUrl)
                    .should('not.have.attr', 'href');

                cy.getByTestId('data-row-title')
                    .contains(testData.propertyUrl, { matchCase: false })
                    .getByTestId('property-content')
                    .contains(testData.testUrl)
                    .should('have.attr', 'href');

                cy.getByTestId('data-row-title')
                    .contains(testData.mlpropertyUrl, { matchCase: false })
                    .getByTestId('mlproperty-content')
                    .contains(testData.testUrl)
                    .get('a')
                    .should('have.attr', 'href');

                cy.getByTestId('data-row-title')
                    .contains(testData.mlpropertyNoUrl, { matchCase: false })
                    .getByTestId('mlproperty-content')
                    .contains(testData.testNoUrl)
                    .should('not.have.attr', 'href');
            });
        });
    });

    describe('Mobile-only tests', function () {
        before(function () {
            cy.viewport(testMobileResolution);
            cy.visit('/viewer/' + toBase64(testAAS.aasId));
        });

        it('tests whether the dropdown menus at the top of the page work for mobile users', function () {
            cy.getByTestId('mobile-accordion-header')
                .contains('Asset Administration Shell', { matchCase: false })
                .as('mobileDropdown');
            cy.getByTestId('mobile-accordion-content').as('mobileDropdownContent');
            cy.get('@mobileDropdownContent').should('not.be.visible');

            cy.get('@mobileDropdown').click();
            cy.get('@mobileDropdownContent').should('be.visible');
        });

        xit('should not show the compare button for mobile users', function () {
            cy.getByTestId('detail-compare-button').should('not.exist');
        });
    });

    after(function () {
        cy.deleteTestAas();
    });
});
