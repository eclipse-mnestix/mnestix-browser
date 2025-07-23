import {
    AdministrativeInformation,
    Extension,
    LangStringNameType,
    LangStringTextType,
    Reference,
    SpecificAssetId,
} from 'lib/api/aas/models';

/*
 * ---------------------------------------------------------------
 * ## INTERFACES WERE GENERATED VIA SWAGGER-TYPESCRIPT-API      ##
 * ## AND ADJUSTED TO USE AAS-CORE3.0-typescript/types          ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
export interface AssetAdministrationShellDescriptor {
    description?: LangStringTextType[];
    displayName?: LangStringNameType[];
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    extensions?: Extension[];
    administration?: AdministrativeInformation;
    assetKind?: 'Instance' | 'NotApplicable' | 'Type';
    /**
     * @minLength 1
     * @maxLength 2000
     * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]*$
     */
    assetType?: string;
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    endpoints?: Endpoint[];
    /**
     * @minLength 1
     * @maxLength 2000
     * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]*$
     */
    globalAssetId?: string;
    /**
     * @minLength 0
     * @maxLength 128
     */
    idShort?: string;
    /**
     * @minLength 1
     * @maxLength 2000
     * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]*$
     */
    id: string;
    specificAssetIds?: SpecificAssetId[];
    submodelDescriptors?: SubmodelDescriptor[];
}

export interface SubmodelDescriptor {
    description?: LangStringTextType[];
    displayName?: LangStringNameType[];
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    extensions?: Extension[];
    administration?: AdministrativeInformation;
    /**
     * @minLength 0
     * @maxLength 128
     */
    idShort?: string;
    /**
     * @minLength 1
     * @maxLength 2000
     * @pattern ^[\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]*$
     */
    id: string;
    semanticId?: Reference;
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    supplementalSemanticId?: Reference[];
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    endpoints: Endpoint[];
}

export interface Endpoint {
    /**
     * @minLength 0
     * @maxLength 128
     */
    interface: string;
    protocolInformation: ProtocolInformation;
}

export interface ProtocolInformation {
    /**
     * @minLength 0
     * @maxLength 2048
     */
    href: string;
    /**
     * @minLength 0
     * @maxLength 128
     */
    endpointProtocol?: string;
    endpointProtocolVersion?: string[];
    /**
     * @minLength 0
     * @maxLength 128
     */
    subprotocol?: string;
    /**
     * @minLength 0
     * @maxLength 128
     */
    subprotocolBody?: string;
    /**
     * @minLength 0
     * @maxLength 128
     */
    subprotocolBodyEncoding?: string;
    /**
     * @maxItems 2147483647
     * @minItems 1
     */
    securityAttributes?: ProtocolInformationSecurityAttributes[];
}

export interface ProtocolInformationSecurityAttributes {
    type: 'NONE' | 'RFC_TLSA' | 'W3C_DID';
    key: string;
    value: string;
}

export interface RegistryAasData {
    submodelDescriptors?: SubmodelDescriptor[];
    aasRegistryRepositoryOrigin?: string;
}
