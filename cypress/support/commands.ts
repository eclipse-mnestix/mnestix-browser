import testAAS from '../fixtures/cypress_e2e/cypressTestAas.json';
import testDropdown from '../fixtures/cypress_e2e/Submodels/cyDropdown.json';
import testDropdownSubRef from '../fixtures/cypress_e2e/Submodels/cyDropdown_SubmodelReference.json';
import testBom from '../fixtures/cypress_e2e/Submodels/cyBillOfMaterial.json';
import testBomSubRef from '../fixtures/cypress_e2e/Submodels/cyBillOfMaterial_SubmodelReference.json';
import AASBomComponent from '../fixtures/cypress_e2e/cyTestAas_BoM_Component.json';
import compareAAS from '../fixtures/cypress_e2e/CompareMockData/cy_compareAas.json';
import compareSubmodels from '../fixtures/cypress_e2e/CompareMockData/cy_compareNameplateSubmodel.json';
import qrAAS from '../fixtures/cypress_e2e/QrScannerMockData/cy_qrScannerAas.json';
import qrSubmodels from '../fixtures/cypress_e2e/QrScannerMockData/cy_qrScannerNameplateSubmodel.json';
import listAasMockData from '../fixtures/cypress_e2e/AasListMockData/cyListAasMockData.json';
import listAasSubmodelMockData from '../fixtures/cypress_e2e/AasListMockData/cy_ListNameplateSubmodel.json';
import thumbnailAasMockData from '../fixtures/cypress_e2e/ThumbnailFileMockData/thumbnailAasMockData.json';
import toBase64 from './base64-conversion';

Cypress.Commands.add('setResolution', (res) => {
    if (Array.isArray(res)) {
        cy.viewport(res[0], res[1]);
    } else {
        cy.viewport(res);
    }
});

Cypress.Commands.add('visitViewer', (aasId) => {
    cy.visit('/viewer/' + toBase64(aasId));
});

Cypress.Commands.add('getByTestId', (dataTestId, option?) => {
    cy.get('[data-testid=' + dataTestId + ']', option);
});

Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, dataTestId) => {
    return cy.wrap(subject).find('[data-testid=' + dataTestId + ']');
});

