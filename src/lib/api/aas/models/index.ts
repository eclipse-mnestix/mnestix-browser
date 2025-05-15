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
    templateId?: string;
}
/**
 *
 * @export
 * @interface AdministrativeInformationAllOfRevision
 */
export interface AdministrativeInformationAllOfRevision {}
/**
 *
 * @export
 * @interface AdministrativeInformationAllOfVersion
 */
export interface AdministrativeInformationAllOfVersion {}
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
     * @type {string}
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
    first: Reference;
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElement
     */
    second: Reference;
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
 * @interface AnnotatedRelationshipElementMetadata
 */
export interface AnnotatedRelationshipElementMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    category?: string;
    /**
     *
     * @type {Referable1AllOfIdShort}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    idShort?: Referable1AllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    modelType: 'AnnotatedRelationshipElement';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier1>}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    qualifiers?: Array<Qualifier1>;
    /**
     *
     * @type {ModellingKind}
     * @memberof AnnotatedRelationshipElementMetadata
     */
    kind?: ModellingKind;
}

/**
 *
 * @export
 * @interface AnnotatedRelationshipElementValue
 */
export interface AnnotatedRelationshipElementValue {
    /**
     *
     * @type {ReferenceValue}
     * @memberof AnnotatedRelationshipElementValue
     */
    first: ReferenceValue;
    /**
     *
     * @type {ReferenceValue}
     * @memberof AnnotatedRelationshipElementValue
     */
    second: ReferenceValue;
    /**
     *
     * @type {Array<object>}
     * @memberof AnnotatedRelationshipElementValue
     */
    annotations?: Array<object>;
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
     * @type {string}
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
    Instance: 'Instance',
    NotApplicable: 'NotApplicable',
    Type: 'Type',
} as const;
export type AssetKind = (typeof AssetKind)[keyof typeof AssetKind];

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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof BasicEventElementMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof BasicEventElementMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {ReferenceValue}
     * @memberof BasicEventElementValue
     */
    observed: ReferenceValue;
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
     * @type {string}
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
    contentType: BlobAllOfContentType;
}
/**
 *
 * @export
 * @interface BlobAllOfContentType
 */
export interface BlobAllOfContentType {}
/**
 *
 * @export
 * @interface BlobMetadata
 */
export interface BlobMetadata {
    /**
     *
     * @type {Array<Extension>}
     * @memberof BlobMetadata
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof BlobMetadata
     */
    category?: string;
    /**
     *
     * @type {Referable1AllOfIdShort}
     * @memberof BlobMetadata
     */
    idShort?: Referable1AllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof BlobMetadata
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof BlobMetadata
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof BlobMetadata
     */
    modelType: 'Blob';
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof BlobMetadata
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
    /**
     *
     * @type {Reference}
     * @memberof BlobMetadata
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof BlobMetadata
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier1>}
     * @memberof BlobMetadata
     */
    qualifiers?: Array<Qualifier1>;
    /**
     *
     * @type {ModellingKind}
     * @memberof BlobMetadata
     */
    kind?: ModellingKind;
}

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
    contentType: string;
    /**
     *
     * @type {string}
     * @memberof BlobValue
     */
    value?: string;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof CapabilityMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof CapabilityMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {string}
     * @memberof ConceptDescription
     */
    modelType: string;
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
 * @interface DataElement
 */
export interface DataElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof DataElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof DataElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof DataElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof DataElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof DataElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof DataElement
     */
    modelType: ModelType;
    /**
     *
     * @type {Reference}
     * @memberof DataElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof DataElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof DataElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof DataElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
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
 *
 * @export
 * @interface DataSpecificationIec61360
 */
