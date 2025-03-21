import resolutions from '../fixtures/resolutions.json';
import testAAS from '../fixtures/cypress_e2e/cypressTestAas.json';
import testInternalLinkedSub from '../fixtures/cypress_e2e/Submodels/cyTimeSeries_Internal_and_Linked.json';
import testInternalLinkedSubRef from '../fixtures/cypress_e2e/Submodels/cyTimeSeries_Internal_Linked_SubmodelReference.json';
import toBase64 from '../support/base64-conversion';

describe('Test the internal TimeSeries', function () {
    const encodedAasId = toBase64(testAAS.id);

    before(function () {
        cy.repoRequest('POST', '/shells', testAAS);
        cy.postSubmodelToAas(encodedAasId, testInternalLinkedSub, testInternalLinkedSubRef);
    });
    resolutions.forEach((res) => {
        describe('test on resolution: ' + res, function () {
            beforeEach(function () {
                cy.setResolution(res as [number, number] | Cypress.ViewportPreset);
                cy.visitViewer(testAAS.id);
            });

            it('Test for the internal timeseries submodel', function () {
                cy.getByTestId('submodel-tab').contains('TimeSeries').should('be.visible').click();
                const wrapper = () => cy.getByTestId('timeseries-internal-wrapper');
                wrapper().should('exist');
                const lineChart = wrapper().getByTestId('timeseries-line-chart');
                lineChart.should('exist');

                // six points
                lineChart.find('.recharts-dot').should('have.length', 6);
            });
        });
    });
    after(function () {
        cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
        const encodedTestInternalLinkedSub = toBase64(testInternalLinkedSub.id);
        cy.repoRequest('DELETE', '/submodels/' + encodedTestInternalLinkedSub, null);
    });
});

describe('Test the linked TimeSeries', function () {
    const encodedAasId = toBase64(testAAS.id);

    describe('test linked submodel', function () {
        it('Test for the linked timeseries submodel', function () {
            cy.repoRequest('POST', '/shells', testAAS);
            cy.postSubmodelToAas(encodedAasId, testInternalLinkedSub, testInternalLinkedSubRef);

            cy.intercept('POST', 'http://localhost:8086/api/v2/***', {}).as('influxIntercept');
            cy.visitViewer(testAAS.id);

            cy.getByTestId('submodel-tab').contains('TimeSeries').should('be.visible').click();
            cy.wait('@influxIntercept', { timeout: 20000 });
        });
    });

    after(function () {
        cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
        const encodedTestInternalLinkedSub = toBase64(testInternalLinkedSub.id);
        cy.repoRequest('DELETE', '/submodels/' + encodedTestInternalLinkedSub, null);
    });
});
