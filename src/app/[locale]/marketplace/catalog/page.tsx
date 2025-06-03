'use client';

import { Box, Card, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ListHeader from 'components/basics/ListHeader';
import { useTranslations } from 'next-intl';
import { CatalogConfiguration } from 'app/[locale]/marketplace/catalogConfiguration';
import Image from 'next/image';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { getCatalogBreadcrumbs } from 'app/[locale]/marketplace/_components/breadcrumbs';
import { FilterContainer } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { searchProducts } from 'lib/api/graphql/catalogActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import ProductList from 'app/[locale]/marketplace/catalog/_components/List/ProductList';
import { useState } from 'react';
import { SearchResponseEntry } from 'lib/api/graphql/catalogQueries';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { useShowError } from 'lib/hooks/UseShowError';
import AasListDataWrapper from 'app/[locale]/list/_components/AasListDataWrapper';

export default function Page() {
    const params = useSearchParams();
    const t = useTranslations('pages.catalog');
    const manufacturer = params.get('manufacturer');
    const repositoryUrlParam = params.get('repoUrl');

    const [products, setProducts] = useState<SearchResponseEntry[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const { showError } = useShowError();

    useAsyncEffect(async () => {
        if (!manufacturer) {
            return;
        }
        await loadData();
    }, []);

    // Determine the repositoryUrl to use
    let repositoryUrl: string | undefined = undefined;
    let config = undefined;

    if (repositoryUrlParam) {
        repositoryUrl = repositoryUrlParam;
    } else if (manufacturer) {
        config = CatalogConfiguration[manufacturer];
        repositoryUrl = config?.repositoryUrl;
    }
    if (!repositoryUrl) {
        return <>No Manufacturer/Repository found</>;
    }
    const breadcrumbLinks = getCatalogBreadcrumbs(t, manufacturer);

    const loadData = async (filters?: { key: string; value: string }[]) => {
        setLoading(true);
        const results = await searchProducts(filters);

        if (results.isSuccess) {
            console.log(filters);
            const products = results.result;
            setProducts(products);
        } else {
            showError(results.message);
        }

        setLoading(false);
    };

    const onFilterChanged = async (filters: { key: string; value: string }[]) => {
        await loadData(filters);
    };

    return (
        <Box width="90%" margin="auto" marginTop="1rem">
            <Box marginBottom="1em">
                <Breadcrumbs links={breadcrumbLinks} />
            </Box>
            <Box display="flex" justifyContent="space-between">
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />

                <Box ml={2} display="flex" alignItems="center">
                    {config && config.manufacturerLogo ? (
                        <Image
                            src={config.manufacturerLogo}
                            alt={`${manufacturer} Logo`}
                            height={48}
                            width={120}
                            style={{ objectFit: 'contain', marginRight: '1rem' }}
                        />
                    ) : (
                        <Typography variant="h6" color="textSecondary">
                            {repositoryUrl}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" marginBottom="1.5rem">
                <Card
                    sx={{
                        minHeight: 480,
                        minWidth: 250,
                        maxWidth: 340,
                        marginBottom: 'auto',
                        p: 2,
                        boxShadow: 1,
                        borderRadius: 1,
                        mr: 3,
                    }}
                    aria-label={t('filter')}
                >
                    {config ? (
                        <FilterContainer onFilterChanged={onFilterChanged} />
                    ) : (<Box>
                            <Typography variant="h4" fontWeight={600} mb={1}>
                                {t('filter')}
                            </Typography>
                            <Typography mt={2}>
                                {t('noSearcherWarning')}
                            </Typography>
                    </Box>
                    )}
                </Card>
                <Box flex={1} minWidth={0}>
                    {manufacturer && config ? (
                        loading ? (
                            <CenteredLoadingSpinner />
                        ) : (
                            <Card>
                                <ProductList
                                    shells={products}
                                    repositoryUrl={config.repositoryUrl}
                                    updateSelectedAasList={() => {}}
                                />
                            </Card>
                        )
                    ) : (
                        <Box>
                            <AasListDataWrapper repositoryUrl={repositoryUrl} hideRepoSelection={true} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
