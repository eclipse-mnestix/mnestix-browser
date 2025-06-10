'use client';

import { Box, Card, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ListHeader from 'components/basics/ListHeader';
import { useTranslations } from 'next-intl';
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
import SearchIcon from '@mui/icons-material/Search';
import { getRepositoryConfigurationGroupByName } from 'lib/services/database/connectionServerActions';
import { MnestixConnection } from '@prisma/client';

export default function Page() {
    const params = useSearchParams();
    const t = useTranslations('pages.catalog');
    const manufacturerUrlParam = params.get('manufacturer');
    const repositoryUrlParam = params.get('repoUrl');

    const [products, setProducts] = useState<SearchResponseEntry[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [repositoryUrl, setRepositoryUrl] = useState<string | undefined>(undefined);
    const [connection, setConnection] = useState<MnestixConnection | undefined>(undefined);
    const [fallbackToAasList, setFallbackToAasList] = useState<boolean>(false);
    const { showError } = useShowError();

    /**
     * When loading this page we need to fetch the following data:
     * 1. Connection Data from the Database
     * 2. Load Filter Parameters (done inside the Filter Component)
     * 3. Load Products from the AAS Searcher
     */
    useAsyncEffect(async () => {
        const connection = await fetchManufacturerData();
        if (connection && !connection.aasSearcher) {
            setFallbackToAasList(true);
        } else if (connection && connection.aasSearcher) {
            await loadData(connection.aasSearcher);
        }
        setLoading(false);
    }, []);

    const fetchManufacturerData = async () => {
        if (repositoryUrlParam) {
            setRepositoryUrl(repositoryUrlParam);
            const emptyConnection = {
                url: repositoryUrlParam,
                name: repositoryUrlParam,
                id: '',
                typeId: '',
                aasSearcher: null,
                image: null,
            };
            setConnection(emptyConnection);
            return emptyConnection;
        } else if (manufacturerUrlParam) {
            const connection = await getRepositoryConfigurationGroupByName(manufacturerUrlParam);
            if (connection) {
                setRepositoryUrl(connection.url);
                setConnection(connection);
                return connection;
            }
        }
        showError('No Manufacturer/Repository found');
        return;
    };

    const breadcrumbLinks = getCatalogBreadcrumbs(t, manufacturerUrlParam);

    const loadData = async (aasSearcher?: string, filters?: { key: string; value: string }[]) => {
        setLoading(true);
        const results = await searchProducts(filters, aasSearcher ?? undefined);

        if (results.isSuccess) {
            const products = results.result;
            setProducts(products);
        } else {
            showError(results.message);
        }

        setLoading(false);
    };

    const onFilterChanged = async (filters: { key: string; value: string }[]) => {
        await loadData(connection?.aasSearcher ?? undefined, filters);
    };

    return (
        <Box width="90%" margin="auto" marginTop="1rem">
            <Box marginBottom="1em">
                <Breadcrumbs links={breadcrumbLinks} />
            </Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
                <ListHeader header={t('marketplaceTitle')} subHeader={t('marketplaceSubtitle')} />
                <TextField
                    disabled
                    variant="outlined"
                    placeholder={t('searchPlaceholder')}
                    sx={{ marginLeft: '3rem', width: 320 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: '0.5rem' }}>
                                    <SearchIcon fontSize="small" />
                                </Box>
                            ),
                        },
                    }}
                />
                <Box flex={1} />
                {connection && connection.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={connection.image}
                        alt={`${manufacturerUrlParam} Logo`}
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
                    {!fallbackToAasList && connection && connection.aasSearcher ? (
                        <FilterContainer onFilterChanged={onFilterChanged} aasSearcherUrl={connection.aasSearcher} />
                    ) : loading ? (
                        <CenteredLoadingSpinner />
                    ) : (
                        <Box>
                            <Typography variant="h4" fontWeight={600} mb={1}>
                                {t('filter')}
                            </Typography>
                            <Typography mt={2}>{t('noSearcherWarning')}</Typography>
                        </Box>
                    )}
                </Card>
                <Box flex={1} minWidth={0}>
                    {loading ? (
                        <CenteredLoadingSpinner />
                    ) : !fallbackToAasList && connection ? (
                        <Card>
                            <ProductList
                                shells={products}
                                repositoryUrl={connection.url}
                                updateSelectedAasList={() => {}}
                            />
                        </Card>
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
