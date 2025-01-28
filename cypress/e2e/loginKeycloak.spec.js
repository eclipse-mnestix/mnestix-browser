import resolutions from '../fixtures/resolutions.json';
import users from '../fixtures/cypress_e2e/Users/testUsers.json';

resolutions.forEach((res) => {
    describe.skip(`Login Keycloak (${res})`, function () {
        const adminUser = {
            login: users.adminUser.login,
            password: users.adminUser.password,
        };
        beforeEach(function () {
            cy.visit('/');
        });
        it.skip('should be possible to login', () => {
            cy.getByTestId('header-burgermenu').click();
            cy.getByTestId('login-button').should('exist');
        });

        it.skip('should show correct admin user login and icon', () => {
            cy.keycloakLogin(adminUser.login, adminUser.password);
            cy.getByTestId('header-burgermenu').click();

            cy.getByTestId('user-label').should('have.text', 'test');
            cy.getByTestId('admin-icon').should('exist');
            cy.getByTestId('login-button').should('be.not.exist');
            cy.keycloakLogout();
        });

        it.skip('should show settings when logged in as admin user', () => {
            cy.keycloakLogin(adminUser.login, adminUser.password);
            cy.getByTestId('header-burgermenu').click();

            cy.getByTestId('settings-menu-icon').should('exist');
            cy.keycloakLogout();
        });
    });
});
