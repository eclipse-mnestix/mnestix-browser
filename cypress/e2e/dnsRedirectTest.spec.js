import testAas from '../fixtures/testAAS.json';

const testAasId = testAas.aasId;
const testAssetId = testAas.assetId;

describe('Test the DNS Redirect', function () {
    before(() => {
        cy.postTestAas();
    });
    it('Visits the "/asset/URLEncodedAssetID" page and gets redirected to the corresponding viewer page', function () {
        cy.intercept({ method: 'POST', url: '/en/viewer/*' }).as('redirectedViewer');
        let encodedUrl = encodeURIComponent(testAssetId);

        cy.visit('/asset?assetId=' + encodedUrl);
        cy.wait('@redirectedViewer'); //wait for lookup/shells to be called

        cy.url().should('contain', '/viewer/' + btoa(testAasId).replace(new RegExp('=*$', 'g'), ''));
        cy.getByTestId('aas-data').findByTestId('data-row-value').should('contain', testAasId);
        cy.getByTestId('asset-data').findByTestId('data-row-value').should('contain', testAssetId);
        cy.wait(100);
    });
    after(function () {
        cy.deleteTestAas();
    });
});
