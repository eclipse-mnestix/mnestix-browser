/**
 * @deprecated Please use t() of useTranslations(... instead as shown in TimeSeriesVisualizations.tsx
 */
export const deMnestix = {
    welcome: 'Willkommen bei Mnestix',
    digitalTwinMadeEasy: 'Digitaler Zwilling leicht gemacht.',
    notFound: 'Nicht gefunden',
    aasUrlNotFound: 'Keine Verwaltungsschale unter dieser ID.',
    cannotLoadAasId: {
        header: 'Verwaltungsschale konnte nicht geladen werden.',
        text: 'Es konnte keine Verwaltungsschale für die angegebene ID "{id}" geladen werden.',
    },
    idShort: 'idShort: {idShort}',
    manufacturer: 'Hersteller: {manufacturerName}',
    aasId: 'AAS ID',
    assetId: 'Asset ID',
    orEnterManual: 'oder manuell eingeben',
    orSelectFromList: 'oder über Liste suchen',
    goToListButton: 'Zur AAS Liste',
    scanAasId: 'AAS ID oder Asset ID scannen',
    unexpectedError: 'Unerwarteter Fehler',
    unauthorizedError: {
        title: 'Unautorisierter Zugriff',
        content:
            'Sie haben keinen Zugriff auf diese AAS. Bitte loggen Sie sich ein oder fragen sie Ihren Administrator um Zugriff.',
    },
    settings: 'Einstellungen',
    idStructure: 'ID Struktur',
    idStructureExplanation:
        'Definieren Sie, wie Ihre IDs aussehen sollen. Dies ist eine Basis-Einstellung, die für individuelle Importe angepasst werden kann.',
    connections: {
        title: 'Datenquellen',
        subtitle: 'Definieren Sie, welche Datenquellen verwendet werden sollen.',
        resetSuccessfull: 'Quellen wurden zurückgesetzt.',
        urlFieldRequired: 'URL wird benötigt',
        addButton: 'Hinzufügen',
        editButton: 'Alle bearbeiten',
        saveButton: 'Alle speichern',
        resetButton: 'Auf Default zurücksetzen',
        aasRepository: {
            repositories: 'AAS Repositorys',
            repositoryLabel: 'AAS Repository',
            repositoryUrlLabel: 'AAS Repository URL',
            repositoryDefaultLabel: 'Default AAS Repository',
            connectionType: 'AAS_REPOSITORY',
        },
        submodelRepository: {
            repositories: 'Submodel Repositorys',
            repositoryLabel: 'Submodel Repository',
            repositoryUrlLabel: 'Submodel Repository URL',
            repositoryDefaultLabel: 'Default Submodel Repository',
            connectionType: 'SUBMODEL_REPOSITORY',
        },
    },
    submodels: 'Teilmodelle',
    nameplateAddressTypes: {
        office: 'Geschäftlich',
        'office mobile': 'Geschäftl. Mobil',
        secretary: 'Sekretariat',
        substitute: 'Vertretung',
        home: 'Privat',
        'home mobile': 'Privat Mobil',
        '0173-1#07-AAS754#001': 'Geschäftlich',
        '0173-1#07-AAS755#001': 'Geschäftlich Mobil',
        '0173-1#07-AAS756#001': 'Sekretariat',
        '0173-1#07-AAS757#001': 'Vertretung',
        '0173-1#07-AAS758#001': 'Privat',
        '0173-1#07-AAS759#001': 'Privat Mobil',
    },
    VAT: 'USt-IdNr.',
    showEntriesButton: {
        show: '{count} Einträge anzeigen',
        hide: 'Verbergen',
    },
    boolean: {
        true: 'Wahr',
        false: 'Falsch',
    },
    notAvailable: '-',
    staticPrefix: 'statisches Präfix',
    dynamicPart: 'dynamischer Teil',
    assetAdministrationShell: 'Verwaltungsschale',
    asset: 'Asset',
    errorMessages: {
        invalidIri: 'Muss eine valide IRI sein. Z.B. https://example.com/',
        invalidIriPart: 'Muss als Teil einer IRI funktionieren können (kein "/", Leer- und Sonderzeichen)',
        invalidDate: 'Muss ein gültiges Datum sein, im Format "yyyy-mm-dd"',
        invalidLong: 'Muss eine valide Zahl sein',
        influxError: 'Beim Abrufen der Daten ist ein Fehler aufgetreten.',
    },
    productCarbonFootprint: {
        totalCO2Equivalents: '(Bisherige) CO2 Emissionen des Produkts',
        completedStages: 'Emissionen berechnet basierend auf folgenden Lebenszyklusphasen',
        co2EDistribution: 'CO2e Verteilung',
        co2EComparison: 'Vergleich',
        beech: 'Buche',
        years: 'Jahre',
        months: 'Monate',
        comparisonAssumption: 'Unter der Annahme von 12,5 kg CO2e Speicherung pro Jahr.',
        productJourney: 'Produktreise',
        calculationMethod: 'Berechnungsmethode',
        lifecycleStages: {
            A1: 'A1 - raw material supply (and upstream production)',
            A2: 'A2 - cradle-to-gate transport to factory',
            A3: 'A3 - production',
            A4: 'A4 - transport to final destination',
            B1: 'B1 - usage phase',
            B2: 'B2 - maintenance',
            B3: 'B3 - repair',
            B5: 'B5 - update/upgrade, refurbishing',
            B6: 'B6 - usage energy consumption',
            B7: 'B7 - usage water consumption',
            C1: 'C1 - reassembly',
            C2: 'C2 - transport to recycler',
            C3: 'C3 - recycling, waste treatment',
            C4: 'C4 - landfill',
            D: 'D - reuse',
        },
    },
    referenceCounter: {
        count: 'Anzahl',
        elementName: 'Element',
    },
    successfullyUpdated: 'Erfolgreich aktualisiert',
    templates: 'Vorlagen',
    all: 'Alle',
    custom: 'Individuell',
    noTemplatesFound: 'Keine Vorlagen gefunden',
    templatesUseExplanation:
        'Vorlagen erlauben es Ihnen, eine wiederverwendbare Teilmodell-Struktur zu definieren, angepasst auf Ihre Bedürfnisse.',
    semanticId: 'semanticId',
    createNew: 'Neu erstellen',
    chooseAStartingPoint: 'Wählen Sie einen Ausgangspunkt',
    emptyCustom: 'Leer (Individuell)',
    emptyCustomDescription: 'Basiert auf keiner standardisierten Vorlage',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    deleteTemplateQuestion: 'Vorlage "{name}" unwiderruflich löschen?',
    duplicate: 'Duplizieren',
    cancel: 'Abbrechen',
    saveChanges: 'Änderungen speichern',
    noDataFound: 'Keine Daten gefunden',
    noDataFoundFor: 'Es wurden keine Daten für "{name}" gefunden.',
    toHome: 'Zur Startseite',
    authenticationNeeded: 'Authentifizierung erforderlich',
    templateDeletedSuccessfully: 'Vorlage erfolgreich gelöscht.',
    defaultValue: 'Vorgegebener Wert',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    value: 'Wert',
    revertChanges: 'Änderungen zurücksetzen',
    restore: 'Wiederherstellen',
    changesSavedSuccessfully: 'Änderungen erfolgreich gespeichert.',
    mnestix: 'Mnestix',
    displayName: 'Anzeigename',
    view: 'Ansehen',
    details: 'Details',
    text: 'Text',
    language: 'Sprache',
    redirectsTo: 'Leitet weiter auf',
    endResult: 'Endergebnis',
    imprint: 'Impressum',
    dataPrivacy: 'Datenschutz',
    assetIdDocumentation: {
        title: 'Wie Sie Ihre Asset ID mit Ihrem Repository verbinden',
        industry40Heading: 'Industrie 4.0 Kontext',
        industry40Text:
            'Produkte haben eine global einzigartige ID, welche einer oder mehreren Verwaltungschale(n) zugewiesen werden kann. Im Industrie 4.0 Kontext wird die Verbindung zwischen Asset und Verwaltungsschale über die I4.0 Infrastruktur hergestellt.',
        dnsHeading: 'Zugriff via DNS',
        dnsText:
            'Besonders beim "Brownfield"-Ansatz und als Vertreiber eines Produkts ist es sinnvoll, zusätzlich einen DNS-Zugang über die Asset ID einzurichten, um so einen Datenzugriff über einen herkömmlichen Browser zu ermöglichen.',
        exampleHeading: 'Beispiel',
    },
    documentDetails: 'Dokumentendetails',
    open: 'Öffnen',
    fileNotFound: 'Datei nicht gefunden',
    mappingInfo: 'Mapping-Info',
    mappingInfoDescription: 'Frei wählbarer Identifikator, auf den Sie bei Datenimporten zurückgreifen können.',
    multiplicity: 'Multiplicity',
    multiplicityDescription: 'Parameter, mit dem Sie festlegen können, welche Elemente verpflichtend sind.',
    deleted: 'gelöscht',
    compareButton: 'Vergleichen',
    transfer: {
        title: 'Import',
        subtitle:
            'Füllen sie die folgenden Schritte aus, um eine Verwaltungsschale in ein anderes Repository zu importieren',
        aasRepository: 'AAS Repository',
        submodelRepository: 'Submodel Repository',
        chooseRepository: 'AAS Repository auswählen',
        repositoryLabel: 'Liste der AAS Repositories',
        repositoryRequired: 'AAS Repository wird benötigt',
        repositoryApiKey: 'AAS Repository ApiKey',
        submodelRepositoryApiKey: 'Submodel Repository ApiKey',
        chooseSubmodelRepository: 'Submodel Repository auswählen (optional)',
        submodelRepositoryLabel: 'Liste der Submodel Repositories',
        useAasRepository: 'AAS Repository verwenden',
        successfullToast: 'Transfer der AAS erfolgreich',
        errorToast: 'Transfer der AAS nicht erfolgreich',
        partiallyFailedToast: 'Teil des Transfers fehlgeschlagen',
        warningToast: 'Transfer der AAS nur teilweise erfolgreich.',
    },
    discoveryList: {
        titleViewAASButton: 'VWS anzeigen',
        picture: 'Bild',
        header: 'Verwandte AAS für ID',
        aasIdHeading: 'AAS ID',
        repositoryUrl: 'Repository Url',
        subtitle: 'Hier finden Sie alle zugehörigen AAS für die angegebene ID.',
    },
};
