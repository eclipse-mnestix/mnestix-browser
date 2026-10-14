/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const AasSubmodelElements = {
    AnnotatedRelationshipElement: 'AnnotatedRelationshipElement',
    BasicEventElement: 'BasicEventElement',
    Blob: 'Blob',
    Capability: 'Capability',
    DataElement: 'DataElement',
    Entity: 'Entity',
    EventElement: 'EventElement',
    File: 'File',
    MultiLanguageProperty: 'MultiLanguageProperty',
    Operation: 'Operation',
    Property: 'Property',
    Range: 'Range',
    ReferenceElement: 'ReferenceElement',
    RelationshipElement: 'RelationshipElement',
    SubmodelElement: 'SubmodelElement',
    SubmodelElementCollection: 'SubmodelElementCollection',
    SubmodelElementList: 'SubmodelElementList',
} as const;
export type AasSubmodelElements = (typeof AasSubmodelElements)[keyof typeof AasSubmodelElements];

/**
 *
 * @export
 * @interface AbstractLangString
 */
export interface AbstractLangString {
    /**
     *
     * @type {string}
     * @memberof AbstractLangString
     */
    language: string;
    /**
     *
     * @type {string}
     * @memberof AbstractLangString
     */
    text: string;
}
/**
 *
 * @export
 * @interface AdministrativeInformation
 */
export interface AdministrativeInformation {
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof AdministrativeInformation
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {AdministrativeInformationAllOfVersion}
     * @memberof AdministrativeInformation
     */
    version?: AdministrativeInformationAllOfVersion;
    /**
     *
     * @type {AdministrativeInformationAllOfRevision}
     * @memberof AdministrativeInformation
     */
    revision?: AdministrativeInformationAllOfRevision;
    /**
     *
     * @type {Reference}
     * @memberof AdministrativeInformation
     */
    creator?: Reference;
    /**
     *
     * @type {string}
     * @memberof AdministrativeInformation
     */
    createdAt?: string;
    /**
     *
     * @type {string}
     * @memberof AdministrativeInformation
     */
    updatedAt?: string;
    /**
     *
     * @type {string}
     * @memberof AdministrativeInformation
     */
    templateId?: string;
}
/**
 *
 * @export
 * @interface AdministrativeInformationAllOfRevision
 */
export type AdministrativeInformationAllOfRevision = string;
/**
 *
 * @export
 * @interface AdministrativeInformationAllOfVersion
 */
export type AdministrativeInformationAllOfVersion = string;
/**
 *
 * @export
 * @interface AnnotatedRelationshipElement
 */
export interface AnnotatedRelationshipElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof AnnotatedRelationshipElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof AnnotatedRelationshipElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof AnnotatedRelationshipElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof AnnotatedRelationshipElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof AnnotatedRelationshipElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof AnnotatedRelationshipElement
     */
    modelType: 'AnnotatedRelationshipElement';
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof AnnotatedRelationshipElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof AnnotatedRelationshipElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof AnnotatedRelationshipElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElement
     */
    first?: Reference;
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElement
     */
    second?: Reference;
    /**
     *
     * @type {Array<DataElementChoice>}
     * @memberof AnnotatedRelationshipElement
     */
    annotations?: Array<DataElementChoice>;
}
/**
 *
 * @export
 * @interface AnnotatedRelationshipElementValue
 */
export interface AnnotatedRelationshipElementValue {
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElementValue
     */
    first?: Reference;
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElementValue
     */
    second?: Reference;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof AnnotatedRelationshipElementValue
     */
    annotations?: object;
}
/**
 *
 * @export
 * @interface AssetAdministrationShell
 */
export interface AssetAdministrationShell {
    /**
     *
     * @type {Array<Extension>}
     * @memberof AssetAdministrationShell
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShell
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof AssetAdministrationShell
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof AssetAdministrationShell
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof AssetAdministrationShell
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof AssetAdministrationShell
     */
    modelType: 'AssetAdministrationShell';
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof AssetAdministrationShell
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShell
     */
    id: string;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof AssetAdministrationShell
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof AssetAdministrationShell
     */
    derivedFrom?: Reference;
    /**
     *
     * @type {AssetInformation}
     * @memberof AssetAdministrationShell
     */
    assetInformation: AssetInformation;
    /**
     *
     * @type {Array<Reference>}
     * @memberof AssetAdministrationShell
     */
    submodels?: Array<Reference>;
}
/**
 *
 * @export
 * @interface AssetAdministrationShellDescriptor
 */
export interface AssetAdministrationShellDescriptor {
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof AssetAdministrationShellDescriptor
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof AssetAdministrationShellDescriptor
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<Extension>}
     * @memberof AssetAdministrationShellDescriptor
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof AssetAdministrationShellDescriptor
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {AssetKind}
     * @memberof AssetAdministrationShellDescriptor
     */
    assetKind?: AssetKind;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellDescriptor
     */
    assetType?: string;
    /**
     *
     * @type {Array<Endpoint>}
     * @memberof AssetAdministrationShellDescriptor
     */
    endpoints?: Array<Endpoint>;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellDescriptor
     */
    globalAssetId?: string;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellDescriptor
     */
    idShort?: string;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellDescriptor
     */
    id: string;
    /**
     *
     * @type {Array<SpecificAssetId>}
     * @memberof AssetAdministrationShellDescriptor
     */
    specificAssetIds?: Array<SpecificAssetId>;
    /**
     *
     * @type {Array<SubmodelDescriptor>}
     * @memberof AssetAdministrationShellDescriptor
     */
    submodelDescriptors?: Array<SubmodelDescriptor>;
}

/**
 *
 * @export
 * @interface AssetAdministrationShellRecentChange
 */
export interface AssetAdministrationShellRecentChange {
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellRecentChange
     */
    createdAt: string;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellRecentChange
     */
    updatedAt: string;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellRecentChange
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof AssetAdministrationShellRecentChange
     */
    globalAssetId?: string;
    /**
     *
     * @type {Array<SpecificAssetId>}
     * @memberof AssetAdministrationShellRecentChange
     */
    specificAssetIds?: Array<SpecificAssetId>;
}
/**
 *
 * @export
 * @interface AssetInformation
 */
export interface AssetInformation {
    /**
     *
     * @type {AssetKind}
     * @memberof AssetInformation
     */
    assetKind: AssetKind;
    /**
     *
     * @type {string}
     * @memberof AssetInformation
     */
    globalAssetId?: string;
    /**
     *
     * @type {Array<SpecificAssetId>}
     * @memberof AssetInformation
     */
    specificAssetIds?: Array<SpecificAssetId>;
    /**
     *
     * @type {string}
     * @memberof AssetInformation
     */
    assetType?: string;
    /**
     *
     * @type {Resource}
     * @memberof AssetInformation
     */
    defaultThumbnail?: Resource;
}

/**
 *
 * @export
 */
export const AssetKind = {
    Batch: 'Batch',
    Instance: 'Instance',
    NotApplicable: 'NotApplicable',
    Role: 'Role',
    Type: 'Type',
} as const;
export type AssetKind = (typeof AssetKind)[keyof typeof AssetKind];

/**
 *
 * @export
 * @interface AssetLink
 */
export interface AssetLink {
    /**
     *
     * @type {string}
     * @memberof AssetLink
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof AssetLink
     */
    value: string;
}
/**
 *
 * @export
 * @interface AttributeItem
 */
export interface AttributeItem {
    /**
     *
     * @type {string}
     * @memberof AttributeItem
     */
    CLAIM?: string;
    /**
     *
     * @type {string}
     * @memberof AttributeItem
     */
    GLOBAL?: AttributeItemGLOBALEnum;
    /**
     *
     * @type {string}
     * @memberof AttributeItem
     */
    REFERENCE?: string;
}

/**
 * @export
 */
export const AttributeItemGLOBALEnum = {
    Localnow: 'LOCALNOW',
    Utcnow: 'UTCNOW',
    Clientnow: 'CLIENTNOW',
    Anonymous: 'ANONYMOUS',
} as const;
export type AttributeItemGLOBALEnum = (typeof AttributeItemGLOBALEnum)[keyof typeof AttributeItemGLOBALEnum];

/**
 *
 * @export
 * @interface BaseOperationResult
 */
export interface BaseOperationResult {
    /**
     *
     * @type {Array<Message>}
     * @memberof BaseOperationResult
     */
    messages?: Array<Message>;
    /**
     *
     * @type {ExecutionState}
     * @memberof BaseOperationResult
     */
    executionState?: ExecutionState;
    /**
     *
     * @type {boolean}
     * @memberof BaseOperationResult
     */
    success?: boolean;
}

/**
 *
 * @export
 * @interface BasicEventElement
 */
export interface BasicEventElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof BasicEventElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof BasicEventElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof BasicEventElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof BasicEventElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof BasicEventElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof BasicEventElement
     */
    modelType: 'BasicEventElement';
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof BasicEventElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof BasicEventElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof BasicEventElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElement
     */
    observed: Reference;
    /**
     *
     * @type {Direction}
     * @memberof BasicEventElement
     */
    direction: Direction;
    /**
     *
     * @type {StateOfEvent}
     * @memberof BasicEventElement
     */
    state: StateOfEvent;
    /**
     *
     * @type {string}
     * @memberof BasicEventElement
     */
    messageTopic?: string;
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElement
     */
    messageBroker?: Reference;
    /**
     *
     * @type {string}
     * @memberof BasicEventElement
     */
    lastUpdate?: string;
    /**
     *
     * @type {string}
     * @memberof BasicEventElement
     */
    minInterval?: string;
    /**
     *
     * @type {string}
     * @memberof BasicEventElement
     */
    maxInterval?: string;
}

/**
 *
 * @export
 * @interface BasicEventElementMetadata
 */
