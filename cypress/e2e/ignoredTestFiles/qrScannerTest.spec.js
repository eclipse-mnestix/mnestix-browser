/**
 * This tests do not work inside a dockerized cypress instance.
 * The camera requires https or localhost to open successfully.
 *
 * If you want to run them manually, move the file up one directory inside e2e.
 *
 * Maybe switching to chrome will help in the future, as there seems to be more configuration options.
 */

import resolutions from '../../fixtures/resolutions.json';
import qrAas from '../../fixtures/cypress_e2e/QrScannerMockData/cy_qrScannerAas.json';

describe('Use the QR Scanner', function () {
    before(function () {
        cy.postQrScannerMockData();
    });

    resolutions.forEach((res) => {
        describe('test on resolution: ' + res, function () {
            const [qr1, qr2] = qrAas;

            beforeEach(function () {
                cy.setResolution(res);
            });

            it('should automatically be redirected to the right viewer page', () => {
                cy.visit('/');
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr1.id);
                cy.url().should('contain', '/viewer/' + btoa(qr1.id).replace(new RegExp('=*$', 'g'), ''));
            });
            it('should close the QR scanner video and show the stopped state', () => {
                cy.visit('/');
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.getByTestId('scanner-close-button').click();
                cy.getByTestId('scanner-video').should('not.exist');
                cy.getByTestId('scanner-start').should('exist');
            });
            it('should reshow the video on a wrong QR code', () => {
                cy.visit('/');
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback('wrongTestId');
                cy.getByTestId('scanner-video').should('not.exist');
                cy.isNotificationSent('No AAS with the given ID.');
                cy.getByTestId('scanner-video').should('exist');
            });
            xit('should add AAS in comparison view', () => {
                cy.visit('/compare');
                cy.getByTestId('compare-aas-0').should('not.exist');

                cy.getByTestId('add-aas-to-compare-button').click();
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr1.id);
                cy.getByTestId('scanner-video').should('not.exist');
                cy.getByTestId('compare-aas-aad-dialog').should('not.exist');
                cy.getByTestId('compare-aas-0').should('exist');
                cy.getByTestId('compare-aas-1').should('not.exist');

                cy.getByTestId('add-aas-to-compare-button').click();
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr2.id);
                cy.getByTestId('scanner-video').should('not.exist');
                cy.getByTestId('compare-aas-aad-dialog').should('not.exist');
                cy.getByTestId('compare-aas-0').should('exist');
                cy.getByTestId('compare-aas-1').should('exist');
            });
            xit('should show duplicate AAS error on same AAS QR code', () => {
                cy.visit('/compare?aasId=' + encodeURIComponent(qr1.id));
                cy.getByTestId('compare-aas-0').should('exist');
                cy.getByTestId('add-aas-to-compare-button').click();
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr1.id);
                cy.getByTestId('scanner-video').should('not.exist');
                cy.isNotificationSent('AAS cannot be added more than once.');
                cy.getByTestId('scanner-video').should('exist');
                cy.getByTestId('compare-aas-1').should('not.exist');
            });
            xit('should add AAS in comparison view with assetId', () => {
                cy.visit('/compare');
                cy.getByTestId('compare-aas-0').should('not.exist');
                cy.getByTestId('add-aas-to-compare-button').click();
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr1.assetInformation.globalAssetId);
                cy.getByTestId('scanner-video').should('not.exist');
                cy.getByTestId('compare-aas-aad-dialog').should('not.exist');
                cy.getByTestId('compare-aas-0').should('exist');
            });
            xit('should show multiple AAS error on multiple asset QR code', () => {
                cy.visit('/compare');
                cy.getByTestId('compare-aas-0').should('not.exist');
                cy.getByTestId('add-aas-to-compare-button').click();
                cy.getByTestId('scanner-start').click();
                cy.getByTestId('scanner-video').should('exist');
                cy.callScannerCallback(qr2.assetInformation.globalAssetId);
                cy.getByTestId('scanner-video').should('not.exist');
                cy.isNotificationSent('More than one AAS found in the discovery service');
                cy.getByTestId('scanner-video').should('exist');
                cy.getByTestId('compare-aas-0').should('not.exist');
            });
        });
    });

    after(function () {
        cy.deleteQrScannerMockData();
    });
});
