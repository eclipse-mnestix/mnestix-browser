import resolutions from '../fixtures/resolutions';

const adminTestUser = {
    login: Cypress.env('TEST_ADMIN_USER_LOGIN'),
    password: Cypress.env('TEST_ADMIN_USER_PASSWORD'),
};

describe('Template CRUD Operations', () => {
    const templateName = 'Test Template';
    const editedTemplateName = `${templateName} (edited)`;

    beforeEach(function () {
        cy.visit('/');
        cy.setResolution(resolutions[0]);
        cy.keycloakLogin(adminTestUser.login, adminTestUser.password);
        cy.getByTestId('header-burgermenu').click();
        
    });

    it('should create/edit and delete a template', () => {
        
        cy.getByTestId('templates-menu-icon').click();

        cy.url().should('match', /\/templates$/);
        
        cy.getByTestId('create-new-template-button').click();
        cy.getByTestId('choose-template-dialog').should('be.visible');
    
        cy.getByTestId('choose-template-item-0').click();
        cy.url().should('include', '/templates/');
        cy.getByTestId('display-name-input').clear();
        cy.getByTestId('display-name-input').type(templateName);

        cy.getByTestId('save-changes-button').click();
        cy.visit('/templates');
        cy.contains(templateName).should('be.visible');

        //edit template
        cy.contains(templateName).click();
        cy.url().should('include', '/templates/');
        cy.get('[role="tree"] [role="treeitem"]').first().click();

        cy.getByTestId('display-name-input').clear();
        cy.getByTestId('display-name-input').type(editedTemplateName);

        cy.getByTestId('save-changes-button').click();

        cy.visit('/templates');
        cy.contains(editedTemplateName).should('be.visible');

        //delete the template
        cy.contains(editedTemplateName).click();

        cy.url().should('include', '/templates/');

        cy.getByTestId('more-options-button').click();
        cy.getByTestId('more-options-menu').should('be.visible');
        cy.getByTestId('delete-template-button').click()
        cy.getByTestId('confirm-delete-button').click();

        cy.url().should('match', /\/templates$/);

        cy.contains(editedTemplateName).should('not.exist');
        cy.contains(templateName).should('not.exist');
    });

    afterEach(function () {
        cy.getByTestId('header-burgermenu').click();
        cy.keycloakLogout();
    });
});