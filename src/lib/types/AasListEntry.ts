export type AasListEntry = {
    aasId: string;
    aasEndpoint?: string;
    assetId?: string;
    repositoryUrl?: string;
    discoveryUrl?: string;
    registryUrl?: string;
    thumbnailUrl?: string;
};
export type AasListConfig = {
    showThumbnail?: boolean;
    showAasId?: boolean;
    showAssetId?: boolean;
    showAasEndpoint?: boolean;
    showRepositoryUrl?: boolean;
    showDiscoveryUrl?: boolean;
    showRegistryUrl?: boolean;
};
