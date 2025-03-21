import testAAS from '../fixtures/testAAS.json';
import resolutions from '../fixtures/resolutions';

describe('Visit the Viewer page', function () {
    before(function () {
        cy.postTestAas();
    });

    beforeEach(function () {
        cy.visit('/');
        cy.getByTestId('aasId-input').as('IDInput');
    });
    resolutions.forEach((el) => {
        it(
            'should put an AAS Id into the input field, click the arrow and be redirected to the right viewer page (Resolution: ' +
                el +
                ')',
            function () {
                cy.setResolution(el);
                cy.get('@IDInput').click();
                cy.get('@IDInput').type(testAAS.aasId);
                cy.getByTestId('aasId-submit-button').click();
                cy.url().should('contain', '/viewer/' + btoa(testAAS.aasId).replace(new RegExp('=*$', 'g'), ''));
            },
        );
        it(
            'should put an Asset Id into the input field, click the arrow and be redirected to the right viewer page (Resolution: ' +
                el +
                ')',
            function () {
                cy.setResolution(el);
                cy.get('@IDInput').click();
                cy.get('@IDInput').type(testAAS.assetId);
                cy.getByTestId('aasId-submit-button').click();
                cy.url().should('contain', '/viewer/' + btoa(testAAS.aasId).replace(new RegExp('=*$', 'g'), ''));
            },
        );
    });

    after(function () {
        cy.deleteTestAas();
    });
});