export interface BasicEventElementMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof BasicEventElementMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof BasicEventElementMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof BasicEventElementMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof BasicEventElementMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof BasicEventElementMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof BasicEventElementMetadata
     */
    modelType: 'BasicEventElement';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof BasicEventElementMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElementMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof BasicEventElementMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof BasicEventElementMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof BasicEventElementMetadata
     */
    kind?: ModellingKind;
    /**
     *
     * @type {Direction}
     * @memberof BasicEventElementMetadata
     */
    direction?: Direction;
    /**
     *
     * @type {StateOfEvent}
     * @memberof BasicEventElementMetadata
     */
    state?: StateOfEvent;
    /**
     *
     * @type {string}
     * @memberof BasicEventElementMetadata
     */
    messageTopic?: string;
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElementMetadata
     */
    messageBroker?: Reference;
    /**
     *
     * @type {string}
     * @memberof BasicEventElementMetadata
     */
    lastUpdate?: string;
    /**
     *
     * @type {string}
     * @memberof BasicEventElementMetadata
     */
    minInterval?: string;
    /**
     *
     * @type {string}
     * @memberof BasicEventElementMetadata
     */
    maxInterval?: string;
}

/**
 *
 * @export
 * @interface BasicEventElementValue
 */
export interface BasicEventElementValue {
    /**
     *
     * @type {Reference}
     * @memberof BasicEventElementValue
     */
    observed: Reference;
}
/**
 *
 * @export
 * @interface Blob
 */
export interface Blob {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Blob
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Blob
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Blob
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Blob
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Blob
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Blob
     */
    modelType: 'Blob';
    /**
     *
     * @type {Reference}
     * @memberof Blob
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Blob
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Blob
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Blob
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {string}
     * @memberof Blob
     */
    value?: string;
    /**
     *
     * @type {BlobAllOfContentType}
     * @memberof Blob
     */
    contentType?: BlobAllOfContentType;
}
/**
 *
 * @export
 * @interface BlobAllOfContentType
 */
export type BlobAllOfContentType = string;
/**
 *
 * @export
 * @interface BlobValue
 */
export interface BlobValue {
    /**
     *
     * @type {string}
     * @memberof BlobValue
     */
    contentType?: string;
    /**
     *
     * @type {string}
     * @memberof BlobValue
     */
    value?: string;
}
/**
 * @type BoolComparisonItemsInner
 *
 * @export
 */
export type BoolComparisonItemsInner = BoolOperand | FieldOperand;
/**
 * Exactly two `boolOperand`/`fieldOperand` operands, per the AASQL `boolComparisonItems` schema.
 * @type BoolComparisonItems
 * @export
 */
export type BoolComparisonItems = [BoolComparisonItemsInner, BoolComparisonItemsInner];
/**
 *
 * @export
 * @interface BoolOperand
 */
export interface BoolOperand {
    /**
     *
     * @type {boolean}
     * @memberof BoolOperand
     */
    $boolean?: boolean;
    /**
     *
     * @type {Value}
     * @memberof BoolOperand
     */
    $boolCast?: Value | null;
}
/**
 *
 * @export
 * @interface Capability
 */
export interface Capability {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Capability
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Capability
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Capability
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Capability
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Capability
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Capability
     */
    modelType: 'Capability';
    /**
     *
     * @type {Reference}
     * @memberof Capability
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Capability
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Capability
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Capability
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
}
/**
 *
 * @export
 * @interface CapabilityMetadata
 */
export interface CapabilityMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof CapabilityMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof CapabilityMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof CapabilityMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof CapabilityMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof CapabilityMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof CapabilityMetadata
     */
    modelType: 'Capability';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof CapabilityMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof CapabilityMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof CapabilityMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof CapabilityMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof CapabilityMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface ConceptDescription
 */
export interface ConceptDescription {
    /**
     *
     * @type {Array<Extension>}
     * @memberof ConceptDescription
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof ConceptDescription
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof ConceptDescription
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof ConceptDescription
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof ConceptDescription
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof ConceptDescription
     */
    modelType: 'ConceptDescription';
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof ConceptDescription
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {string}
     * @memberof ConceptDescription
     */
    id: string;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof ConceptDescription
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<Reference>}
     * @memberof ConceptDescription
     */
    isCaseOf?: Array<Reference>;
}
/**
 *
 * @export
 * @interface ConceptDescriptionRecentChange
 */
export interface ConceptDescriptionRecentChange {
    /**
     *
     * @type {string}
     * @memberof ConceptDescriptionRecentChange
     */
    createdAt: string;
    /**
     *
     * @type {string}
     * @memberof ConceptDescriptionRecentChange
     */
    updatedAt: string;
    /**
     *
     * @type {string}
     * @memberof ConceptDescriptionRecentChange
     */
    id: string;
}
/**
 * @type DataElementChoice
 *
 * @export
 */
export type DataElementChoice = Blob | ModelFile | MultiLanguageProperty | Property | Range | ReferenceElement;
/**
 *
 * @export
 * @interface DataSpecificationContent
 */
export interface DataSpecificationContent {
    /**
     *
     * @type {ModelType}
     * @memberof DataSpecificationContent
     */
    modelType: ModelType;
}

/**
 * @type DataSpecificationContentChoice
 *
 * @export
 */
export type DataSpecificationContentChoice = DataSpecificationIec61360 | DataSpecificationUom;
/**
 *
 * @export
 * @interface DataSpecificationIec61360
 */
export interface DataSpecificationIec61360 {
    /**
     *
     * @type {any}
     * @memberof DataSpecificationIec61360
     */
    modelType: any | null;
    /**
     *
     * @type {Array<LangStringPreferredNameTypeIec61360>}
     * @memberof DataSpecificationIec61360
     */
    preferredName: Array<LangStringPreferredNameTypeIec61360>;
    /**
     *
     * @type {Array<LangStringShortNameTypeIec61360>}
     * @memberof DataSpecificationIec61360
     */
    shortName?: Array<LangStringShortNameTypeIec61360>;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    unit?: string;
    /**
     *
     * @type {Reference}
     * @memberof DataSpecificationIec61360
     */
    unitId?: Reference;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    sourceOfDefinition?: string;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    symbol?: string;
    /**
     *
     * @type {DataTypeIec61360}
     * @memberof DataSpecificationIec61360
     */
    dataType?: DataTypeIec61360;
    /**
     *
     * @type {Array<LangStringDefinitionTypeIec61360>}
     * @memberof DataSpecificationIec61360
     */
    definition?: Array<LangStringDefinitionTypeIec61360>;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    valueFormat?: string;
    /**
     *
     * @type {ValueList}
     * @memberof DataSpecificationIec61360
     */
    valueList?: ValueList;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    value?: string;
    /**
     *
     * @type {LevelType}
     * @memberof DataSpecificationIec61360
     */
    levelType?: LevelType;
}

/**
 *
 * @export
 * @interface DataSpecificationUom
 */
export interface DataSpecificationUom {
    /**
     *
     * @type {any}
     * @memberof DataSpecificationUom
     */
    modelType: any | null;
    /**
     *
     * @type {Array<LangStringUom>}
     * @memberof DataSpecificationUom
     */
    preferredName: Array<LangStringUom>;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationUom
     */
    symbol: string;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationUom
     */
    specificUnitId?: string;
    /**
     *
     * @type {Array<LangStringDefinitionTypeUom>}
     * @memberof DataSpecificationUom
     */
    definition?: Array<LangStringDefinitionTypeUom>;
    /**
     *
     * @type {Array<LangStringUom>}
     * @memberof DataSpecificationUom
     */
    preferredNameQuantity?: Array<LangStringUom>;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationUom
     */
    quantityId?: string;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationUom
     */
    classificationSystem?: string;
    /**
     *
     * @type {string}
     * @memberof DataSpecificationUom
     */
    classificationSystemVersion?: string;
}

/**
 *
 * @export
 */
export const DataTypeDefXsd = {
    XsAnyUri: 'xs:anyURI',
    XsBase64Binary: 'xs:base64Binary',
    XsBoolean: 'xs:boolean',
    XsByte: 'xs:byte',
    XsDate: 'xs:date',
    XsDateTime: 'xs:dateTime',
    XsDecimal: 'xs:decimal',
    XsDouble: 'xs:double',
    XsDuration: 'xs:duration',
    XsFloat: 'xs:float',
    XsGDay: 'xs:gDay',
    XsGMonth: 'xs:gMonth',
    XsGMonthDay: 'xs:gMonthDay',
    XsGYear: 'xs:gYear',
    XsGYearMonth: 'xs:gYearMonth',
    XsHexBinary: 'xs:hexBinary',
    XsInt: 'xs:int',
    XsInteger: 'xs:integer',
    XsLong: 'xs:long',
    XsNegativeInteger: 'xs:negativeInteger',
    XsNonNegativeInteger: 'xs:nonNegativeInteger',
    XsNonPositiveInteger: 'xs:nonPositiveInteger',
    XsPositiveInteger: 'xs:positiveInteger',
    XsShort: 'xs:short',
    XsString: 'xs:string',
    XsTime: 'xs:time',
    XsUnsignedByte: 'xs:unsignedByte',
    XsUnsignedInt: 'xs:unsignedInt',
    XsUnsignedLong: 'xs:unsignedLong',
    XsUnsignedShort: 'xs:unsignedShort',
} as const;
export type DataTypeDefXsd = (typeof DataTypeDefXsd)[keyof typeof DataTypeDefXsd];

/**
 *
 * @export
 */
export const DataTypeIec61360 = {
    Blob: 'BLOB',
    Boolean: 'BOOLEAN',
    Date: 'DATE',
    File: 'FILE',
    Html: 'HTML',
    IntegerCount: 'INTEGER_COUNT',
    IntegerCurrency: 'INTEGER_CURRENCY',
    IntegerMeasure: 'INTEGER_MEASURE',
    Irdi: 'IRDI',
    Iri: 'IRI',
    Rational: 'RATIONAL',
    RationalMeasure: 'RATIONAL_MEASURE',
    RealCount: 'REAL_COUNT',
    RealCurrency: 'REAL_CURRENCY',
    RealMeasure: 'REAL_MEASURE',
    String: 'STRING',
    StringTranslatable: 'STRING_TRANSLATABLE',
    Time: 'TIME',
    Timestamp: 'TIMESTAMP',
} as const;
export type DataTypeIec61360 = (typeof DataTypeIec61360)[keyof typeof DataTypeIec61360];

/**
 *
 * @export
 * @interface DateTimeAttributeItem
 */
