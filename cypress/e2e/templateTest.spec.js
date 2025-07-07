import resolutions from '../fixtures/resolutions';

describe('Template CRUD Operations', () => {
    const templateName = 'Test Template';
    const editedTemplateName = `${templateName} (edited)`;

    beforeEach(() => {
        cy.setResolution(resolutions[0]);
        cy.visit('/templates');
    });

    it('should create a new template', () => {
        cy.getByTestId('create-new-template-button').click();
        cy.getByTestId('choose-template-dialog').should('be.visible');
    
        cy.getByTestId('choose-template-item-0').click();
        cy.url().should('include', '/templates/');

        cy.getByTestId('display-name-input').clear().type(templateName);

        cy.getByTestId('save-changes-button').click();

        cy.visit('/templates');

        cy.contains(templateName).should('be.visible');
    });

    it('should edit an existing template', () => {
        cy.contains(templateName).click();

        cy.url().should('include', '/templates/');

        cy.getByTestId('display-name-input').clear().type(editedTemplateName);

        cy.getByTestId('save-changes-button').click();

        cy.visit('/templates');
        cy.contains(editedTemplateName).should('be.visible');
        cy.contains(templateName).should('not.exist');
    });

    it('should delete an existing template', () => {
        cy.visit('/templates');

        cy.contains(editedTemplateName).click();

        cy.url().should('include', '/templates/');

        cy.getByTestId('more-options-button').click();
        cy.getByTestId('more-options-menu').should('be.visible');
        cy.getByTestId('delete-template-button').click();

        cy.getByTestId('confirm-delete-button').click();

        cy.url().should('match', /\/templates$/);

        cy.contains(editedTemplateName).should('not.exist');
        cy.contains(templateName).should('not.exist');
    });
});