'use client';

import { Box, Card } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ListHeader from 'components/basics/ListHeader';
import { useTranslations } from 'next-intl';
import { CatalogConfiguration } from 'app/[locale]/marketplace/catalogConfiguration';
import Image from 'next/image';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { getCatalogBreadcrumbs } from 'app/[locale]/marketplace/_components/breadcrumbs';
import { FilterContainer } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { getProducts } from 'lib/api/graphql/catalogActions';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import ProductList from 'app/[locale]/marketplace/catalog/_components/List/ProductList';
import { useState } from 'react';
import { SearchResponse } from 'lib/api/graphql/catalogQueries';

export default function Page() {
    const params = useSearchParams();
    const t = useTranslations('pages.catalog');
    const manufacturer = params.get('manufacturer');
    const [products, setProducts] = useState<SearchResponse>();

    useAsyncEffect(async () => {
        if (!manufacturer) {
            return;
        }
        const products: SearchResponse = await getProducts();
        setProducts(products);
    }, []);


    if (!manufacturer) {
        return <>No Manufacturer found</>;
    }
    const config = CatalogConfiguration[manufacturer];
    const breadcrumbLinks = getCatalogBreadcrumbs(t, manufacturer);

    return (
        <Box width="90%" margin="auto" marginTop="1rem">
            <Box marginBottom="1em">
                <Breadcrumbs links={breadcrumbLinks} />
            </Box>
            <Box display="flex" justifyContent="space-between">
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                {config?.manufacturerLogo && (
                    <Box ml={2} display="flex" alignItems="center">
                        <Image
                            src={config?.manufacturerLogo}
                            alt={`${manufacturer} Logo`}
                            height={48}
                            width={120}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                )}
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" marginBottom="1.5rem">
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
                    <FilterContainer />
                </Card>
                <Box flex={1} minWidth={0}>
                    <ProductList shells={products} repositoryUrl={config.repositoryUrl} updateSelectedAasList={() => {}}/>
                </Box>
            </Box>
        </Box>
    );
}
