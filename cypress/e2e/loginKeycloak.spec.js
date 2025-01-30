describe('Login Keycloak user roles', function () {
    const adminTestUser = {
        login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
        password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
    };
    const testUser = {
        login: Cypress.env('TEST_USER_LOGIN'),
        password: Cypress.env('TEST_USER_PASSWORD'),
    };

    beforeEach(function () {
        cy.visit('/');
    });
    it('should be possible to login', () => {
        cy.getByTestId('header-burgermenu').click();
        cy.getByTestId('login-button').should('exist');
    });

    it('should show correct admin user login and icon', () => {
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('user-label').should('have.text', 'admin@test.com');
        cy.getByTestId('admin-icon').should('exist');
        cy.getByTestId('login-button').should('be.not.exist');
        cy.keycloakLogout();
    });

    it('should show settings when logged in as admin user', () => {
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('settings-menu-icon').should('exist');
        cy.keycloakLogout();
    });

    it('should show correct user login and icon', () => {
        cy.keycloakLogin(testUser.login, testUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('user-label').should('have.text', 'user@test.com');
        cy.getByTestId('user-icon').should('exist');
        cy.getByTestId('login-button').should('be.not.exist');
        cy.keycloakLogout();
    });

    it('should not show settings when logged in as user', () => {
        cy.keycloakLogin(testUser.login, testUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('settings-menu-icon').should('not.exist');
        cy.keycloakLogout();
    });
});