export interface DateTimeAttributeItem {
    /**
     *
     * @type {string}
     * @memberof DateTimeAttributeItem
     */
    GLOBAL: DateTimeAttributeItemGLOBALEnum;
}

/**
 * @export
 */
export const DateTimeAttributeItemGLOBALEnum = {
    Localnow: 'LOCALNOW',
    Utcnow: 'UTCNOW',
    Clientnow: 'CLIENTNOW',
} as const;
export type DateTimeAttributeItemGLOBALEnum =
    (typeof DateTimeAttributeItemGLOBALEnum)[keyof typeof DateTimeAttributeItemGLOBALEnum];

/**
 * @type DateTimeComparisonItemsInner
 *
 * @export
 */
export type DateTimeComparisonItemsInner = DateTimeOperand | FieldOperand;
/**
 * Exactly two `dateTimeOperand`/`fieldOperand` operands, per the AASQL `dateTimeComparisonItems`
 * schema.
 * @type DateTimeComparisonItems
 * @export
 */
export type DateTimeComparisonItems = [DateTimeComparisonItemsInner, DateTimeComparisonItemsInner];
/**
 *
 * @export
 * @interface DateTimeOperand
 */
export interface DateTimeOperand {
    /**
     *
     * @type {string}
     * @memberof DateTimeOperand
     */
    $dateTimeVal?: string;
    /**
     *
     * @type {string}
     * @memberof DateTimeOperand
     */
    $dateTimeCast?: string;
    /**
     *
     * @type {DateTimeAttributeItem}
     * @memberof DateTimeOperand
     */
    $attribute?: DateTimeAttributeItem;
}
/**
 *
 * @export
 * @interface Descriptor
 */
export interface Descriptor {
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Descriptor
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Descriptor
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<Extension>}
     * @memberof Descriptor
     */
    extensions?: Array<Extension>;
}

/**
 *
 * @export
 */
export const Direction = {
    Input: 'input',
    Output: 'output',
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

/**
 *
 * @export
 * @interface EmbeddedDataSpecification
 */
export interface EmbeddedDataSpecification {
    /**
     *
     * @type {Reference}
     * @memberof EmbeddedDataSpecification
     */
    dataSpecification: Reference;
    /**
     *
     * @type {DataSpecificationContentChoice}
     * @memberof EmbeddedDataSpecification
     */
    dataSpecificationContent: DataSpecificationContentChoice;
}
/**
 *
 * @export
 * @interface Endpoint
 */
export interface Endpoint {
    /**
     *
     * @type {string}
     * @memberof Endpoint
     */
    _interface: string;
    /**
     *
     * @type {ProtocolInformation}
     * @memberof Endpoint
     */
    protocolInformation: ProtocolInformation;
}
/**
 *
 * @export
 * @interface Entity
 */
export interface Entity {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Entity
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Entity
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Entity
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Entity
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Entity
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Entity
     */
    modelType: 'Entity';
    /**
     *
     * @type {Reference}
     * @memberof Entity
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Entity
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Entity
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Entity
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<SubmodelElementChoice>}
     * @memberof Entity
     */
    statements?: Array<SubmodelElementChoice>;
    /**
     *
     * @type {EntityType}
     * @memberof Entity
     */
    entityType?: EntityType;
    /**
     *
     * @type {string}
     * @memberof Entity
     */
    globalAssetId?: string;
    /**
     *
     * @type {Array<SpecificAssetId>}
     * @memberof Entity
     */
    specificAssetIds?: Array<SpecificAssetId>;
}

/**
 *
 * @export
 * @interface EntityMetadata
 */
export interface EntityMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof EntityMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof EntityMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof EntityMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof EntityMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof EntityMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof EntityMetadata
     */
    modelType: 'Entity';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof EntityMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof EntityMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof EntityMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof EntityMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof EntityMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 */
export const EntityType = {
    CoManagedEntity: 'CoManagedEntity',
    SelfManagedEntity: 'SelfManagedEntity',
} as const;
export type EntityType = (typeof EntityType)[keyof typeof EntityType];

/**
 *
 * @export
 * @interface EntityValue
 */
export interface EntityValue {
    /**
     *
     * @type {EntityType}
     * @memberof EntityValue
     */
    entityType?: EntityType;
    /**
     *
     * @type {string}
     * @memberof EntityValue
     */
    globalAssetId?: string;
    /**
     *
     * @type {Array<object>}
     * @memberof EntityValue
     */
    specificAssetIds?: Array<object>;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof EntityValue
     */
    statements?: object;
}

/**
 *
 * @export
 * @interface Environment
 */
export interface Environment {
    /**
     *
     * @type {Array<AssetAdministrationShell>}
     * @memberof Environment
     */
    assetAdministrationShells?: Array<AssetAdministrationShell>;
    /**
     *
     * @type {Array<Submodel>}
     * @memberof Environment
     */
    submodels?: Array<Submodel>;
    /**
     *
     * @type {Array<ConceptDescription>}
     * @memberof Environment
     */
    conceptDescriptions?: Array<ConceptDescription>;
}
/**
 * A union of the comparison-item tuple types usable with $eq/$ne, per the AASQL
 * `equalityComparisonItems` schema (anyOf stringItems | numericalComparisonItems |
 * hexComparisonItems | boolComparisonItems | dateTimeComparisonItems | timeComparisonItems).
 * @type EqualityComparisonItems
 * @export
 */
export type EqualityComparisonItems =
    | StringItems
    | NumericalComparisonItems
    | HexComparisonItems
    | BoolComparisonItems
    | DateTimeComparisonItems
    | TimeComparisonItems;

/**
 *
 * @export
 */
export const ExecutionState = {
    Initiated: 'Initiated',
    Running: 'Running',
    Completed: 'Completed',
    Canceled: 'Canceled',
    Failed: 'Failed',
    Timeout: 'Timeout',
} as const;
export type ExecutionState = (typeof ExecutionState)[keyof typeof ExecutionState];

/**
 *
 * @export
 * @interface Extension
 */
export interface Extension {
    /**
     *
     * @type {Reference}
     * @memberof Extension
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Extension
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {string}
     * @memberof Extension
     */
    name: string;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof Extension
     */
    valueType?: DataTypeDefXsd;
    /**
     *
     * @type {string}
     * @memberof Extension
     */
    value?: string;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Extension
     */
    refersTo?: Array<Reference>;
}

/**
 *
 * @export
 * @interface FieldOperand
 */
export interface FieldOperand {
    /**
     *
     * @type {string}
     * @memberof FieldOperand
     */
    $field: string;
}
/**
 *
 * @export
 * @interface FileAllOfContentType
 */
export type FileAllOfContentType = string;
/**
 *
 * @export
 * @interface FileAllOfValue
 */
export type FileAllOfValue = string;
/**
 *
 * @export
 * @interface FileMetadata
 */
export interface FileMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof FileMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof FileMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof FileMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof FileMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof FileMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof FileMetadata
     */
    modelType: 'File';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof FileMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof FileMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof FileMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof FileMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof FileMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface FileValue
 */
export interface FileValue {
    /**
     *
     * @type {string}
     * @memberof FileValue
     */
    contentType?: string;
    /**
     *
     * @type {string}
     * @memberof FileValue
     */
    value?: string;
}
/**
 *
 * @export
 * @interface GetAllAssetAdministrationShellIdsByAssetLink200Response
 */
export interface GetAllAssetAdministrationShellIdsByAssetLink200Response {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAllAssetAdministrationShellIdsByAssetLink200Response
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<string>}
     * @memberof GetAllAssetAdministrationShellIdsByAssetLink200Response
     */
    result?: Array<string>;
}
/**
 *
 * @export
 * @interface GetAllAssetAdministrationShellsRecentChangesResult
 */
export interface GetAllAssetAdministrationShellsRecentChangesResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAllAssetAdministrationShellsRecentChangesResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<AssetAdministrationShellRecentChange>}
     * @memberof GetAllAssetAdministrationShellsRecentChangesResult
     */
    result?: Array<AssetAdministrationShellRecentChange>;
}
/**
 *
 * @export
 * @interface GetAllConceptDescriptionsRecentChangesResult
 */
export interface GetAllConceptDescriptionsRecentChangesResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAllConceptDescriptionsRecentChangesResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<ConceptDescriptionRecentChange>}
     * @memberof GetAllConceptDescriptionsRecentChangesResult
     */
    result?: Array<ConceptDescriptionRecentChange>;
}
/**
 *
 * @export
 * @interface GetAllSubmodelsRecentChangesResult
 */
export interface GetAllSubmodelsRecentChangesResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAllSubmodelsRecentChangesResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<SubmodelRecentChange>}
     * @memberof GetAllSubmodelsRecentChangesResult
     */
    result?: Array<SubmodelRecentChange>;
}
/**
 *
 * @export
 * @interface GetAssetAdministrationShellDescriptorsResult
 */
export interface GetAssetAdministrationShellDescriptorsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAssetAdministrationShellDescriptorsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<AssetAdministrationShellDescriptor>}
     * @memberof GetAssetAdministrationShellDescriptorsResult
     */
    result?: Array<AssetAdministrationShellDescriptor>;
}
/**
 *
 * @export
 * @interface GetAssetAdministrationShellsResult
 */
export interface GetAssetAdministrationShellsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetAssetAdministrationShellsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<AssetAdministrationShell>}
     * @memberof GetAssetAdministrationShellsResult
     */
    result?: Array<AssetAdministrationShell>;
}
/**
 *
 * @export
 * @interface GetConceptDescriptionsResult
 */
export interface GetConceptDescriptionsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetConceptDescriptionsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<ConceptDescription>}
     * @memberof GetConceptDescriptionsResult
     */
    result?: Array<ConceptDescription>;
}
/**
 *
 * @export
 * @interface GetPackageDescriptionsResult
 */
export interface GetPackageDescriptionsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetPackageDescriptionsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<PackageDescription>}
     * @memberof GetPackageDescriptionsResult
     */
    result?: Array<PackageDescription>;
}
/**
 *
 * @export
 * @interface GetPathItemsResult
 */
export interface GetPathItemsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetPathItemsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<string>}
     * @memberof GetPathItemsResult
     */
    result?: Array<string>;
}
/**
 *
 * @export
 * @interface GetReferencesResult
 */
