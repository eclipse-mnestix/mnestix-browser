import testAas from '../fixtures/testAAS.json';

const testAasId = testAas.aasId;
const base64AasId = () => btoa(testAasId).replace(new RegExp('=*$', 'g'), '');

describe('AAS viewer view switching', function () {
    before(() => {
        cy.postTestAas();
    });

    it('renders the default view content at /viewer/<id>/default', function () {
        cy.visit('/viewer/' + base64AasId() + '/default');
        cy.getByTestId('aas-data').findByTestId('data-row-value').should('contain', testAasId);
    });

    it('shows the not-found boundary for an unregistered view key', function () {
        cy.visit('/viewer/' + base64AasId() + '/does-not-exist', { failOnStatusCode: false });
        // The co-located not-found boundary renders inside the viewer layout,
        // not the raw Next.js 404 document.
        cy.contains(/view not found/i).should('be.visible');
    });

    after(function () {
        cy.deleteTestAas();
    });
});
