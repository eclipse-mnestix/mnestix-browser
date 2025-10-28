export enum DocumentSpecificSemanticId {
    DocumentVersion = 'https://admin-shell.io/vdi/2770/1/0/DocumentVersion',
    Title = 'https://admin-shell.io/vdi/2770/1/0/DocumentDescription/Title',
    OrganizationName = 'https://admin-shell.io/vdi/2770/1/0/Organization/OrganizationName',
    DigitalFile = 'https://admin-shell.io/vdi/2770/1/0/StoredDocumentRepresentation/DigitalFile',
    PreviewFile = 'https://admin-shell.io/vdi/2770/1/0/StoredDocumentRepresentation/PreviewFile',
    ClassId = 'https://admin-shell.io/vdi/2770/1/0/DocumentClassification/ClassId',
    ClassName = 'https://admin-shell.io/vdi/2770/1/0/DocumentClassification/ClassName',
    ClassificationSystem = 'https://admin-shell.io/vdi/2770/1/0/DocumentClassification/ClassificationSystem',
    DocumentClassification = 'https://admin-shell.io/vdi/2770/1/0/DocumentClassification',
}

/**
 * Handover Documentation V1.2
 */
export enum DocumentSpecificSemanticIdIrdi {
    DocumentVersion = '0173-1#02-ABI503#001/0173-1#01-AHF582#001',
    Title = '0173-1#02-AAO105#002',
    OrganizationName = '0173-1#02-ABI002#001',
    DigitalFile = '0173-1#02-ABI504#001/0173-1#01-AHF583#001',
    PreviewFile = '0173-1#02-ABI505#001/0173-1#01-AHF584#001',
    ClassId = '0173-1#02-ABH996#001',
    ClassName = '0173-1#02-AAO102#003',
    ClassificationSystem = '0173-1#02-ABH997#001',
    DocumentClassification = '0173-1#02-ABI502#001/0173-1#01-AHF581#001',
}

/**
 * Handover Documentation V2.0 (IDTA-02004-2-0)
 */
export enum DocumentSpecificSemanticIdIrdiV2 {
    // Main structure
    Documents = '0173-1#02-ABI500#003',
    Document = '0173-1#02-ABI500#003/0173-1#01-AHF579#003',
    DocumentIds = '0173-1#02-ABI501#003',
    DocumentClassifications = '0173-1#02-ABI502#003',
    DocumentClassification = '0173-1#02-ABI502#003/0173-1#01-AHF581#003',
    DocumentVersions = '0173-1#02-ABI503#003',
    DocumentVersion = '0173-1#02-ABI503#003/0173-1#01-AHF582#003',
    
    // DocumentVersion fields
    Languages = '0173-1#02-AAN468#008',
    Version = '0173-1#02-AAP003#005',
    Title = '0173-1#02-ABG940#003',
    Subtitle = '0173-1#02-ABH998#003',
    Description = '0173-1#02-AAN466#004',
    KeyWords = '0173-1#02-ABH999#003',
    StatusSetDate = '0173-1#02-ABI000#003',
    StatusValue = '0173-1#02-ABI001#003',
    OrganizationShortName = '0173-1#02-ABI002#003',
    OrganizationOfficialName = '0173-1#02-ABI004#003',
    
    // Files
    DigitalFiles = '0173-1#02-ABK126#002',
    DigitalFile = '0173-1#02-ABK126#002', // Same as DigitalFiles for backward compatibility
    PreviewFile = '0173-1#02-ABK127#002',
    
    // Classifications
    ClassId = '0173-1#02-ABH996#003',
    ClassName = '0173-1#02-ABJ219#002',
    ClassificationSystem = '0173-1#02-ABH997#003',
    
    // References
    RefersToEntities = '0173-1#02-ABK288#002',
    BasedOnReferences = '0173-1#02-ABK289#002',
    TranslationOfEntities = '0173-1#02-ABK290#002',
}