export interface GetReferencesResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetReferencesResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<Reference>}
     * @memberof GetReferencesResult
     */
    result?: Array<Reference>;
}
/**
 *
 * @export
 * @interface GetSubmodelDescriptorsResult
 */
export interface GetSubmodelDescriptorsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelDescriptorsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<SubmodelDescriptor>}
     * @memberof GetSubmodelDescriptorsResult
     */
    result?: Array<SubmodelDescriptor>;
}
/**
 *
 * @export
 * @interface GetSubmodelElementsMetadataResult
 */
export interface GetSubmodelElementsMetadataResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelElementsMetadataResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<SubmodelElementMetadata>}
     * @memberof GetSubmodelElementsMetadataResult
     */
    result?: Array<SubmodelElementMetadata>;
}
/**
 *
 * @export
 * @interface GetSubmodelElementsResult
 */
export interface GetSubmodelElementsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelElementsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<SubmodelElement>}
     * @memberof GetSubmodelElementsResult
     */
    result?: Array<SubmodelElement>;
}
/**
 *
 * @export
 * @interface GetSubmodelElementsValueResult
 */
export interface GetSubmodelElementsValueResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelElementsValueResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     * Since patternProperties and propertyNames are not supported by OpenApi yet, the ValueOnly serialization for this elements works with the key-attribute as the JSON-property name and the value-attribute as the corresponding value.
     * @type {object}
     * @memberof GetSubmodelElementsValueResult
     */
    result?: object;
}
/**
 *
 * @export
 * @interface GetSubmodelsMetadataResult
 */
export interface GetSubmodelsMetadataResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelsMetadataResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<SubmodelMetadata>}
     * @memberof GetSubmodelsMetadataResult
     */
    result?: Array<SubmodelMetadata>;
}
/**
 *
 * @export
 * @interface GetSubmodelsResult
 */
export interface GetSubmodelsResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelsResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     *
     * @type {Array<Submodel>}
     * @memberof GetSubmodelsResult
     */
    result?: Array<Submodel>;
}
/**
 *
 * @export
 * @interface GetSubmodelsValueResult
 */
export interface GetSubmodelsValueResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof GetSubmodelsValueResult
     */
    pagingMetadata: PagedResultPagingMetadata;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof GetSubmodelsValueResult
     */
    result?: object;
}
/**
 *
 * @export
 * @interface HasDataSpecification
 */
export interface HasDataSpecification {
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof HasDataSpecification
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
}
/**
 *
 * @export
 * @interface HasExtensions
 */
export interface HasExtensions {
    /**
     *
     * @type {Array<Extension>}
     * @memberof HasExtensions
     */
    extensions?: Array<Extension>;
}
/**
 *
 * @export
 * @interface HasKind
 */
