import resolutions from '../fixtures/resolutions';

describe('Test all Aas List features (Resolution 1920 x 1080)', function () {
    before(function () {
        cy.postListAasMockData();
    });

    beforeEach(function () {
        cy.setResolution(resolutions[0]);
        cy.visit('/list');
    });

    it('should load the first list page of the default repository and display the data', function () {
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]')
            .findByTestId('list-aasId')
            .contains('https://mnestix.io/aas/listTest1');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]')
            .findByTestId('list-assetId')
            .contains('https://mnestix.io/listTest1');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]')
            .findByTestId('list-manufacturer-name')
            .contains('listTest1 Manufacturer Name');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]')
            .findByTestId('list-product-designation')
            .contains('listTest1 Product Designation');

        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest2"]')
            .findByTestId('list-aasId')
            .contains('https://mnestix.io/aas/listTest2');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest2"]')
            .findByTestId('list-assetId')
            .contains('https://mnestix.io/listTest2');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest2"]')
            .findByTestId('list-manufacturer-name')
            .contains('listTest2 Manufacturer Name');
        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest2"]')
            .findByTestId('list-product-designation')
            .contains('listTest2 Product Designation');
    });

    xdescribe('comparison list', function () {
        it('should show the selected aas in the comparison list, and comparison button redirects to comparison', function () {
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="selected-https://mnestix.io/aas/listTest1').should('exist');
            cy.getByTestId('compare-button').should('not.be.disabled');
            cy.getByTestId('compare-button').click();
            cy.url().should('contain', '/compare');
        });
        it('should remove the aas from the comparison list when deselected and disable the button', function () {
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="selected-https://mnestix.io/aas/listTest1').should('not.exist');
            cy.getByTestId('compare-button').should('be.disabled');
        });
        it('should disable checkboxes and show a warning when the user tries to select more than 3 aas', function () {
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest2"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest3"]').findByTestId('list-checkbox').click();
            cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest4"]')
                .findByTestId('list-checkbox')
                .parent()
                .click();
            cy.get('.MuiAlert-root').should('exist');
        });
    });

    after(function () {
        cy.deleteListAasMockData();
    });
});
