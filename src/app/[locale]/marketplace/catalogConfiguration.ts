export type CatalogConfigurationType = {
    manufacturerLogo: string;
    articleCount: number;
    repositoryUrl: string;
};

export type CatalogConfigurationDictionary = {
    [manufacturerName: string]: CatalogConfigurationType;
};

export const CatalogConfiguration: CatalogConfigurationDictionary = {
    kostal: {
        manufacturerLogo: '/images/kostal.png',
        articleCount: 2345,
        repositoryUrl: 'http://92.205.177.115:8080', // TODO whats the correct link for the kostal repo?
    },
    coroflex: {
        manufacturerLogo: '/images/coroflex.png',
        articleCount: 295,
        repositoryUrl: 'https://api.mnestix.xitaso.net/repo',
    },
    komax: {
        manufacturerLogo: '/images/komax.png',
        articleCount: 645,
        repositoryUrl: 'https://c1.api.wago.com/smartdata-aas-env',
    },
};