export interface HasKind {
    /**
     *
     * @type {ModellingKind}
     * @memberof HasKind
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface HasSemantics
 */
export interface HasSemantics {
    /**
     *
     * @type {Reference}
     * @memberof HasSemantics
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof HasSemantics
     */
    supplementalSemanticIds?: Array<Reference>;
}
/**
 * @type HexComparisonItemsInner
 *
 * @export
 */
export type HexComparisonItemsInner = FieldOperand | HexOperand;
/**
 * Exactly two `hexOperand`/`fieldOperand` operands, per the AASQL `hexComparisonItems` schema.
 * @type HexComparisonItems
 * @export
 */
export type HexComparisonItems = [HexComparisonItemsInner, HexComparisonItemsInner];
/**
 *
 * @export
 * @interface HexOperand
 */
export interface HexOperand {
    /**
     *
     * @type {string}
     * @memberof HexOperand
     */
    $hexVal?: string;
    /**
     *
     * @type {Value}
     * @memberof HexOperand
     */
    $hexCast?: Value | null;
}
/**
 *
 * @export
 * @interface Identifiable
 */
export interface Identifiable {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Identifiable
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Identifiable
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Identifiable
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Identifiable
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Identifiable
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof Identifiable
     */
    modelType: ModelType;
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof Identifiable
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {string}
     * @memberof Identifiable
     */
    id: string;
}

/**
 *
 * @export
 * @interface Key
 */
export interface Key {
    /**
     *
     * @type {KeyTypes}
     * @memberof Key
     */
    type: KeyTypes;
    /**
     *
     * @type {string}
     * @memberof Key
     */
    value: string;
}

/**
 *
 * @export
 */
export const KeyTypes = {
    AnnotatedRelationshipElement: 'AnnotatedRelationshipElement',
    AssetAdministrationShell: 'AssetAdministrationShell',
    BasicEventElement: 'BasicEventElement',
    Blob: 'Blob',
    Capability: 'Capability',
    ConceptDescription: 'ConceptDescription',
    DataElement: 'DataElement',
    Entity: 'Entity',
    EventElement: 'EventElement',
    File: 'File',
    FragmentReference: 'FragmentReference',
    GlobalReference: 'GlobalReference',
    Identifiable: 'Identifiable',
    MultiLanguageProperty: 'MultiLanguageProperty',
    Operation: 'Operation',
    Property: 'Property',
    Range: 'Range',
    Referable: 'Referable',
    ReferenceElement: 'ReferenceElement',
    RelationshipElement: 'RelationshipElement',
    Submodel: 'Submodel',
    SubmodelElement: 'SubmodelElement',
    SubmodelElementCollection: 'SubmodelElementCollection',
    SubmodelElementList: 'SubmodelElementList',
} as const;
export type KeyTypes = (typeof KeyTypes)[keyof typeof KeyTypes];

/**
 *
 * @export
 * @interface LangStringDefinitionTypeIec61360
 */
export interface LangStringDefinitionTypeIec61360 {
    /**
     *
     * @type {string}
     * @memberof LangStringDefinitionTypeIec61360
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringDefinitionTypeIec61360
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringDefinitionTypeUom
 */
export interface LangStringDefinitionTypeUom {
    /**
     *
     * @type {string}
     * @memberof LangStringDefinitionTypeUom
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringDefinitionTypeUom
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringNameType
 */
export interface LangStringNameType {
    /**
     *
     * @type {string}
     * @memberof LangStringNameType
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringNameType
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringPreferredNameTypeIec61360
 */
export interface LangStringPreferredNameTypeIec61360 {
    /**
     *
     * @type {string}
     * @memberof LangStringPreferredNameTypeIec61360
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringPreferredNameTypeIec61360
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringShortNameTypeIec61360
 */
export interface LangStringShortNameTypeIec61360 {
    /**
     *
     * @type {string}
     * @memberof LangStringShortNameTypeIec61360
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringShortNameTypeIec61360
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringTextType
 */
export interface LangStringTextType {
    /**
     *
     * @type {string}
     * @memberof LangStringTextType
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringTextType
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LangStringUom
 */
export interface LangStringUom {
    /**
     *
     * @type {string}
     * @memberof LangStringUom
     */
    language: string;
    /**
     *
     * @type {any}
     * @memberof LangStringUom
     */
    text: any | null;
}
/**
 *
 * @export
 * @interface LevelType
 */
export interface LevelType {
    /**
     *
     * @type {boolean}
     * @memberof LevelType
     */
    min: boolean;
    /**
     *
     * @type {boolean}
     * @memberof LevelType
     */
    nom: boolean;
    /**
     *
     * @type {boolean}
     * @memberof LevelType
     */
    typ: boolean;
    /**
     *
     * @type {boolean}
     * @memberof LevelType
     */
    max: boolean;
}
/**
 * Exactly two operands compared with a string operator ($contains, $starts-with, $ends-with,
 * $regex). Mirrors the AASQL `stringValue` schema (narrower than the generic `Value` schema,
 * which additionally allows numeric/hex/dateTime/time/boolean operands) — not to be confused with
 * the unrelated, scalar `StringValue` schema.
 * @export
 * @interface StringValueOperand
 */
export interface StringValueOperand {
    /**
     *
     * @type {string}
     * @memberof StringValueOperand
     */
    $field?: string;
    /**
     *
     * @type {string}
     * @memberof StringValueOperand
     */
    $strVal?: string;
    /**
     *
     * @type {Value}
     * @memberof StringValueOperand
     */
    $strCast?: Value | null;
    /**
     *
     * @type {AttributeItem}
     * @memberof StringValueOperand
     */
    $attribute?: AttributeItem | null;
}
/**
 * Exactly two `stringValue` operands, per the AASQL `stringItems` schema.
 * @type StringItems
 * @export
 */
export type StringItems = [StringValueOperand, StringValueOperand];
/**
 *
 * @export
 * @interface LogicalExpression
 */
export interface LogicalExpression {
    /**
     *
     * @type {Array<LogicalExpression>}
     * @memberof LogicalExpression
     */
    $and?: Array<LogicalExpression>;
    /**
     *
     * @type {Array<MatchExpression>}
     * @memberof LogicalExpression
     */
    $match?: Array<MatchExpression>;
    /**
     *
     * @type {Array<LogicalExpression>}
     * @memberof LogicalExpression
     */
    $or?: Array<LogicalExpression>;
    /**
     *
     * @type {LogicalExpression}
     * @memberof LogicalExpression
     */
    $not?: LogicalExpression | null;
    /**
     *
     * @type {EqualityComparisonItems}
     * @memberof LogicalExpression
     */
    $eq?: EqualityComparisonItems;
    /**
     *
     * @type {EqualityComparisonItems}
     * @memberof LogicalExpression
     */
    $ne?: EqualityComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof LogicalExpression
     */
    $gt?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof LogicalExpression
     */
    $ge?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof LogicalExpression
     */
    $lt?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof LogicalExpression
     */
    $le?: OrderedComparisonItems;
    /**
     *
     * @type {StringItems}
     * @memberof LogicalExpression
     */
    $contains?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof LogicalExpression
     */
    '$starts-with'?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof LogicalExpression
     */
    '$ends-with'?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof LogicalExpression
     */
    $regex?: StringItems;
    /**
     *
     * @type {boolean}
     * @memberof LogicalExpression
     */
    $boolean?: boolean;
}
/**
 *
 * @export
 * @interface MatchExpression
 */
export interface MatchExpression {
    /**
     *
     * @type {Array<MatchExpression>}
     * @memberof MatchExpression
     */
    $match?: Array<MatchExpression>;
    /**
     *
     * @type {EqualityComparisonItems}
     * @memberof MatchExpression
     */
    $eq?: EqualityComparisonItems;
    /**
     *
     * @type {EqualityComparisonItems}
     * @memberof MatchExpression
     */
    $ne?: EqualityComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof MatchExpression
     */
    $gt?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof MatchExpression
     */
    $ge?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof MatchExpression
     */
    $lt?: OrderedComparisonItems;
    /**
     *
     * @type {OrderedComparisonItems}
     * @memberof MatchExpression
     */
    $le?: OrderedComparisonItems;
    /**
     *
     * @type {StringItems}
     * @memberof MatchExpression
     */
    $contains?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof MatchExpression
     */
    '$starts-with'?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof MatchExpression
     */
    '$ends-with'?: StringItems;
    /**
     *
     * @type {StringItems}
     * @memberof MatchExpression
     */
    $regex?: StringItems;
}
/**
 *
 * @export
 * @interface Message
 */
export interface Message {
    /**
     *
     * @type {string}
     * @memberof Message
     */
    code?: string;
    /**
     *
     * @type {string}
     * @memberof Message
     */
    correlationId?: string;
    /**
     *
     * @type {string}
     * @memberof Message
     */
    messageType?: MessageMessageTypeEnum;
    /**
     *
     * @type {string}
     * @memberof Message
     */
    text?: string;
    /**
     *
     * @type {string}
     * @memberof Message
     */
    timestamp?: string;
}

/**
 * @export
 */
export const MessageMessageTypeEnum = {
    Undefined: 'Undefined',
    Info: 'Info',
    Warning: 'Warning',
    Error: 'Error',
    Exception: 'Exception',
} as const;
export type MessageMessageTypeEnum = (typeof MessageMessageTypeEnum)[keyof typeof MessageMessageTypeEnum];

/**
 *
 * @export
 * @interface ModelFile
 */
export interface ModelFile {
    /**
     *
     * @type {Array<Extension>}
     * @memberof ModelFile
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof ModelFile
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof ModelFile
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof ModelFile
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof ModelFile
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof ModelFile
     */
    modelType: 'File';
    /**
     *
     * @type {Reference}
     * @memberof ModelFile
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof ModelFile
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof ModelFile
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof ModelFile
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {FileAllOfValue}
     * @memberof ModelFile
     */
    value?: FileAllOfValue;
    /**
     *
     * @type {FileAllOfContentType}
     * @memberof ModelFile
     */
    contentType?: FileAllOfContentType;
}

/**
 *
 * @export
 */
export const ModelType = {
    AnnotatedRelationshipElement: 'AnnotatedRelationshipElement',
    AssetAdministrationShell: 'AssetAdministrationShell',
    BasicEventElement: 'BasicEventElement',
    Blob: 'Blob',
    Capability: 'Capability',
    ConceptDescription: 'ConceptDescription',
    DataSpecificationIec61360: 'DataSpecificationIec61360',
    DataSpecificationUom: 'DataSpecificationUom',
    Entity: 'Entity',
    File: 'File',
    MultiLanguageProperty: 'MultiLanguageProperty',
    Operation: 'Operation',
    Property: 'Property',
    Range: 'Range',
    ReferenceElement: 'ReferenceElement',
    RelationshipElement: 'RelationshipElement',
    Submodel: 'Submodel',
    SubmodelElementCollection: 'SubmodelElementCollection',
    SubmodelElementList: 'SubmodelElementList',
} as const;
export type ModelType = (typeof ModelType)[keyof typeof ModelType];

/**
 *
 * @export
 */
export const ModellingKind = {
    Instance: 'Instance',
    Template: 'Template',
} as const;
export type ModellingKind = (typeof ModellingKind)[keyof typeof ModellingKind];

/**
 *
 * @export
 * @interface MultiLanguageProperty
 */
export interface MultiLanguageProperty {
    /**
     *
     * @type {Array<Extension>}
     * @memberof MultiLanguageProperty
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof MultiLanguageProperty
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof MultiLanguageProperty
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof MultiLanguageProperty
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof MultiLanguageProperty
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof MultiLanguageProperty
     */
    modelType: 'MultiLanguageProperty';
    /**
     *
     * @type {Reference}
     * @memberof MultiLanguageProperty
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof MultiLanguageProperty
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof MultiLanguageProperty
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof MultiLanguageProperty
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof MultiLanguageProperty
     */
    value?: Array<LangStringTextType>;
    /**
     *
     * @type {Reference}
     * @memberof MultiLanguageProperty
     */
    valueId?: Reference;
}
/**
 *
 * @export
 * @interface MultiLanguagePropertyMetadata
 */
export interface MultiLanguagePropertyMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof MultiLanguagePropertyMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof MultiLanguagePropertyMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof MultiLanguagePropertyMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof MultiLanguagePropertyMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof MultiLanguagePropertyMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof MultiLanguagePropertyMetadata
     */
    modelType: 'MultiLanguageProperty';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof MultiLanguagePropertyMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof MultiLanguagePropertyMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof MultiLanguagePropertyMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof MultiLanguagePropertyMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof MultiLanguagePropertyMetadata
     */
    kind?: ModellingKind;
}

/**
 * @type NumericalComparisonItemsInner
 *
 * @export
 */
export type NumericalComparisonItemsInner = FieldOperand | NumericalOperand;
/**
 * Exactly two `numericalOperand`/`fieldOperand` operands, per the AASQL `numericalComparisonItems`
 * schema.
 * @type NumericalComparisonItems
 * @export
 */
export type NumericalComparisonItems = [NumericalComparisonItemsInner, NumericalComparisonItemsInner];
/**
 *
 * @export
 * @interface NumericalOperand
 */
export interface NumericalOperand {
    /**
     *
     * @type {number}
     * @memberof NumericalOperand
     */
    $numVal?: number;
    /**
     *
     * @type {Value}
     * @memberof NumericalOperand
     */
    $numCast?: Value | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof NumericalOperand
     */
    $dayOfWeek?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof NumericalOperand
     */
    $dayOfMonth?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof NumericalOperand
     */
    $month?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof NumericalOperand
     */
    $year?: DateTimeOperand | null;
}
/**
 *
 * @export
 * @interface Operation
 */
export interface Operation {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Operation
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Operation
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Operation
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Operation
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Operation
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Operation
     */
    modelType: 'Operation';
    /**
     *
     * @type {Reference}
     * @memberof Operation
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Operation
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Operation
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Operation
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof Operation
     */
    inputVariables?: Array<OperationVariable>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof Operation
     */
    outputVariables?: Array<OperationVariable>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof Operation
     */
    inoutputVariables?: Array<OperationVariable>;
}
/**
 *
 * @export
 * @interface OperationHandle
 */
export interface OperationHandle {
    /**
     *
     * @type {string}
     * @memberof OperationHandle
     */
    handleId?: string;
}
/**
 *
 * @export
 * @interface OperationMetadata
 */
export interface OperationMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof OperationMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof OperationMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof OperationMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof OperationMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof OperationMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof OperationMetadata
     */
    modelType: 'Operation';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof OperationMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof OperationMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof OperationMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof OperationMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof OperationMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface OperationRequest
 */
export interface OperationRequest {
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationRequest
     */
    inoutputArguments?: Array<OperationVariable>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationRequest
     */
    inputArguments?: Array<OperationVariable>;
    /**
     *
     * @type {string}
     * @memberof OperationRequest
     */
    clientTimeoutDuration?: string;
}
/**
 *
 * @export
 * @interface OperationRequestAsync
 */
export interface OperationRequestAsync {
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationRequestAsync
     */
    inoutputArguments?: Array<OperationVariable>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationRequestAsync
     */
    inputArguments?: Array<OperationVariable>;
    /**
     *
     * @type {string}
     * @memberof OperationRequestAsync
     */
    clientTimeoutDuration: string;
}
/**
 *
 * @export
 * @interface OperationRequestAsyncValueOnly
 */
export interface OperationRequestAsyncValueOnly {
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestAsyncValueOnly
     */
    inoutputArguments?: object;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestAsyncValueOnly
     */
    inputArguments?: object;
    /**
     *
     * @type {string}
     * @memberof OperationRequestAsyncValueOnly
     */
    clientTimeoutDuration: string;
}
/**
 *
 * @export
 * @interface OperationRequestValueOnly
 */
export interface OperationRequestValueOnly {
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestValueOnly
     */
    inoutputArguments?: object;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestValueOnly
     */
    inputArguments?: object;
    /**
     *
     * @type {string}
     * @memberof OperationRequestValueOnly
     */
    clientTimeoutDuration?: string;
}
/**
 *
 * @export
 * @interface OperationResult
 */
export interface OperationResult {
    /**
     *
     * @type {Array<Message>}
     * @memberof OperationResult
     */
    messages?: Array<Message>;
    /**
     *
     * @type {ExecutionState}
     * @memberof OperationResult
     */
    executionState?: ExecutionState;
    /**
     *
     * @type {boolean}
     * @memberof OperationResult
     */
    success?: boolean;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationResult
     */
    inoutputArguments?: Array<OperationVariable>;
    /**
     *
     * @type {Array<OperationVariable>}
     * @memberof OperationResult
     */
    outputArguments?: Array<OperationVariable>;
}

/**
 *
 * @export
 * @interface OperationResultValueOnly
 */
export interface OperationResultValueOnly {
    /**
     *
     * @type {Array<Message>}
     * @memberof OperationResultValueOnly
     */
    messages?: Array<Message>;
    /**
     *
     * @type {ExecutionState}
     * @memberof OperationResultValueOnly
     */
    executionState?: ExecutionState;
    /**
     *
     * @type {boolean}
     * @memberof OperationResultValueOnly
     */
    success?: boolean;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationResultValueOnly
     */
    inoutputArguments?: object;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will probably be supported with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationResultValueOnly
     */
    outputArguments?: object;
}

/**
 *
 * @export
 * @interface OperationVariable
 */
export interface OperationVariable {
    /**
     *
     * @type {SubmodelElementChoice}
     * @memberof OperationVariable
     */
    value: SubmodelElementChoice;
}
/**
 * A union of the comparison-item tuple types usable with $gt/$ge/$lt/$le, per the AASQL
 * `orderedComparisonItems` schema (anyOf stringItems | numericalComparisonItems |
 * hexComparisonItems | dateTimeComparisonItems | timeComparisonItems — no boolComparisonItems,
 * since booleans have no total ordering).
 * @type OrderedComparisonItems
 * @export
 */
export type OrderedComparisonItems =
    StringItems | NumericalComparisonItems | HexComparisonItems | DateTimeComparisonItems | TimeComparisonItems;
/**
 *
 * @export
 * @interface PackageDescription
 */
export interface PackageDescription {
    /**
     *
     * @type {Array<string>}
     * @memberof PackageDescription
     */
    aasIds?: Array<string>;
    /**
     *
     * @type {string}
     * @memberof PackageDescription
     */
    packageId?: string;
}
/**
 *
 * @export
 * @interface PagedResult
 */
export interface PagedResult {
    /**
     *
     * @type {PagedResultPagingMetadata}
     * @memberof PagedResult
     */
    pagingMetadata: PagedResultPagingMetadata;
}
/**
 *
 * @export
 * @interface PagedResultPagingMetadata
 */
export interface PagedResultPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof PagedResultPagingMetadata
     */
    cursor?: string;
}
/**
 *
 * @export
 * @interface Property
 */
export interface Property {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Property
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Property
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Property
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Property
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Property
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Property
     */
    modelType: 'Property';
    /**
     *
     * @type {Reference}
     * @memberof Property
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Property
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Property
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Property
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof Property
     */
    valueType: DataTypeDefXsd;
    /**
     *
     * @type {string}
     * @memberof Property
     */
    value?: string;
    /**
     *
     * @type {Reference}
     * @memberof Property
     */
    valueId?: Reference;
}

/**
 *
 * @export
 * @interface PropertyMetadata
 */
export interface PropertyMetadata {
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof PropertyMetadata
     */
    valueType?: DataTypeDefXsd;
    /**
     *
     * @type {Array<Extension>}
     * @memberof PropertyMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof PropertyMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof PropertyMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof PropertyMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof PropertyMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof PropertyMetadata
     */
    modelType: 'Property';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof PropertyMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof PropertyMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof PropertyMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof PropertyMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof PropertyMetadata
     */
    kind?: ModellingKind;
}

/**
 * @type PropertyValue
 *
 * @export
 */
export type PropertyValue = boolean | number | string;
/**
 *
 * @export
 * @interface ProtocolInformation
 */
export interface ProtocolInformation {
    /**
     *
     * @type {string}
     * @memberof ProtocolInformation
     */
    href: string;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformation
     */
    endpointProtocol?: string;
    /**
     *
     * @type {Array<string>}
     * @memberof ProtocolInformation
     */
    endpointProtocolVersion?: Array<string>;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformation
     */
    subprotocol?: string;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformation
     */
    subprotocolBody?: string;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformation
     */
    subprotocolBodyEncoding?: string;
    /**
     *
     * @type {Array<ProtocolInformationSecurityAttributesInner>}
     * @memberof ProtocolInformation
     */
    securityAttributes?: Array<ProtocolInformationSecurityAttributesInner>;
}
/**
 *
 * @export
 * @interface ProtocolInformationSecurityAttributesInner
 */
export interface ProtocolInformationSecurityAttributesInner {
    /**
     *
     * @type {string}
     * @memberof ProtocolInformationSecurityAttributesInner
     */
    type: ProtocolInformationSecurityAttributesInnerTypeEnum;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformationSecurityAttributesInner
     */
    key: string;
    /**
     *
     * @type {string}
     * @memberof ProtocolInformationSecurityAttributesInner
     */
    value: string;
}

/**
 * @export
 */
export const ProtocolInformationSecurityAttributesInnerTypeEnum = {
    None: 'NONE',
    RfcTlsa: 'RFC_TLSA',
    W3CDid: 'W3C_DID',
} as const;
export type ProtocolInformationSecurityAttributesInnerTypeEnum =
    (typeof ProtocolInformationSecurityAttributesInnerTypeEnum)[keyof typeof ProtocolInformationSecurityAttributesInnerTypeEnum];

/**
 *
 * @export
 * @interface Qualifiable
 */
export interface Qualifiable {
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Qualifiable
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModelType}
     * @memberof Qualifiable
     */
    modelType: ModelType;
}

/**
 *
 * @export
 * @interface Qualifier
 */
export interface Qualifier {
    /**
     *
     * @type {Reference}
     * @memberof Qualifier
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Qualifier
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {QualifierKind}
     * @memberof Qualifier
     */
    kind?: QualifierKind;
    /**
     *
     * @type {string}
     * @memberof Qualifier
     */
    type: string;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof Qualifier
     */
    valueType: DataTypeDefXsd;
    /**
     *
     * @type {string}
     * @memberof Qualifier
     */
    value?: string;
    /**
     *
     * @type {Reference}
     * @memberof Qualifier
     */
    valueId?: Reference;
}

/**
 *
 * @export
 */
export const QualifierKind = {
    ConceptQualifier: 'ConceptQualifier',
    TemplateQualifier: 'TemplateQualifier',
    ValueQualifier: 'ValueQualifier',
} as const;
export type QualifierKind = (typeof QualifierKind)[keyof typeof QualifierKind];

/**
 *
 * @export
 * @interface Query
 */
export interface Query {
    /**
     *
     * @type {string}
     * @memberof Query
     */
    $select?: string;
    /**
     *
     * @type {LogicalExpression}
     * @memberof Query
     */
    $condition: LogicalExpression | null;
    /**
     *
     * @type {Array<QueryFilter>}
     * @memberof Query
     */
    $filters?: Array<QueryFilter>;
}
/**
 *
 * @export
 * @interface QueryFilter
 */
export interface QueryFilter {
    /**
     *
     * @type {string}
     * @memberof QueryFilter
     */
    $fragment: string;
    /**
     *
     * @type {LogicalExpression}
     * @memberof QueryFilter
     */
    $condition: LogicalExpression | null;
}
/**
 *
 * @export
 * @interface QueryResultAssetAdministrationShell
 */
export interface QueryResultAssetAdministrationShell {
    /**
     *
     * @type {QueryResultAssetAdministrationShellPagingMetadata}
     * @memberof QueryResultAssetAdministrationShell
     */
    pagingMetadata?: QueryResultAssetAdministrationShellPagingMetadata;
    /**
     *
     * @type {Array<QueryResultAssetAdministrationShellResultInner>}
     * @memberof QueryResultAssetAdministrationShell
     */
    result?: Array<QueryResultAssetAdministrationShellResultInner>;
}
/**
 *
 * @export
 * @interface QueryResultAssetAdministrationShellDescriptor
 */
export interface QueryResultAssetAdministrationShellDescriptor {
    /**
     *
     * @type {QueryResultAssetAdministrationShellDescriptorPagingMetadata}
     * @memberof QueryResultAssetAdministrationShellDescriptor
     */
    pagingMetadata: QueryResultAssetAdministrationShellDescriptorPagingMetadata;
    /**
     *
     * @type {Array<AssetAdministrationShellDescriptor>}
     * @memberof QueryResultAssetAdministrationShellDescriptor
     */
    result?: Array<AssetAdministrationShellDescriptor>;
}
/**
 *
 * @export
 * @interface QueryResultAssetAdministrationShellDescriptorPagingMetadata
 */
export interface QueryResultAssetAdministrationShellDescriptorPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof QueryResultAssetAdministrationShellDescriptorPagingMetadata
     */
    cursor?: string;
    /**
     *
     * @type {string}
     * @memberof QueryResultAssetAdministrationShellDescriptorPagingMetadata
     */
    resultType?: QueryResultAssetAdministrationShellDescriptorPagingMetadataResultTypeEnum;
}

/**
 * @export
 */
export const QueryResultAssetAdministrationShellDescriptorPagingMetadataResultTypeEnum = {
    AssetAdministrationShellDescriptor: 'AssetAdministrationShellDescriptor',
} as const;
export type QueryResultAssetAdministrationShellDescriptorPagingMetadataResultTypeEnum =
    (typeof QueryResultAssetAdministrationShellDescriptorPagingMetadataResultTypeEnum)[keyof typeof QueryResultAssetAdministrationShellDescriptorPagingMetadataResultTypeEnum];

/**
 *
 * @export
 * @interface QueryResultAssetAdministrationShellPagingMetadata
 */
export interface QueryResultAssetAdministrationShellPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof QueryResultAssetAdministrationShellPagingMetadata
     */
    cursor?: string;
    /**
     *
     * @type {string}
     * @memberof QueryResultAssetAdministrationShellPagingMetadata
     */
    resultType?: QueryResultAssetAdministrationShellPagingMetadataResultTypeEnum;
}

/**
 * @export
 */
export const QueryResultAssetAdministrationShellPagingMetadataResultTypeEnum = {
    AssetAdministrationShell: 'AssetAdministrationShell',
    Identifier: 'Identifier',
} as const;
export type QueryResultAssetAdministrationShellPagingMetadataResultTypeEnum =
    (typeof QueryResultAssetAdministrationShellPagingMetadataResultTypeEnum)[keyof typeof QueryResultAssetAdministrationShellPagingMetadataResultTypeEnum];

/**
 * @type QueryResultAssetAdministrationShellResultInner
 *
 * @export
 */
export type QueryResultAssetAdministrationShellResultInner = AssetAdministrationShell | string;
/**
 *
 * @export
 * @interface QueryResultConceptDescription
 */
export interface QueryResultConceptDescription {
    /**
     *
     * @type {QueryResultConceptDescriptionPagingMetadata}
     * @memberof QueryResultConceptDescription
     */
    pagingMetadata: QueryResultConceptDescriptionPagingMetadata;
    /**
     *
     * @type {Array<QueryResultConceptDescriptionResultInner>}
     * @memberof QueryResultConceptDescription
     */
    result?: Array<QueryResultConceptDescriptionResultInner>;
}
/**
 *
 * @export
 * @interface QueryResultConceptDescriptionPagingMetadata
 */
export interface QueryResultConceptDescriptionPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof QueryResultConceptDescriptionPagingMetadata
     */
    cursor?: string;
    /**
     *
     * @type {string}
     * @memberof QueryResultConceptDescriptionPagingMetadata
     */
    resultType?: QueryResultConceptDescriptionPagingMetadataResultTypeEnum;
}

/**
 * @export
 */
export const QueryResultConceptDescriptionPagingMetadataResultTypeEnum = {
    ConceptDescription: 'ConceptDescription',
    Identifier: 'Identifier',
} as const;
export type QueryResultConceptDescriptionPagingMetadataResultTypeEnum =
    (typeof QueryResultConceptDescriptionPagingMetadataResultTypeEnum)[keyof typeof QueryResultConceptDescriptionPagingMetadataResultTypeEnum];

/**
 * @type QueryResultConceptDescriptionResultInner
 *
 * @export
 */
export type QueryResultConceptDescriptionResultInner = ConceptDescription | string;
/**
 *
 * @export
 * @interface QueryResultSubmodel
 */
export interface QueryResultSubmodel {
    /**
     *
     * @type {QueryResultSubmodelPagingMetadata}
     * @memberof QueryResultSubmodel
     */
    pagingMetadata: QueryResultSubmodelPagingMetadata;
    /**
     *
     * @type {Array<QueryResultSubmodelResultInner>}
     * @memberof QueryResultSubmodel
     */
    result?: Array<QueryResultSubmodelResultInner>;
}
/**
 *
 * @export
 * @interface QueryResultSubmodelDescriptor
 */
export interface QueryResultSubmodelDescriptor {
    /**
     *
     * @type {QueryResultSubmodelDescriptorPagingMetadata}
     * @memberof QueryResultSubmodelDescriptor
     */
    pagingMetadata: QueryResultSubmodelDescriptorPagingMetadata;
    /**
     *
     * @type {Array<QueryResultSubmodelDescriptorResultInner>}
     * @memberof QueryResultSubmodelDescriptor
     */
    result?: Array<QueryResultSubmodelDescriptorResultInner>;
}
/**
 *
 * @export
 * @interface QueryResultSubmodelDescriptorPagingMetadata
 */
export interface QueryResultSubmodelDescriptorPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof QueryResultSubmodelDescriptorPagingMetadata
     */
    cursor?: string;
    /**
     *
     * @type {string}
     * @memberof QueryResultSubmodelDescriptorPagingMetadata
     */
    resultType?: QueryResultSubmodelDescriptorPagingMetadataResultTypeEnum;
}

