export type AasListEntry = {
    aasId: string;
    aasEndpoint?: string;
    assetId?: string;
    repositoryUrl?: string;
    discoveryUrl?: string;
    registryUrl?: string;
};
export type AasListConfig = {
    buttonTooltip?: string;
    
    showAasId?: boolean;
    showAssetId?: boolean;
    showAasEndpoint?: boolean;
    showRepositoryUrl?: boolean;
    showDiscoveryUrl?: boolean;
    showRegistryUrl?: boolean;
};