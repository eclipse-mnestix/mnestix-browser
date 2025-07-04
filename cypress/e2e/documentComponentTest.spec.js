import resolutions from '../fixtures/resolutions.json';

describe('Test DocumentComponent', function () {
    const defaultResolution = resolutions[0];

    describe('test on default resolution: ' + defaultResolution, function () {
        beforeEach(function () {
            cy.setResolution(defaultResolution);
            cy.visitViewer('https://vws.xitaso.com/aas/mnestix');
            cy.getByTestId('submodel-tab').contains('HandoverDocumentation').click();
        });

        it('should display document with correct title and organization', function () {
            cy.getByTestId('document-title').should('contain', 'Mnestix');
            cy.getByTestId('document-organization').should('contain', 'XITASO');
        });

        it('should display preview image if available', function () {
            cy.getByTestId('document-preview-image')
                .should('exist')
                .should('be.visible')
                .should('have.attr', 'src')
                .and(
                    'contain',
                    'repo/submodels/aHR0cHM6Ly9leGFtcGxlLmNvbS9pZHMvc20vNzc5MV8xMzA3XzMxMzFfNTg3Mw/submodel-elements/Document.DocumentVersion.PreviewFile/attachment',
                );
        });

        it('should have working open button', function () {
            cy.getByTestId('document-open-button').should('exist').should('not.be.disabled');
        });

        it('should open details dialog when info button is clicked', function () {
            cy.getByTestId('document-info-button').click();
            cy.getByTestId('document-details-dialog').should('exist').should('be.visible');
            // Check if the dialog closes when the close button is clicked
            cy.get('[aria-label="close"]').click();
            cy.getByTestId('document-details-dialog').should('not.exist');
        });
    });
});