/**
 * @export
 */
export const QueryResultSubmodelDescriptorPagingMetadataResultTypeEnum = {
    SubmodelDescriptor: 'SubmodelDescriptor',
    Identifier: 'Identifier',
} as const;
export type QueryResultSubmodelDescriptorPagingMetadataResultTypeEnum =
    (typeof QueryResultSubmodelDescriptorPagingMetadataResultTypeEnum)[keyof typeof QueryResultSubmodelDescriptorPagingMetadataResultTypeEnum];

/**
 * @type QueryResultSubmodelDescriptorResultInner
 *
 * @export
 */
export type QueryResultSubmodelDescriptorResultInner = SubmodelDescriptor | string;
/**
 *
 * @export
 * @interface QueryResultSubmodelPagingMetadata
 */
export interface QueryResultSubmodelPagingMetadata {
    /**
     *
     * @type {string}
     * @memberof QueryResultSubmodelPagingMetadata
     */
    cursor?: string;
    /**
     *
     * @type {string}
     * @memberof QueryResultSubmodelPagingMetadata
     */
    resultType?: QueryResultSubmodelPagingMetadataResultTypeEnum;
}

/**
 * @export
 */
export const QueryResultSubmodelPagingMetadataResultTypeEnum = {
    Submodel: 'Submodel',
    Identifier: 'Identifier',
} as const;
export type QueryResultSubmodelPagingMetadataResultTypeEnum =
    (typeof QueryResultSubmodelPagingMetadataResultTypeEnum)[keyof typeof QueryResultSubmodelPagingMetadataResultTypeEnum];

