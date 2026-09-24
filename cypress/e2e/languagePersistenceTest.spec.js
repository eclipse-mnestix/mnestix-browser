import resolutions from '../fixtures/resolutions.json';

// Pins the invariant "the selected language survives in-app navigation".
//
// The language MUST be switched via the selector (a soft, client-side
// navigation) and never via cy.visit('/de'): a document request to a
// localized URL makes the next-intl middleware set the NEXT_LOCALE cookie,
// which would then paper over the bug these tests pin down. Switching via
// the selector leaves no persisted preference, so every navigation that
// drops the locale prefix from the URL resets the language to whatever the
// middleware detects (Accept-Language / default 'en').
describe('Language persistence across navigation', () => {
    beforeEach(() => {
        cy.setResolution(resolutions[0]);
    });

    function switchLanguageToGerman() {
        cy.getByTestId('language-selector').click();
        cy.get('[data-testid="language-de"]').click();
        cy.contains('Willkommen').should('be.visible');
    }

    it('keeps the selected language when clicking the header logo', () => {
        cy.visit('/');
        cy.contains('Welcome').should('be.visible');

        switchLanguageToGerman();

        cy.getByTestId('header-logo').click();

        cy.url().should('contain', '/de');
        cy.contains('Willkommen').should('be.visible');
    });

    it('keeps the selected language when navigating to the list via the main menu', () => {
        cy.visit('/');
        switchLanguageToGerman();

        cy.getByTestId('header-burgermenu').click();
        cy.get('[data-testid="/list"]').click();

        cy.url().should('contain', '/de/list');
        cy.contains('AAS Liste').should('be.visible');
    });

    it('keeps the selected language when navigating to the list via the homepage card', () => {
        cy.visit('/');
        switchLanguageToGerman();

        cy.get('[aria-label="Zur AAS Liste"]').click();

        cy.url().should('contain', '/de/list');
        cy.contains('AAS Liste').should('be.visible');
    });
});

describe('Language persistence when opening an AAS from the list', () => {
    before(function () {
        cy.postListAasMockData();
    });

    after(function () {
        cy.deleteListAasMockData();
    });

    it('opens the viewer URL in the currently selected language', () => {
        cy.setResolution(resolutions[0]);
        cy.visit('/list');
        cy.contains('AAS List').should('be.visible');

        cy.getByTestId('language-selector').click();
        cy.get('[data-testid="language-de"]').click();

        // The locale switch is a soft navigation; wait for the German page
        // to actually render before clicking, otherwise the row still
        // renders with the previous locale.
        cy.url().should('contain', '/de/list');
        cy.contains('AAS Liste').should('be.visible');

        // The list row opens the viewer via window.open; capture the URL it
        // receives instead of following the popup.
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });

        cy.get('[data-testid="list-row-https://mnestix.io/aas/listTest1"]')
            .findByTestId('list-to-detailview-button')
            .click();

        cy.get('@windowOpen').should('have.been.calledWithMatch', /\/de\/viewer\//);
    });
});
