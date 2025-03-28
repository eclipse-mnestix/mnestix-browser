import testAAS from '../fixtures/testAAS.json';
import resolutions from '../fixtures/resolutions.json';
import toBase64 from '../support/base64-conversion';

describe('Test the copy button functionality', function () {
    before(function () {
        cy.postTestAas();
    });

    describe('Test copying values in AASOverviewCard', function () {
        beforeEach(function () {
            cy.visitViewer(testAAS.aasId);
            // Wait for AAS viewer to fully load
            cy.getByTestId('aas-data', { timeout: 10000 }).should('be.visible');
            cy.getByTestId('submodelOverviewLoadingSkeleton', { timeout: 10000 }).should('not.exist');
        });

        resolutions.filter((resolution) => resolution !== "iphone-6").forEach((res) => {
            it('should show and use regular copy button with hover in AASOverviewCard (Resolution: ' + res + ')', function () {

                cy.setResolution(res);
                // Check that copy buttons are initially hidden
                cy.getByTestId('datarow-aas-id').should('not.be.visible');
                
                // Hover over the AAS ID field and check if copy button appears
                cy.getByTestId('data-row-value').contains(testAAS.aasId).parent().trigger('mouseover');
                cy.getByTestId('datarow-aas-id').should('be.visible');
                cy.window().then((win) => {
                    if (!win.navigator.clipboard) {
                        win.navigator.clipboard = {
                          writeText: () => {}
                        };
                      }
                    cy.stub(win.navigator.clipboard, "writeText").resolves().as('clipboardWrite');
                  });
                // Click copy button and verify clipboard content
                cy.getByTestId('datarow-aas-id').first().click();
                cy.get('@clipboardWrite').should(
                    'have.been.calledOnceWith',
                    testAAS.aasId,
                )

                // Check notification
                cy.contains('Copied to clipboard').should('be.visible');

                // Mouse out should hide the button
                cy.getByTestId('data-row-value').contains(testAAS.aasId).parent().trigger('mouseleave');
                cy.getByTestId('copy-datarow-value').should('not.be.visible');
            });

        

            it('should show and use base64 copy buttons in DataRow for IDs (Resolution: ' + res + ')', function () {
                cy.setResolution(res);
                // Check that copy buttons are initially hidden
                cy.getByTestId('datarow-aas-id-b64').should('not.be.visible');
                
                // Hover over the AAS ID field and check if copy button appears
                cy.getByTestId('data-row-value').contains(testAAS.aasId).parent().trigger('mouseover');
                cy.getByTestId('datarow-aas-id-b64').should('be.visible');

                // Click copy button and verify clipboard content
                cy.window().then((win) => {
                    if (!win.navigator.clipboard) {
                        win.navigator.clipboard = {
                          writeText: () => {}
                        };
                      }
                    cy.stub(win.navigator.clipboard, "writeText").resolves().as('clipboardWrite');
                  });
                // Click copy button and verify clipboard content
                cy.getByTestId('datarow-aas-id-b64').first().click();
                cy.get('@clipboardWrite').should(
                    'have.been.calledOnceWith',
                    toBase64(testAAS.aasId),
                )
                // Check notification
                cy.contains('Copied to clipboard').should('be.visible');

                // Mouse out should hide the button
                cy.getByTestId('data-row-value').contains(testAAS.aasId).parent().trigger('mouseleave');
                cy.getByTestId('copy-datarow-value').should('not.be.visible');
            });

        });
    });

    after(function () {
        cy.deleteTestAas();
    });
});