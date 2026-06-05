import resolutions from '../fixtures/resolutions';

const adminTestUser = {
    login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
    password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
};

describe('Template CRUD Operations', () => {
    const uniqueId = Date.now();
    const editedTemplateName = `Test Template ${uniqueId} (edited)`;

    function loginIfNeeded() {
        cy.getByTestId('header-burgermenu').should('be.visible').click();
        cy.get('body').then(($body) => {
            const hasLoginButton = $body.find('[data-testid=login-button]').length > 0;

            if (!hasLoginButton) {
                // Close opened menu and continue when already authenticated.
                cy.getByTestId('header-burgermenu').click();
                return;
            }

            cy.getByTestId('login-button').click();
            cy.origin(
                Cypress.env('KEYCLOAK_ISSUER'),
                { args: { login: adminTestUser.login, password: adminTestUser.password } },
                ({ login, password }) => {
                    cy.get('#username').invoke('focus').type(login);
                    cy.get('#password').invoke('focus').type(password, { log: false });
                    cy.get('#kc-login').invoke('focus').click();
                },
            );
            cy.get('button').click();
            cy.getByTestId('header-burgermenu').click();
        });
    }

    beforeEach(function () {
        cy.visit('/');
        cy.setResolution(resolutions[0]);
        loginIfNeeded();

        cy.visit('/templates');
        cy.url().should('match', /\/templates$/);
        cy.getByTestId('templates-route-page').should('be.visible');
    });

    it('should create/edit and delete a template', () => {
        cy.getByTestId('create-new-template-button').click();
        cy.getByTestId('choose-template-dialog').should('be.visible');

        cy.getByTestId('choose-template-item-0').should('be.visible');
        cy.getByTestId('choose-template-item-0').find('h4').first().click();
        cy.url({ timeout: 60000 }).should('match', /\/templates\/.+/);

        // Edit immediately after navigation while the editor is active.
        cy.getByTestId('display-name-input', { timeout: 10000 }).should('be.visible');
        cy.getByTestId('display-name-input').invoke('val', editedTemplateName);
        cy.getByTestId('display-name-input').trigger('input', { force: true });
        cy.getByTestId('display-name-input').blur({ force: true });

        cy.getByTestId('save-changes-button').should('be.enabled').click();

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
