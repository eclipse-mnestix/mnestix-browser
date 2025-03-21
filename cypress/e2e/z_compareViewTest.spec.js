// intentionally named z_ to run this test in last batch
import resolutions from '../fixtures/resolutions.json';
import compareAAS from '../fixtures/cypress_e2e/CompareMockData/cy_compareAas.json';

describe('Test compare feature view', function () {
    before(function () {
        cy.postCompareMockData();
    });
    describe('Open compare feature and add data', function () {
        beforeEach(function () {
            cy.visit('/');
            cy.getByTestId('aasId-input').as('IDInput');
            cy.setResolution(resolutions[0]);
            //insert first aas to compare and redirect to detail view
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[0].id);
            cy.getByTestId('aasId-submit-button').click();
            cy.getByTestId('detail-compare-button').should('be.visible');
        });

        it('In the viewer detail page clicking Compare redirects to compare feature and loads first data to compare', function () {
            cy.getByTestId('detail-compare-button').click();
            cy.url().should('contain', '/compare');
            cy.getByTestId('compare-aas-0').should('be.visible');
            cy.getByTestId('compare-Data-0').click();
            cy.getByTestId('compare-Record').eq(0).should('be.visible');
        });

        it('In the compare view clicks on the add another AAS and adds correct data to compare', function () {
            cy.getByTestId('detail-compare-button').click();
            cy.getByTestId('compare-aas-0').should('be.visible');
            // open popup dialog and insert second aas to compare
            cy.getByTestId('add-aas-to-compare-button').click();
            cy.getByTestId('compare-aas-aad-dialog').should('be.visible');
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[1].assetInformation.globalAssetId);
            cy.getByTestId('aasId-submit-button').click();
            // assert if second aas is visible and contains correct values
            cy.getByTestId('compare-aas-1').should('be.visible');
            cy.getByTestId('compare-Data-0').click();
            cy.getByTestId('compare-value-1').eq(1).contains('TEST_DATA2');
            cy.getByTestId('compare-value-0').eq(10).should('be.empty');
            cy.getByTestId('compare-value-1').eq(10).contains('2022-01-01');
            // assert collection of records
            // get first collection and assert correct values
            cy.getByTestId('submodel-dropdown-button').first().click();
            cy.getByTestId('compare-value-0').eq(5).contains('de');
            cy.getByTestId('compare-value-1').eq(5).should('be.empty');
            cy.getByTestId('compare-value-0').eq(7).contains('Musterstadt');
            cy.getByTestId('compare-value-1').eq(7).should('be.empty');
            cy.getByTestId('compare-value-1').eq(8).contains('ABC Company');
        });

        it('In the compare view three aas are added with correct data and no possibility to add more aas', function () {
            cy.getByTestId('detail-compare-button').click();
            cy.getByTestId('compare-aas-0').should('be.visible');
            // open popup dialog and insert second aas to compare
            cy.getByTestId('add-aas-to-compare-button').click();
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[1].assetInformation.globalAssetId);
            cy.getByTestId('aasId-submit-button').click();
            // wait for aas to be loaded and visible
            cy.getByTestId('compare-aas-1').should('be.visible');
            // assert that adding aas should still be possible
            cy.getByTestId('add-aas-to-compare-button').should('exist');
            // open popup dialog and insert third aas to compare
            cy.getByTestId('add-aas-to-compare-button').click();
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[2].assetInformation.globalAssetId);
            cy.getByTestId('aasId-submit-button').click();
            // assert if third aas is visible and contains correct values
            cy.getByTestId('compare-aas-2').should('be.visible');
            cy.getByTestId('compare-Data-0').should('be.visible').click();
            // assert that adding aas should not be possible
            cy.getByTestId('add-aas-to-compare-button').should('not.exist');
            // assert if third aas contains correct values
            cy.getByTestId('compare-value-2').last().contains('1.0');
            cy.getByTestId('compare-value-1').last().should('be.empty');
            cy.getByTestId('compare-value-0').last().should('be.empty');
        });

        it('In the compare view check if different values are being marked when different', function () {
            cy.getByTestId('detail-compare-button').click();
            cy.getByTestId('compare-aas-0').should('be.visible');
            // open popup dialog and insert second aas to compare
            cy.getByTestId('add-aas-to-compare-button').click();
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[1].assetInformation.globalAssetId);
            cy.getByTestId('aasId-submit-button').click();
            // assert if different values have been marked
            cy.getByTestId('compare-Data-0').click();
            cy.getByTestId('compare-value-0').eq(1).find('svg').should('not.exist');
            cy.getByTestId('compare-value-1').eq(1).find('svg').should('be.visible');
            // assert collection items
            cy.getByTestId('submodel-dropdown-button').first().click();
            cy.getByTestId('compare-value-0').eq(5).find('svg').should('be.visible');
            // open popup dialog and insert third aas to compare
            cy.getByTestId('add-aas-to-compare-button').click();
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[2].assetInformation.globalAssetId);
            cy.getByTestId('aasId-submit-button').click();
            // assert that correct values were marked
            for (let i = 0; i < 3; i++) {
                cy.getByTestId(`compare-value-${i}`).eq(1).find('svg').should('be.visible');
            }
        });
    });

    describe('Delete compare data', function () {
        beforeEach(function () {
            cy.visit('/');
            cy.getByTestId('aasId-input').as('IDInput');
            cy.setResolution(resolutions[0]);
            cy.get('@IDInput').click();
            cy.get('@IDInput').type(compareAAS[0].id);
            cy.getByTestId('aasId-submit-button').click();
            cy.getByTestId('detail-compare-button').click();
            cy.getByTestId('compare-aas-0').should('be.visible');
            // //insert mock data
            for (let i = 1; i < 3; i++) {
                cy.getByTestId('add-aas-to-compare-button').click();
                cy.get('@IDInput').click();
                cy.get('@IDInput').type(compareAAS[i].assetInformation.globalAssetId);
                cy.getByTestId('aasId-submit-button').click();
                cy.getByTestId(`compare-aas-${i}`).should('be.visible');
            }
        });

        it('In the compare view delete third element and it is possible to add aas to compare', function () {
            // delete third aas
            cy.getByTestId('delete-compare-aas-2').click();
            // assert that third aas does not exists
            cy.getByTestId('compare-aas-2').should('not.exist');
            // assert that it is possible to add ass
            cy.getByTestId('add-aas-to-compare-button').should('exist');
        });

        it('In the compare view delete third element and check if data records were deleted', function () {
            // assert data of third aas should exist
            cy.getByTestId('compare-value-2').should('exist');
            // delete third aas
            cy.getByTestId('delete-compare-aas-2').click();
            cy.getByTestId('compare-Data-0').click();
            // assert that data records does not exist for third aas
            cy.getByTestId('compare-value-2').should('not.exist');
        });

        it('In the compare view delete second element and check if data records were deleted and third element was shifted to second position', function () {
            // assert that value in the second position is equal to TEST_DATA2
            cy.getByTestId('compare-Data-0').click();
            cy.getByTestId('compare-value-1').eq(1).contains('TEST_DATA2');
            // delete third aas
            cy.getByTestId('delete-compare-aas-1').click();
            cy.getByTestId('compare-Data-0').click();
            // assert that value in the second position is equal to TEST_DATA3
            cy.getByTestId('compare-value-1').eq(1).contains('TEST_DATA3');
        });

        it('In the compare view delete all elements', function () {
            // data for each aas should exist
            cy.getByTestId('compare-Data-0').should('exist');
            // delete all aas
            for (let i = 2; i >= 0; i--) {
                cy.getByTestId(`delete-compare-aas-${i}`).click();
            }
            // assert that data records for any aas does not exists
            cy.getByTestId('compare-value').should('not.exist');
            cy.getByTestId('compare-value').should('not.exist');
            cy.getByTestId('compare-value').should('not.exist');
        });
    });

    it('Clicking the image of an AAS in compare view redirects to the detail page', function () {
        cy.setResolution(resolutions[0]);

        // go to compare view with all three test data
        const url = `/compare?aasId=${compareAAS[0].id}&aasId=${compareAAS[1].id}&aasId=${compareAAS[2].id}`;
        cy.visit(url);
        cy.getByTestId('compare-aas-2').should('be.visible');

        // click second image
        cy.getByTestId('compare-aas-1').findByTestId('image-with-fallback').click();

        // check if url is correct
        const b64Url = btoa(compareAAS[1].id).replace(/=*$/, '');
        cy.url().should('contain', `/viewer/${b64Url}`);

        // check if loaded aas id is correct
        cy.getByTestId('aas-data').findByTestId('data-row-value').should('contain', compareAAS[1].id);
    });

    after(function () {
        cy.deleteCompareMockData();
    });
});
