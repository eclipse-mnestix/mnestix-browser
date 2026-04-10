import resolutions from '../fixtures/resolutions';

const adminTestUser = {
    login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
    password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
};

describe('Template CRUD Operations', () => {
    function loginIfNeeded() {
        cy.getByTestId('header-burgermenu').click();
        cy.get('body').then(($body) => {
            const hasLoginButton = $body.find('[data-testid=login-button]').length > 0;
            if (hasLoginButton) {
                cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
                cy.getByTestId('header-burgermenu').click();
            }
        });
    }

    beforeEach(function () {
        cy.visit('/');
        cy.setResolution(resolutions[0]);
        loginIfNeeded();
    });

    it('should create and delete a template', () => {
        cy.getByTestId('templates-menu-icon').click();

        cy.url().should('match', /\/templates$/);
        cy.getByTestId('templates-route-page').should('be.visible');

        cy.getByTestId('create-new-template-button').click();
        cy.getByTestId('choose-template-dialog').should('be.visible');

        cy.getByTestId('choose-template-item-0').should('be.visible');
        cy.getByTestId('choose-template-item-0').find('h4').first().click();
        cy.url({ timeout: 60000 }).should('match', /\/templates\/.+/);

        //delete the template
        cy.getByTestId('more-options-button').click();
        cy.getByTestId('more-options-menu').should('be.visible');
        cy.getByTestId('delete-template-button').click();
        cy.getByTestId('confirm-delete-button').click();

        cy.url().should('match', /\/templates$/);
        cy.getByTestId('templates-route-page').should('be.visible');
    });

    afterEach(function () {
        // Intentionally no logout here. Logging out from a potentially broken UI state
        // makes failures look like hangs because of high global Cypress timeouts.
    });
});
