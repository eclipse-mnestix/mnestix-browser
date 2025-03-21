import testAAS from '../fixtures/testAAS.json';
import resolutions from '../fixtures/resolutions.json';

const pageURLNames = { '/': 'index', '/templates': 'templates', '/settings': 'settings' };
const testId = testAAS.aasId;

describe('Test the redirection by clicking the header logo', function () {
    for (let url in pageURLNames) {
        describe('test the redirection on the ' + pageURLNames[url] + ' page', function () {
            resolutions.forEach((res) => {
                it(
                    'should click on the logo and be redirected to the home screen (Resolution: ' + res + ')',
                    function () {
                        cy.setResolution(res);
                        cy.visit(url);
                        cy.getByTestId('header-logo').click();
                        cy.getByTestId('welcome-text').should('exist');
                    },
                );
            });
        });
    }

    describe('test the redirection on the viewer page', function () {
        before(function () {
            cy.postTestAas();
        });
        resolutions.forEach((res) => {
            it('should click on the logo and be redirected to the home screen (Resolution: ' + res + ')', function () {
                cy.setResolution(res);
                cy.visitViewer(testId);
                cy.getByTestId('header-logo').click();
                cy.getByTestId('welcome-text').should('exist');
            });
        });
        after(function () {
            cy.deleteTestAas();
        });
    });
});