/**
 * @type QueryResultSubmodelResultInner
 *
 * @export
 */
export type QueryResultSubmodelResultInner = Submodel | string;
/**
 *
 * @export
 * @interface Range
 */
export interface Range {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Range
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Range
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Range
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Range
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Range
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Range
     */
    modelType: 'Range';
    /**
     *
     * @type {Reference}
     * @memberof Range
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Range
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Range
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Range
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof Range
     */
    valueType: DataTypeDefXsd;
    /**
     *
     * @type {string}
     * @memberof Range
     */
    min?: string;
    /**
     *
     * @type {string}
     * @memberof Range
     */
    max?: string;
}

/**
 *
 * @export
 * @interface RangeMetadata
 */
export interface RangeMetadata {
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof RangeMetadata
     */
    valueType?: DataTypeDefXsd;
    /**
     *
     * @type {Array<Extension>}
     * @memberof RangeMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof RangeMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof RangeMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof RangeMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof RangeMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof RangeMetadata
     */
    modelType: ModelType;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof RangeMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof RangeMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof RangeMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof RangeMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof RangeMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface RangeValue
 */
export interface RangeValue {
    /**
     *
     * @type {number}
     * @memberof RangeValue
     */
    max: number;
    /**
     *
     * @type {number}
     * @memberof RangeValue
     */
    min: number;
}
/**
 *
 * @export
 * @interface RecentChange
 */
export interface RecentChange {
    /**
     *
     * @type {string}
     * @memberof RecentChange
     */
    createdAt: string;
    /**
     *
     * @type {string}
     * @memberof RecentChange
     */
    updatedAt: string;
}
/**
 *
 * @export
 * @interface Referable
 */
export interface Referable {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Referable
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Referable
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Referable
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Referable
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Referable
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof Referable
     */
    modelType: ModelType;
}

/**
 *
 * @export
 * @interface ReferableAllOfIdShort
 */
export type ReferableAllOfIdShort = string;
/**
 *
 * @export
 * @interface Reference
 */
export interface Reference {
    /**
     *
     * @type {ReferenceTypes}
     * @memberof Reference
     */
    type: ReferenceTypes;
    /**
     *
     * @type {Reference}
     * @memberof Reference
     */
    referredSemanticId?: Reference;
    /**
     *
     * @type {Array<Key>}
     * @memberof Reference
     */
    keys: Array<Key>;
}

/**
 *
 * @export
 * @interface ReferenceElement
 */
export interface ReferenceElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof ReferenceElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof ReferenceElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof ReferenceElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof ReferenceElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof ReferenceElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof ReferenceElement
     */
    modelType: 'ReferenceElement';
    /**
     *
     * @type {Reference}
     * @memberof ReferenceElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof ReferenceElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof ReferenceElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof ReferenceElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof ReferenceElement
     */
    value?: Reference;
}
/**
 *
 * @export
 * @interface ReferenceElementMetadata
 */
export interface ReferenceElementMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof ReferenceElementMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof ReferenceElementMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof ReferenceElementMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof ReferenceElementMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof ReferenceElementMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof ReferenceElementMetadata
     */
    modelType: 'ReferenceElement';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof ReferenceElementMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof ReferenceElementMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof ReferenceElementMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof ReferenceElementMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof ReferenceElementMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 */
export const ReferenceTypes = {
    ExternalReference: 'ExternalReference',
    ModelReference: 'ModelReference',
} as const;
export type ReferenceTypes = (typeof ReferenceTypes)[keyof typeof ReferenceTypes];

/**
 *
 * @export
 * @interface RelationshipElement
 */
export interface RelationshipElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof RelationshipElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof RelationshipElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof RelationshipElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof RelationshipElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof RelationshipElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof RelationshipElement
     */
    modelType: 'RelationshipElement';
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof RelationshipElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof RelationshipElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof RelationshipElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElement
     */
    first?: Reference;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElement
     */
    second?: Reference;
}
/**
 *
 * @export
 * @interface RelationshipElementAbstract
 */
export interface RelationshipElementAbstract {
    /**
     *
     * @type {Array<Extension>}
     * @memberof RelationshipElementAbstract
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof RelationshipElementAbstract
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof RelationshipElementAbstract
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof RelationshipElementAbstract
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof RelationshipElementAbstract
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof RelationshipElementAbstract
     */
    modelType: 'RelationshipElement';
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementAbstract
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof RelationshipElementAbstract
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof RelationshipElementAbstract
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof RelationshipElementAbstract
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementAbstract
     */
    first?: Reference;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementAbstract
     */
    second?: Reference;
}

/**
 *
 * @export
 * @interface RelationshipElementMetadata
 */
export interface RelationshipElementMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof RelationshipElementMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof RelationshipElementMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof RelationshipElementMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof RelationshipElementMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof RelationshipElementMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof RelationshipElementMetadata
     */
    modelType: 'RelationshipElement';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof RelationshipElementMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof RelationshipElementMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof RelationshipElementMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof RelationshipElementMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface RelationshipElementValue
 */
export interface RelationshipElementValue {
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementValue
     */
    first?: Reference;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementValue
     */
    second?: Reference;
}
/**
 *
 * @export
 * @interface Resource
 */
export interface Resource {
    /**
     *
     * @type {string}
     * @memberof Resource
     */
    path: string;
    /**
     *
     * @type {string}
     * @memberof Resource
     */
    contentType?: string;
}
/**
 *
 * @export
 * @interface Result
 */
export interface Result {
    /**
     *
     * @type {Array<Message>}
     * @memberof Result
     */
    messages?: Array<Message>;
}
/**
 * The Description object enables servers to present their capabilities to the clients, in particular which profiles they implement. At least one defined profile is required. Additional, proprietary attributes might be included. Nevertheless, the server must not expect that a regular client understands them.
 * @export
 * @interface ServiceDescription
 */
export interface ServiceDescription {
    /**
     * The list of profiles implemented by the server. The profiles are identified by their URI. Note that the list of example profiles is not exhaustive, but only includes the profiles defined in the current version of the specification. The server might also include proprietary profiles, which are not defined in the specification. Clients should be designed to ignore unknown profiles, but might use them to implement additional functionality if they are known.
     * @type {Array<string>}
     * @memberof ServiceDescription
     */
    profiles?: Array<string>;
}
/**
 *
 * @export
 * @interface SpecificAssetId
 */
