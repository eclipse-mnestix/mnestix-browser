/**
 * @deprecated Please use t() of useTranslations(... instead as shown in TimeSeriesVisualizations.tsx
 */
export const enMnestix = {
    welcome: 'Welcome to Mnestix',
    digitalTwinMadeEasy: 'Digital Twin made easy.',
    notFound: 'Not found',
    aasUrlNotFound: 'No AAS with the given ID.',
    cannotLoadAasId: {
        header: 'AAS could not be loaded.',
        text: 'Unable to load AAS for the given ID "{id}"',
    },
    idShort: 'idShort: {idShort}',
    manufacturer: 'Manufacturer: {manufacturerName}',
    aasId: 'AAS ID',
    assetId: 'Asset ID',
    orEnterManual: 'or enter manually',
    orSelectFromList: 'or select via list',
    goToListButton: 'Go to Aas List',
    scanAasId: 'Scan AAS ID or Asset ID',
    unexpectedError: 'Unexpected error',
    unauthorizedError: {
        title: 'Unauthorized access',
        content: 'You don`t have access to this AAS. You may login or contact your administrator to get access.',
    },
    settings: 'Settings',
    idStructure: 'ID structure',
    idStructureExplanation:
        'Define, how your IDs are represented. This is a standard setting that can be adjusted for individual imports.',
    connections: {
        title: 'Data sources',
        subtitle: 'Define which data connections should be used.',
        addButton: 'Add more',
        editButton: 'Edit all',
        saveButton: 'Save all',
        resetButton: 'Reset to default',
        resetSuccessfull: 'Connections were reset.',
        urlFieldRequired: 'URL field is required',
        aasRepository: {
            repositories: 'AAS Repositories',
            repositoryLabel: 'AAS Repository',
            repositoryUrlLabel: 'AAS Repository URL',
            repositoryDefaultLabel: 'Default AAS Repository',
        },
        submodelRepository: {
            repositories: 'Submodel Repositories',
            repositoryLabel: 'Submodel Repository',
            repositoryUrlLabel: 'Submodel Repository URL',
            repositoryDefaultLabel: 'Default Submodel Repository',
        },
    },
    submodels: 'Submodels',
    nameplateAddressTypes: {
        office: 'Office',
        'office mobile': 'Office mobile',
        secretary: 'Secretary',
        substitute: 'Substitute',
        home: 'Home',
        'home mobile': 'Home mobile',
        '0173-1#07-AAS754#001': 'Office',
        '0173-1#07-AAS755#001': 'Office mobile',
        '0173-1#07-AAS756#001': 'Secretary',
        '0173-1#07-AAS757#001': 'Substitute',
        '0173-1#07-AAS758#001': 'Home',
        '0173-1#07-AAS759#001': 'Private mobile',
    },
    VAT: 'VAT-Number',
    showEntriesButton: {
        show: 'Show {count} entries',
        hide: 'Hide',
    },
    boolean: {
        true: 'true',
        false: 'false',
    },
    notAvailable: '-',
    staticPrefix: 'static prefix',
    dynamicPart: 'dynamic part',
    assetAdministrationShell: 'Asset Administration Shell',
    asset: 'Asset',
    errorMessages: {
        invalidIri: 'Has to be a valid IRI, e.g. https://example.com/',
        invalidIriPart: 'Has to work as part of an IRI (no "/", spaces or special characters)',
        invalidDate: 'Has to be a valid date in format "yyyy-mm-dd"',
        invalidLong: 'Has to be a valid long',
        influxError: 'There was a problem retrieving the time series data.',
    },
    productCarbonFootprint: {
        totalCO2Equivalents: 'CO2 emissions from product (so far)',
        completedStages: 'Emissions calculated based on product life cycle',
        co2EDistribution: 'CO2e distribution',
        co2EComparison: 'Comparison',
        beech: 'Beech Tree',
        years: 'Years',
        months: 'Months',
        comparisonAssumption: 'Assuming one beech tree stores 12.5 kg CO2e per year.',
        productJourney: 'Product Journey',
        calculationMethod: 'Calculation Method',
        lifecycleStages: {
            A1: 'A1 - raw material supply (and upstream production)',
            A2: 'A2 - cradle-to-gate transport to factory',
            A3: 'A3 - production',
            'A1-A3': 'A1-A3 - Raw material supply to production',
            A4: 'A4 - transport to final destination',
            'A4-A5': 'A4-A5 - Transport to assembly',
            A5: 'A5 - installation',
            B1: 'B1 - usage phase',
            B2: 'B2 - maintenance',
            B3: 'B3 - repair',
            B4: 'B4 - replacement',
            B5: 'B5 - update/upgrade, refurbishing',
            B6: 'B6 - usage energy consumption',
            B7: 'B7 - usage water consumption',
            'B1-B7': 'B1-B7 - Usage phase',
            C1: 'C1 - reassembly',
            C2: 'C2 - transport to recycler',
            C3: 'C3 - recycling, waste treatment',
            C4: 'C4 - landfill',
            'C1-C4': 'C1-C4 - Disposal phase',
            'C2-C4': 'C2-C4 - Recycling to landfill',
            D: 'D - reuse',
        },
    },
    referenceCounter: {
        count: 'Count',
        elementName: 'Element',
    },
    successfullyUpdated: 'Updated successfully',
    templates: 'Templates',
    all: 'All',
    custom: 'Custom',
    noTemplatesFound: 'No templates found',
    templatesUseExplanation:
        'Templates allow you to create a reusable submodel structure, adjusted to your requirements.',
    semanticId: 'semanticId',
    createNew: 'Create New',
    chooseAStartingPoint: 'Choose a starting point',
    emptyCustom: 'Empty (Custom)',
    emptyCustomDescription: 'Is not based upon a standardized template',
    edit: 'Edit',
    delete: 'Delete',
    deleteTemplateQuestion: 'Delete template "{name}" irretrievably?',
    cancel: 'Cancel',
    duplicate: 'Duplicate',
    saveChanges: 'Save changes',
    noDataFound: 'No Data found',
    noDataFoundFor: 'No data found for "{name}".',
    toHome: 'To Home',
    authenticationNeeded: 'Authentication needed',
    templateDeletedSuccessfully: 'Template deleted successfully.',
    defaultValue: 'Default value',
    add: 'Add',
    remove: 'Remove',
    value: 'Value',
    revertChanges: 'Revert changes',
    restore: 'Restore',
    changesSavedSuccessfully: 'Changes saved successfully.',
    mnestix: 'Mnestix',
    displayName: 'Display name',
    view: 'View',
    details: 'Details',
    text: 'Text',
    language: 'Language',
    redirectsTo: 'Redirects to',
    endResult: 'End result',
    assetIdDocumentation: {
        title: 'How to connect your Asset ID with your AAS Repository',
        industry40Heading: 'Industry 4.0 context',
        industry40Text:
            'Products have a globally unique ID which can be assigned to one or more asset administration shells. In the Industry 4.0 context, the connection between asset and AAS is established via the I4.0 infrastructure.',
        dnsHeading: 'Access via DNS',
        dnsText:
            'Especially for the brownfield approach and the distributor of a product, it makes sense to additionally set up DNS access through the asset ID and thus enable data retrieval from conventional browser applications.',
        exampleHeading: 'Example Case',
    },
    documentDetails: 'Document details',
    open: 'Open',
    fileNotFound: 'File not found',
    mappingInfo: 'Mapping info',
    mappingInfoDescription: 'Arbitrary identifier that you can use for your data imports.',
    multiplicity: 'Multiplicity',
    multiplicityDescription: 'A qualifier used to identify obligatory elements.',
    deleted: 'deleted',
    compareButton: 'Compare',
    transfer: {
        title: 'Import',
        subtitle: 'To import this AAS to another repository, fill out the following steps.',
        aasRepository: 'AAS Repository',
        submodelRepository: 'Submodel Repository',
        chooseRepository: 'Choose AAS Repository',
        repositoryRequired: 'AAS Repository is required',
        repositoryLabel: 'List of AAS Repositories',
        repositoryApiKey: 'AAS Repository ApiKey',
        submodelRepositoryApiKey: 'Submodel Repository ApiKey',
        chooseSubmodelRepository: 'Choose Submodel Repository (optional)',
        submodelRepositoryLabel: 'List of Submodel Repositories',
        useAasRepository: 'Use AAS Repository',
        successfullToast: 'Transfer of AAS successful',
        errorToast: 'Transfer of AAS not successful',
        partiallyFailedToast: 'Failed to transfer element',
        warningToast: 'AAS was only partially transferred.',
    },
    discoveryList: {
        titleViewAASButton: 'View AAS',
        picture: 'Picture',
        header: 'Related AAS to ID',
        aasIdHeading: 'AAS ID',
        repositoryUrl: 'Repository Url',
        subtitle: 'Here you will find all related AAS to the given ID.',
    },
};
