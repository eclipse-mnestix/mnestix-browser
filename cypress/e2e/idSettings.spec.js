import resolutions from '../fixtures/resolutions';

describe('Visit the Settings page', function () {
    const adminTestUser = {
        login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
        password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
    };

    beforeEach(function () {
        cy.visit('/');
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();
        cy.setResolution(resolutions[0]);
    });

    it('should open the Settings page(Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();
        cy.getByTestId('settings-card-header').should('be.visible');
    });

    it('should display ID structure settings and allow editing (Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();
        cy.contains('ID structure').should('be.visible');

        cy.getByTestId('settings-edit-button').click();

        // Verify edit mode is active
        cy.getByTestId('settings-edit-text-field-0').should('be.visible');

        // Verify cancel and save buttons are visible
        cy.getByTestId('settings-cancel-button').should('be.visible');
        cy.getByTestId('settings-save-button').should('be.visible');
    });

    it('should save ID structure settings successfully (Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();

        cy.getByTestId('settings-edit-button').click();

        const prefixValues = ['new-prefix-value-0', 'new-prefix-value-1'];
        const urlValues = ['https://example2.com', 'https://example3.com', 'https://example4.com'];

        prefixValues.forEach((value, i) => {
            cy.getByTestId(`settings-edit-text-field-${i}`).click();
            cy.getByTestId(`settings-edit-input-field-${i}`).clear();
            cy.getByTestId(`settings-edit-input-field-${i}`).type(value);
        });
        urlValues.forEach((value, i) => {
            cy.getByTestId(`settings-edit-text-field-${i + 2}`).click();
            cy.getByTestId(`settings-edit-input-field-${i + 2}`).clear();
            cy.getByTestId(`settings-edit-input-field-${i + 2}`).type(value);
        });

        cy.getByTestId('settings-save-button').click();

        // Verify updated values are visible
        prefixValues.forEach((value, i) => {
            cy.getByTestId(`settings-text-field-${i}`).should('contain', value);
        });
        urlValues.forEach((value, i) => {
            cy.getByTestId(`settings-text-field-${i + 2}`).should('contain', value);
        });

        // Verify edit mode is exited
        cy.get('settings-edit-text-field-0').should('not.exist');
    });

    it('should cancel ID structure settings changes (Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();
        cy.getByTestId('settings-edit-button').click();

        // Get original value
        cy.getByTestId(`settings-edit-input-field-0`).invoke('val').as('originalValue');

        cy.getByTestId(`settings-edit-input-field-0`).clear();
        cy.getByTestId(`settings-edit-input-field-0`).type('test-value');

        cy.getByTestId('settings-cancel-button').click();
        cy.contains('test-value').should('not.exist');

        cy.getByTestId('settings-edit-button').click();
        cy.get('@originalValue').then((originalValue) => {
            cy.getByTestId(`settings-edit-input-field-0`).should('have.value', originalValue);
        });
    });

    it('should open asset ID documentation dialog (Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();

        // Click documentation button
        cy.getByTestId('asset-id-redirect-documentation-dialog').click();

        // Verify dialog is open
        cy.get('[role="dialog"]').should('be.visible');
        cy.getByTestId('asset-id-redirect-documentation-dialog').should('exist');

        // Close dialog
        cy.get('[aria-label="close"]').click();

        // Verify dialog is closed
        cy.get('[role="dialog"]').should('not.exist');
    });

    // Test loading states
    it('should show loading skeletons while fetching settings (Resolution: ' + resolutions[0] + ')', function () {
        cy.getByTestId('settings-menu-icon').click();

        // Verify skeleton loaders appear initially
        cy.get('.MuiSkeleton-root').should('be.visible');

        // Wait for content to load
        cy.get('.MuiSkeleton-root').should('not.exist');
        cy.contains('ID structure').should('be.visible');
    });

    it(
        'should display validation errors for invalid prefix AssetIdShort and AasId values (Resolution: ' +
            resolutions[0] +
            ')',
        function () {
            cy.getByTestId('settings-menu-icon').click();
            cy.getByTestId('settings-edit-button').click();

            // Test invalid AssetIdShort prefix
            cy.getByTestId('settings-edit-text-field-0').click();
            cy.getByTestId('settings-edit-input-field-0').clear();
            cy.getByTestId('settings-edit-input-field-0').type('invalid iri');

            // Test invalid AasId prefix
            cy.getByTestId('settings-edit-text-field-2').click();
            cy.getByTestId('settings-edit-input-field-2').clear();
            cy.getByTestId('settings-edit-input-field-2').type('invalid iri');

            // Attempt to save with invalid prefixes
            cy.getByTestId('settings-save-button').click();

            // Assert that validation errors are shown
            cy.getByTestId('settings-edit-text-field-0-error').as('error0');
            cy.get('@error0').should('be.visible');
            cy.get('@error0').should('contain', 'Has to work as part of an IRI');

            cy.getByTestId('settings-edit-text-field-2-error').as('error2');
            cy.get('@error2').should('be.visible');
            cy.get('@error2').should('contain', 'Has to be a valid IRI');
        },
    );

    after(function () {
        cy.getByTestId('header-burgermenu').click();
        cy.keycloakLogout();
    });
});
