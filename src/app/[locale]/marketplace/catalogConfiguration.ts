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
        repositoryUrl: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    },
    coroflex: {
        manufacturerLogo: '/images/coroflex.png',
        articleCount: 295,
        repositoryUrl: 'https://vws4ls-api.dev.mnestix.xitaso.net/repo',
    },
    komax: {
        manufacturerLogo: '/images/komax.png',
        articleCount: 645,
        repositoryUrl: 'https://api.komax.dev.mnestix.xitaso.net/repo',
    },
};