export interface DataSpecificationIec61360 {
    /**
     *
     * @type {string}
     * @memberof DataSpecificationIec61360
     */
    modelType: string;
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
     * @type {DataSpecificationIec61360}
     * @memberof EmbeddedDataSpecification
     */
    dataSpecificationContent: DataSpecificationIec61360;
    /**
     *
     * @type {Reference}
     * @memberof EmbeddedDataSpecification
     */
    dataSpecification: Reference;
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
     * @type {string}
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
    entityType: EntityType;
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
     * @type {Referable1AllOfIdShort}
     * @memberof EntityMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof EntityMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
    entityType: EntityType;
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
     *
     * @type {Array<object>}
     * @memberof EntityValue
     */
    statements?: Array<object>;
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
 *
 * @export
 * @interface EventElement
 */
export interface EventElement {
    /**
     *
     * @type {Array<Extension>}
     * @memberof EventElement
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof EventElement
     */
    category?: string;
    /**
     *
     * @type {ReferableAllOfIdShort}
     * @memberof EventElement
     */
    idShort?: ReferableAllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof EventElement
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof EventElement
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof EventElement
     */
    modelType: ModelType;
    /**
     *
     * @type {Reference}
     * @memberof EventElement
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof EventElement
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {Array<Qualifier>}
     * @memberof EventElement
     */
    qualifiers?: Array<Qualifier>;
    /**
     *
     * @type {Array<EmbeddedDataSpecification>}
     * @memberof EventElement
     */
    embeddedDataSpecifications?: Array<EmbeddedDataSpecification>;
}

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
 * @interface FileAllOfContentType
 */
export interface FileAllOfContentType {}
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
     * @type {Referable1AllOfIdShort}
     * @memberof FileMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof FileMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
    contentType: string;
    /**
     *
     * @type {string}
     * @memberof FileValue
     */
    value: string;
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
     * The ValueOnly serialization (patternProperties and propertyNames will be supported probably with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
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
 * @interface HasKind1
 */
export interface HasKind1 {
    /**
     *
     * @type {ModellingKind}
     * @memberof HasKind1
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
 *
 * @export
 * @interface HasSemantics1
 */
export interface HasSemantics1 {
    /**
     *
     * @type {Reference}
     * @memberof HasSemantics1
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof HasSemantics1
     */
    supplementalSemanticIds?: Array<Reference>;
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
     * @type {string}
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
     * @type {string}
     * @memberof ModelFile
     */
    value?: string;
    /**
     *
     * @type {FileAllOfContentType}
     * @memberof ModelFile
     */
    contentType: FileAllOfContentType;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof MultiLanguagePropertyMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof MultiLanguagePropertyMetadata
     */
    qualifiers?: Array<Qualifier1>;
    /**
     *
     * @type {ModellingKind}
     * @memberof MultiLanguagePropertyMetadata
     */
    kind?: ModellingKind;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof OperationMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof OperationMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
 * @interface OperationRequestValueOnly
 */
export interface OperationRequestValueOnly {
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will be supported probably with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestValueOnly
     */
    inoutputArguments?: object;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will be supported probably with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationRequestValueOnly
     */
    inputArguments?: object;
    /**
     *
     * @type {string}
     * @memberof OperationRequestValueOnly
     */
    clientTimeoutDuration: string;
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
     * The ValueOnly serialization (patternProperties and propertyNames will be supported probably with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
     * @type {object}
     * @memberof OperationResultValueOnly
     */
    inoutputArguments?: object;
    /**
     * The ValueOnly serialization (patternProperties and propertyNames will be supported probably with OpenApi 3.1). For the full description of the generic JSON validation schema see the ValueOnly-Serialization as defined in the 'Specification of the Asset Administration Shell - Part 2'.
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof PropertyMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof PropertyMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
 * @interface Qualifiable1
 */
export interface Qualifiable1 {
    /**
     *
     * @type {Array<Qualifier1>}
     * @memberof Qualifiable1
     */
    qualifiers?: Array<Qualifier1>;
    /**
     *
     * @type {ModelType}
     * @memberof Qualifiable1
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
 * @interface Qualifier1
 */
export interface Qualifier1 {
    /**
     *
     * @type {Reference}
     * @memberof Qualifier1
     */
    semanticId?: Reference;
    /**
     *
     * @type {Array<Reference>}
     * @memberof Qualifier1
     */
    supplementalSemanticIds?: Array<Reference>;
    /**
     *
     * @type {QualifierKind}
     * @memberof Qualifier1
     */
    kind?: QualifierKind;
    /**
     *
     * @type {string}
     * @memberof Qualifier1
     */
    type: string;
    /**
     *
     * @type {DataTypeDefXsd}
     * @memberof Qualifier1
     */
    valueType: DataTypeDefXsd;
    /**
     *
     * @type {string}
     * @memberof Qualifier1
     */
    value?: string;
    /**
     *
     * @type {Reference}
     * @memberof Qualifier1
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof RangeMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof RangeMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {RangeValueType}
     * @memberof RangeValue
     */
    max?: RangeValueType;
    /**
     *
     * @type {RangeValueType}
     * @memberof RangeValue
     */
    min?: RangeValueType;
}
/**
 * @type RangeValueType
 *
 * @export
 */
export type RangeValueType = boolean | number | string;
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
 * @interface Referable1
 */
export interface Referable1 {
    /**
     *
     * @type {Array<Extension>}
     * @memberof Referable1
     */
    extensions?: Array<Extension>;
    /**
     *
     * @type {string}
     * @memberof Referable1
     */
    category?: string;
    /**
     *
     * @type {Referable1AllOfIdShort}
     * @memberof Referable1
     */
    idShort?: Referable1AllOfIdShort;
    /**
     *
     * @type {Array<LangStringNameType>}
     * @memberof Referable1
     */
    displayName?: Array<LangStringNameType>;
    /**
     *
     * @type {Array<LangStringTextType>}
     * @memberof Referable1
     */
    description?: Array<LangStringTextType>;
    /**
     *
     * @type {ModelType}
     * @memberof Referable1
     */
    modelType: ModelType;
}

/**
 *
 * @export
 * @interface Referable1AllOfIdShort
 */
export interface Referable1AllOfIdShort {}
/**
 *
 * @export
 * @interface ReferableAllOfIdShort
 */
export interface ReferableAllOfIdShort {}
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
     * @type {Array<Key>}
     * @memberof Reference
     */
    keys: Array<Key>;
    /**
     *
     * @type {ReferenceParent}
     * @memberof Reference
     */
    referredSemanticId?: ReferenceParent;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof ReferenceElementMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof ReferenceElementMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
 * @interface ReferenceElementValue
 */
export interface ReferenceElementValue {
    /**
     *
     * @type {ReferenceTypes}
     * @memberof ReferenceElementValue
     */
    type?: ReferenceTypes;
    /**
     *
     * @type {Array<Key>}
     * @memberof ReferenceElementValue
     */
    keys?: Array<Key>;
}

/**
 *
 * @export
 * @interface ReferenceParent
 */
export interface ReferenceParent {
    /**
     *
     * @type {ReferenceTypes}
     * @memberof ReferenceParent
     */
    type: ReferenceTypes;
    /**
     *
     * @type {Array<Key>}
     * @memberof ReferenceParent
     */
    keys: Array<Key>;
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
 * @interface ReferenceValue
 */
export interface ReferenceValue {
    /**
     *
     * @type {ReferenceTypes}
     * @memberof ReferenceValue
     */
    type?: ReferenceTypes;
    /**
     *
     * @type {Array<Key>}
     * @memberof ReferenceValue
     */
    keys?: Array<Key>;
}

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
     * @type {string}
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
    first: Reference;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElement
     */
    second: Reference;
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
    first: Reference;
    /**
     *
     * @type {Reference}
     * @memberof RelationshipElementAbstract
     */
    second: Reference;
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
     * @type {Referable1AllOfIdShort}
     * @memberof RelationshipElementMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof RelationshipElementMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {ReferenceValue}
     * @memberof RelationshipElementValue
     */
    first: ReferenceValue;
    /**
     *
     * @type {ReferenceValue}
     * @memberof RelationshipElementValue
     */
    second: ReferenceValue;
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
     *
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
    Off: 'off',
    On: 'on',
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
     * @type {string}
     * @memberof Submodel
     */
    modelType: string;
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
    supplementalSemanticId?: Array<Reference>;
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
     * @type {Referable1AllOfIdShort}
     * @memberof SubmodelElementAttributes
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof SubmodelElementAttributes
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof SubmodelElementCollectionMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof SubmodelElementCollectionMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
     * @type {string}
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
     * @type {Referable1AllOfIdShort}
     * @memberof SubmodelElementListMetadata
     */
    idShort?: Referable1AllOfIdShort;
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
     * @type {Array<Qualifier1>}
     * @memberof SubmodelElementListMetadata
     */
    qualifiers?: Array<Qualifier1>;
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
export type SubmodelElementMetadata =
    | AnnotatedRelationshipElementMetadata
    | BasicEventElementMetadata
    | BlobMetadata
    | CapabilityMetadata
    | EntityMetadata
    | FileMetadata
    | MultiLanguagePropertyMetadata
    | OperationMetadata
    | PropertyMetadata
    | RangeMetadata
    | ReferenceElementMetadata
    | RelationshipElementMetadata
    | SubmodelElementCollectionMetadata
    | SubmodelElementListMetadata;
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
    | ReferenceElementValue
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
    valueId: Reference;
}