Cypress.Commands.add('repoRequest', (requestMethod, urlPath, requestBody) => {
    cy.request({
        method: requestMethod,
        url: `${Cypress.env('AAS_REPO_API_URL')}${urlPath}`,
        headers: {
            ApiKey: Cypress.env('MNESTIX_API_KEY'),
        },
        body: requestBody,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add('postCompareMockData', () => {
    compareAAS.forEach((aas) => {
        cy.repoRequest('POST', '/shells', aas);
    });
    compareSubmodels.forEach((submodel) => {
        cy.repoRequest('POST', '/submodels', submodel);
    });
});

Cypress.Commands.add('deleteCompareMockData', () => {
    compareAAS.forEach((aas) => {
        const encodedAasId = btoa(aas.id);
        cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
    });
    compareSubmodels.forEach((submodel) => {
        const encodedSubmodelId = btoa(submodel.id);
        cy.repoRequest('DELETE', '/submodels/' + encodedSubmodelId, null);
    });
});

Cypress.Commands.add('postQrScannerMockData', () => {
    qrAAS.forEach((aas) => {
        cy.repoRequest('POST', '/shells', aas);
    });
    qrSubmodels.forEach((submodel) => {
        cy.repoRequest('POST', '/submodels', submodel);
    });
});

Cypress.Commands.add('deleteQrScannerMockData', () => {
    qrAAS.forEach((aas) => {
        const encodedAasId = btoa(aas.id);
        cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
    });
    qrSubmodels.forEach((submodel) => {
        const encodedSubmodelId = btoa(submodel.id);
        cy.repoRequest('DELETE', '/submodels/' + encodedSubmodelId, null);
    });
});

Cypress.Commands.add('postTestAas', () => {
    const encodedAasId = toBase64(testAAS.id);
    cy.repoRequest('POST', '/shells', testAAS);
    cy.postSubmodelToAas(encodedAasId, testDropdown, testDropdownSubRef);
    cy.postSubmodelToAas(encodedAasId, testBom, testBomSubRef);
});

Cypress.Commands.add('deleteTestAas', () => {
    const encodedAasId = btoa(testAAS.id);
    cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
    const endcodedTestDropdown = btoa(testDropdown.id);
    cy.repoRequest('DELETE', '/submodels/' + endcodedTestDropdown, null);
    const encodedTestBom = btoa(testBom.id);
    cy.repoRequest('DELETE', '/submodels/' + encodedTestBom, null);
});

Cypress.Commands.add('postSubmodelToAas', (base64EncodedAasId, submodelBody, submodelRef) => {
    cy.repoRequest('POST', '/submodels', submodelBody);
    cy.repoRequest('POST', '/shells/' + base64EncodedAasId + '/submodel-refs', submodelRef);
});

Cypress.Commands.add('deleteTestAasBomComponent', () => {
    const encodedAasBomId = toBase64(AASBomComponent.id);
    cy.repoRequest('DELETE', '/shells/' + encodedAasBomId, null);
});

Cypress.Commands.add('postListAasMockData', () => {
    listAasMockData.forEach((aas) => {
        cy.repoRequest('POST', '/shells', aas);
    });
    listAasSubmodelMockData.forEach((submodel) => {
        cy.repoRequest('POST', '/submodels', submodel);
    });
});

Cypress.Commands.add('deleteListAasMockData', () => {
    listAasMockData.forEach((aas) => {
        const encodedAasId = btoa(aas.id);
        cy.repoRequest('DELETE', '/shells/' + encodedAasId, null);
    });
    listAasSubmodelMockData.forEach((submodel) => {
        const encodedSubmodelId = btoa(submodel.id);
        cy.repoRequest('DELETE', '/submodels/' + encodedSubmodelId, null);
    });
});

Cypress.Commands.add('callScannerCallback', (value: string) => {
    cy.window().then((window) => {
        // @ts-ignore
        const func = window.Cypress.scannerCallback;
        expect(func).to.be.a('function');
        func(value).catch();
    });
});

Cypress.Commands.add('isNotificationSent', (msg: string) => {
    cy.get('.MuiAlert-message').should('contain.text', msg);
});

Cypress.Commands.add('postTestThumbnailAas', () => {
    cy.repoRequest('POST', '/shells', thumbnailAasMockData);
});

Cypress.Commands.add('deleteTestThumbnailAas', () => {
    const encodedAasThumbnailMockData = btoa(thumbnailAasMockData.id).replace(/=+$/g, '');
    cy.repoRequest('DELETE', '/shells/' + encodedAasThumbnailMockData, null);
});

Cypress.Commands.add('uploadThumbnailToAas', (aasId: string) => {
    const encodedAasId = btoa(aasId).replace(/=+$/g, '');
    cy.fixture('cypress_e2e/ThumbnailFileMockData/test_thumbnail.png', 'binary')
        .then((binary) => Cypress.Blob.binaryStringToBlob(binary, 'image/png'))
        .then((file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            cy.request({
                method: 'PUT',
                url:
                    `${Cypress.env('AAS_REPO_API_URL')}` +
                    '/shells/' +
                    encodedAasId +
                    '/asset-information/thumbnail?fileName=test_thumbnail.png',
                body: formData,
                encoding: 'binary',
                headers: {
                    ApiKey: Cypress.env('MNESTIX_API_KEY'),
                },
            });
        });
});

Cypress.Commands.add('deleteThumbnailFromAas', (aasId: string) => {
    const encodedAasId = btoa(aasId).replace(/=+$/g, '');
    cy.repoRequest('DELETE', '/shells/' + encodedAasId + '/asset-information/thumbnail', null);
});

Cypress.Commands.add('keycloakLogin', (login: string, password: string) => {
    cy.getByTestId('header-burgermenu').click();
    cy.getByTestId('login-button').click();
    cy.get('#username').type(login);
    cy.get('#password').type(password, { log: false });
    cy.get('#kc-login').click();
});

Cypress.Commands.add('keycloakLogout', () => {
    cy.getByTestId('logout-button').click();
});
