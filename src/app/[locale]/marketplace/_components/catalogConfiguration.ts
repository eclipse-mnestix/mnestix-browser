// src/app/catalog/catalogConfiguration.ts
/**
 * Configuration for manufacturer catalogs.
 * Can be extended or loaded from a database in the future.
 */
export type CatalogConfiguration = {
    catalogLogo: string;
    manufacturerName: string;
    articleCount: number;
    sourceRepository: string;
};

export const hardcodedCatalogConfiguration: CatalogConfiguration[] = [
    {
        catalogLogo: '/images/kostal.png',
        manufacturerName: 'kostal',
        articleCount: 2345,
        sourceRepository: 'http://92.205.177.115:8080',
    },
    {
        catalogLogo: '/images/coroflex.png',
        manufacturerName: 'coroflex',
        articleCount: 295,
        sourceRepository: 'https://api.mnestix.xitaso.net/repo',
    },
    {
        catalogLogo: '/images/komax.png',
        manufacturerName: 'komax',
        articleCount: 645,
        sourceRepository: 'https://c1.api.wago.com/smartdata-aas-env',
    },
];
