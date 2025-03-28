import resolutions from '../fixtures/resolutions';

describe('RBAC Role Page Tests', function () {
    const adminTestUser = {
        login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
        password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
    };

    it('should contain all content for PC', () => {
        cy.setResolution(resolutions[0]);
        cy.visit('/');
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();
        cy.getByTestId('settings-menu-item').click();
        cy.getByTestId('tab-selector-Role-Management').findByTestId('submodel-tab').click();

        cy.getByTestId('rbac-role-row-15').within(() => {
            cy.getByTestId('rbac-role-name-15').should('contain', 'mnestix-aas-reader');
            cy.getByTestId('rbac-role-action-15-0').should('contain', 'READ');
            cy.getByTestId('rbac-role-type-15').should('contain', 'aas');
            cy.getByTestId('rbac-role-permissions-15').should('contain', 'https://vws.xitaso.com/aas/mnestix');
        });
        cy.keycloakLogout();
    });

    it('should contain not contain permissions column for mobile', () => {
        cy.setResolution(resolutions[1]);
        cy.visit('/');
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();
        cy.getByTestId('settings-menu-item').click();
        cy.getByTestId('tab-selector-Role-Management').findByTestId('submodel-tab').click();

        cy.getByTestId('rbac-role-row-15').within(() => {
            cy.getByTestId('rbac-role-name-15').should('contain', 'mnestix-aas-reader');
            cy.getByTestId('rbac-role-action-15-0').should('contain', 'READ');
            cy.getByTestId('rbac-role-type-15').should('contain', 'aas');
            cy.getByTestId('rbac-role-permissions-15').should('not.exist');
        });
        cy.keycloakLogout();
    });

    resolutions.forEach((resolution) => {
        describe(`Resolution: ${resolution}`, function () {
            beforeEach(function () {
                cy.setResolution(resolution);
                cy.visit('/');
                cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
                cy.getByTestId('header-burgermenu').click();
                cy.getByTestId('settings-menu-item').click();
                cy.getByTestId('tab-selector-Role-Management').findByTestId('submodel-tab').click();
            });

            afterEach(function () {
                cy.keycloakLogout();
            });

            it('should load the RBAC role list', () => {
                cy.getByTestId('rbac-role-list-page').should('exist');
                cy.getByTestId('rbac-role-row-0').should('exist');
                cy.getByTestId('rbac-role-row-5').should('exist');
                cy.getByTestId('rbac-role-row-9').should('exist');
            });

            it('should open and close the dialog', () => {
                cy.getByTestId('rbac-role-dialog').should('not.exist');
                cy.getByTestId('rbac-open-dialog-button-16').click();
                cy.getByTestId('rbac-role-dialog').should('exist');
                cy.getByTestId('rbac-close-dialog-button').click();
                cy.getByTestId('rbac-role-dialog').should('not.exist');
            });

            it('dialog should contain data', () => {
                cy.getByTestId('rbac-open-dialog-button-16').click();
                cy.getByTestId('rbac-role-dialog-title').should('contain', 'mnestix-submodel-reader');
                cy.getByTestId('rbac-role-dialog-action').should('contain', 'READ');
                cy.getByTestId('rbac-role-dialog-type').should('contain', 'submodel');
                cy.getByTestId('permissions-key-1').should('contain', 'submodelIds');
                cy.getByTestId('permissions-list-1').should(
                    'contain',
                    'https://example.com/ids/sm/7791_1307_3131_5873',
                );
                cy.getByTestId('rbac-close-dialog-button').click();
            });
        });
    });
});
