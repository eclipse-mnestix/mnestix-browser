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

    after(function () {
        cy.deleteListAasMockData();
    });
});
