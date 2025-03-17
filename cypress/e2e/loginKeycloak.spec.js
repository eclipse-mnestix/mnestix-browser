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

    it('should not be able to access templates without login', () => {
        cy.visit('/templates');
        cy.getByTestId('authentication-prompt-lock').should('exist');
    });

    it('should show correct admin user login and icon', () => {
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('user-info-box').should('have.text', 'admin@test.com');
        cy.getByTestId('admin-icon').should('exist');
        cy.getByTestId('login-button').should('be.not.exist');
        cy.keycloakLogout();
    });

    it('should navigate to settings when logged in as admin user', () => {
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('settings-menu-icon').should('exist').click();
        cy.getByTestId('settings-route-page').should('exist');
        cy.getByTestId('settings-header').should('have.text', 'Settings');

        cy.getByTestId('header-burgermenu').click();
        cy.keycloakLogout();
    });

    it('should show correct user login and icon', () => {
        cy.keycloakLogin(testUser.login, testUser.password);
        cy.getByTestId('header-burgermenu').click();

        cy.getByTestId('user-info-box').should('have.text', 'test@test.com');
        cy.getByTestId('user-icon').should('exist');
        cy.getByTestId('login-button').should('be.not.exist');
        cy.keycloakLogout();
    });

    it('should navigate to template when logged in as a user', () => {
        cy.keycloakLogin(testUser.login, testUser.password);

        cy.visit('/templates');
        cy.getByTestId('templates-route-page').should('exist');
        cy.getByTestId('templates-header').should('include.text', 'Templates');

        cy.getByTestId('header-burgermenu').click();
        cy.keycloakLogout();
    });

    it('should block settings route when logged in as s user', () => {
        cy.keycloakLogin(testUser.login, testUser.password);

        cy.visit('/settings');
        cy.getByTestId('not-allowed-prompt-lock').should('exist');

        cy.getByTestId('header-burgermenu').click();
        cy.getByTestId('settings-menu-icon').should('not.exist');

        cy.keycloakLogout();
    });
});