export interface SpecificAssetId {
    /**
     *
     * @type {Reference}
     * @memberof SpecificAssetId
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SpecificAssetId
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {string}
     * @memberof SpecificAssetId
     */
    name: string;
    /**
     *
     * @type {string}
     * @memberof SpecificAssetId
     */
    value: string;
    /**
     *
     * @type {Reference}
     * @memberof SpecificAssetId
     */
    externalSubjectId?: Reference;
}

/**
 *
 * @export
 */
export const StateOfEvent = {
    False: 'false',
    True: 'true',
} as const;
export type StateOfEvent = (typeof StateOfEvent)[keyof typeof StateOfEvent];

/**
 *
 * @export
 * @interface Submodel
 */
export interface Submodel {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Submodel
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Submodel
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof Submodel
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Submodel
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Submodel
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof Submodel
     */
    modelType: 'Submodel';
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof Submodel
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {string}
     * @memberof Submodel
     */
    id: string;
    /**
     *
     * @type {ModellingKind}
     * @memberof Submodel
     */
    kind?: ModellingKind;
    /**
     *
     * @type {Reference}
     * @memberof Submodel
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Submodel
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof Submodel
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof Submodel
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<SubmodelElementChoice>}
     * @memberof Submodel
     */
    submodelElements?: Array<SubmodelElementChoice>;
}

/**
 *
 * @export
 * @interface SubmodelDescriptor
 */
export interface SubmodelDescriptor {
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof SubmodelDescriptor
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {Array<Endpoint>}
     * @memberof SubmodelDescriptor
     */
    endpoints: Array<Endpoint>;
    /**
     *
     * @type {string}
     * @memberof SubmodelDescriptor
     */
    idShort?: string;
    /**
     *
     * @type {string}
     * @memberof SubmodelDescriptor
     */
    id: string;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelDescriptor
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelDescriptor
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelDescriptor
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelDescriptor
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelDescriptor
     */
    extensions?: Array<Extension>;
}
/**
 *
 * @export
 * @interface SubmodelElement
 */
export interface SubmodelElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelElement
     */
    modelType: ModelType;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
}

/**
 *
 * @export
 * @interface SubmodelElementAttributes
 */
export interface SubmodelElementAttributes {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElementAttributes
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElementAttributes
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElementAttributes
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElementAttributes
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElementAttributes
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelElementAttributes
     */
    modelType: ModelType;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElementAttributes
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementAttributes
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElementAttributes
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElementAttributes
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof SubmodelElementAttributes
     */
    kind?: ModellingKind;
}

/**
 * @type SubmodelElementChoice
 *
 * @export
 */
export type SubmodelElementChoice =
    | AnnotatedRelationshipElement
    | BasicEventElement
    | Blob
    | Capability
    | Entity
    | ModelFile
    | MultiLanguageProperty
    | Operation
    | Property
    | Range
    | ReferenceElement
    | RelationshipElement
    | SubmodelElementCollection
    | SubmodelElementList;
/**
 *
 * @export
 * @interface SubmodelElementCollection
 */
export interface SubmodelElementCollection {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElementCollection
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElementCollection
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElementCollection
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElementCollection
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElementCollection
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof SubmodelElementCollection
     */
    modelType: 'SubmodelElementCollection';
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementCollection
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElementCollection
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElementCollection
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElementCollection
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<SubmodelElementChoice>}
     * @memberof SubmodelElementCollection
     */
    value?: Array<SubmodelElementChoice>;
}
/**
 *
 * @export
 * @interface SubmodelElementCollectionMetadata
 */
export interface SubmodelElementCollectionMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElementCollectionMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElementCollectionMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElementCollectionMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElementCollectionMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElementCollectionMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelElementCollectionMetadata
     */
    modelType: 'SubmodelElementCollection';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElementCollectionMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementCollectionMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElementCollectionMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElementCollectionMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof SubmodelElementCollectionMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface SubmodelElementList
 */
export interface SubmodelElementList {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElementList
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElementList
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElementList
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElementList
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElementList
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {any}
     * @memberof SubmodelElementList
     */
    modelType: 'SubmodelElementList';
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementList
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElementList
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElementList
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElementList
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {boolean}
     * @memberof SubmodelElementList
     */
    orderRelevant?: boolean;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementList
     */
    semanticIdListElement?: Reference;
    /**
     *
     * @type {AasSubmodelElements}
     * @memberof SubmodelElementList
     */
    typeValueListElement: AasSubmodelElements;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof SubmodelElementList
     */
    valueTypeListElement?: DataTypeDefXsd;
    /**
     *
     * @type {Array<SubmodelElementChoice>}
     * @memberof SubmodelElementList
     */
    value?: Array<SubmodelElementChoice>;
}

/**
 *
 * @export
 * @interface SubmodelElementListMetadata
 */
export interface SubmodelElementListMetadata {
    /**
     *
     * @type {boolean}
     * @memberof SubmodelElementListMetadata
     */
    orderRelevant?: boolean;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementListMetadata
     */
    semanticIdListElement?: Reference;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelElementListMetadata
     */
    typeValueListElement?: ModelType;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof SubmodelElementListMetadata
     */
    valueTypeListElement?: DataTypeDefXsd;
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelElementListMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelElementListMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelElementListMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelElementListMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelElementListMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelElementListMetadata
     */
    modelType: 'SubmodelElementList';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelElementListMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelElementListMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelElementListMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelElementListMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {ModellingKind}
     * @memberof SubmodelElementListMetadata
     */
    kind?: ModellingKind;
}

/**
 * @type SubmodelElementMetadata
 *
 * @export
 */
export type SubmodelElementMetadata = SubmodelElementAttributes;
/**
 * @type SubmodelElementValue
 *
 * @export
 */
export type SubmodelElementValue =
    | AnnotatedRelationshipElementValue
    | Array<SubmodelElementValue>
    | BasicEventElementValue
    | BlobValue
    | EntityValue
    | FileValue
    | PropertyValue
    | RangeValue
    | Reference
    | RelationshipElementValue
    | object;
/**
 *
 * @export
 * @interface SubmodelMetadata
 */
export interface SubmodelMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof SubmodelMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof SubmodelMetadata
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof SubmodelMetadata
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof SubmodelMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof SubmodelMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof SubmodelMetadata
     */
    modelType: ModelType;
    /**
     *
     * @type {AdministrativeInformation}
     * @memberof SubmodelMetadata
     */
    administration?: AdministrativeInformation;
    /**
     *
     * @type {string}
     * @memberof SubmodelMetadata
     */
    id: string;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof SubmodelMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof SubmodelMetadata
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {ModellingKind}
     * @memberof SubmodelMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface SubmodelRecentChange
 */
export interface SubmodelRecentChange {
    /**
     *
     * @type {string}
     * @memberof SubmodelRecentChange
     */
    createdAt: string;
    /**
     *
     * @type {string}
     * @memberof SubmodelRecentChange
     */
    updatedAt: string;
    /**
     *
     * @type {string}
     * @memberof SubmodelRecentChange
     */
    id: string;
    /**
     *
     * @type {Reference}
     * @memberof SubmodelRecentChange
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof SubmodelRecentChange
     */
    supplementalSemanticIds?: Array<Reference>;
}
/**
 * @type TimeComparisonItemsInner
 *
 * @export
 */
export type TimeComparisonItemsInner = FieldOperand | TimeOperand;
/**
 * Exactly two `timeOperand`/`fieldOperand` operands, per the AASQL `timeComparisonItems` schema.
 * @type TimeComparisonItems
 * @export
 */
export type TimeComparisonItems = [TimeComparisonItemsInner, TimeComparisonItemsInner];
/**
 *
 * @export
 * @interface TimeOperand
 */
export interface TimeOperand {
    /**
     *
     * @type {string}
     * @memberof TimeOperand
     */
    $timeVal?: string;
    /**
     *
     * @type {string | DateTimeOperand}
     * @memberof TimeOperand
     */
    $timeCast?: string | DateTimeOperand | null;
}
/**
 *
 * @export
 * @interface Value
 */
export interface Value {
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $field?: string;
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $strVal?: string;
    /**
     *
     * @type {AttributeItem}
     * @memberof Value
     */
    $attribute?: AttributeItem | null;
    /**
     *
     * @type {number}
     * @memberof Value
     */
    $numVal?: number;
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $hexVal?: string;
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $dateTimeVal?: string;
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $timeVal?: string;
    /**
     *
     * @type {boolean}
     * @memberof Value
     */
    $boolean?: boolean;
    /**
     *
     * @type {Value}
     * @memberof Value
     */
    $strCast?: Value | null;
    /**
     *
     * @type {Value}
     * @memberof Value
     */
    $numCast?: Value | null;
    /**
     *
     * @type {Value}
     * @memberof Value
     */
    $hexCast?: Value | null;
    /**
     *
     * @type {Value}
     * @memberof Value
     */
    $boolCast?: Value | null;
    /**
     *
     * @type {string}
     * @memberof Value
     */
    $dateTimeCast?: string;
    /**
     *
     * @type {string | DateTimeOperand}
     * @memberof Value
     */
    $timeCast?: string | DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof Value
     */
    $dayOfWeek?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof Value
     */
    $dayOfMonth?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof Value
     */
    $month?: DateTimeOperand | null;
    /**
     *
     * @type {DateTimeOperand}
     * @memberof Value
     */
    $year?: DateTimeOperand | null;
}
/**
 *
 * @export
 * @interface ValueList
 */
export interface ValueList {
    /**
     *
     * @type {Array<ValueReferencePair>}
     * @memberof ValueList
     */
    valueReferencePairs: Array<ValueReferencePair>;
}
/**
 *
 * @export
 * @interface ValueReferencePair
 */
export interface ValueReferencePair {
    /**
     *
     * @type {string}
     * @memberof ValueReferencePair
     */
    value: string;
    /**
     *
     * @type {Reference}
     * @memberof ValueReferencePair
     */
    valueId?: Reference;
}
