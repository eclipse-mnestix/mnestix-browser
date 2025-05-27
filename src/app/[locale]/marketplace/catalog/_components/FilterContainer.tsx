import { Box, Checkbox, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { EClassFilter } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { ProductCategoryFilter } from 'app/[locale]/marketplace/catalog/_components/ProductCategoryFilter';
import { searchProducts } from 'lib/api/graphql/catalogActions';
import { useState } from 'react';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';

export interface FilterQuery {
    key: string;
    value: boolean;
}

export function FilterContainer() {
    const t = useTranslations('pages.catalog');
    const [loading, setLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterQuery[]>([]);

    // This dummy filters needs to be replaced with actual data fetching logic
    const productCategoryFilters = [
        {
            ProductRoot: {
                name: 'Coroflex High-Voltage Cable',
                ProductFamilies: [
                    {
                        name: 'Shielded Single-Core Cable',
                        ProductDesignations: [
                            { name: 'Coroflex High-Voltage Cable 1x120mm²' },
                            { name: 'Coroflex High-Voltage Cable 1x240mm²' },
                            { name: 'Coroflex High-Voltage Cable 1x400mm²' },
                            { name: 'Coroflex High-Voltage Cable 1x630mm²' },
                            { name: 'Coroflex High-Voltage Cable 1x800mm²' },
                            { name: 'Coroflex High-Voltage Cable 1x1000mm²' },
                        ],
                    },
                    {
                        name: 'Shielded Multi-Core Cable',
                        ProductDesignations: [{ name: 'Coroflex High-Voltage Cable 3x120mm²' }],
                    },
                ],
            },
        },
        {
            ProductRoot: {
                name: 'CONNECT_TERMINALS',
                ProductFamilies: [
                    {
                        name: 'DLK 1,2',
                        ProductDesignations: [{ name: 'DLK 1,2' }],
                    },
                ],
            },
        },
    ];
    const eClassFilters = [
        '27-14-01-01',
        '27-14-01-02',
        '27-14-01-03',
        '27-14-01-04',
        '27-14-01-05',
        '27-14-01-06',
        '44-04-01-91',
        '44-05-01-91',
    ];
    const VECFilters = ['PrimaryPartType_Wire', 'PrimaryPartType_PluggableTerminal'];

    // process productCategoryFilters to match the expected structure
    function addBooleanValues<T extends { name: string }>(item: T): T & { value: boolean } {
        return {
            ...item,
            value: false
        };
    }

    function transformProductCategories(categories: typeof productCategoryFilters) {
        return categories.map(category => ({
            ProductRoot: {
                ...addBooleanValues(category.ProductRoot),
                ProductFamilies: category.ProductRoot.ProductFamilies.map(family => ({
                    ...addBooleanValues(family),
                    ProductDesignations: family.ProductDesignations.map(designation =>
                        addBooleanValues(designation)
                    )
                }))
            }
        }));
    }

    async function onFilterChanged(query: FilterQuery) {
        try {
            setLoading(true);
            const newFilters = activeFilters.filter(f => f.key !== query.key);
            if (query.value) {
                newFilters.push(query);
            }
            setActiveFilters(newFilters);

            const results = await searchProducts(newFilters);
            // Handle results...
            console.log('Search results:', results);

        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <CenteredLoadingSpinner />;
    }

    return (
        <>
            <Typography variant="h4" fontWeight={600} mb={1}>
                {t('filter')}
            </Typography>
            <EClassFilter eClassFilters={eClassFilters} onFilterChanged={onFilterChanged}/>
            <SimpleTreeView>
                <TreeItem
                    itemId="vec"
                    label={
                        <Typography variant="h5" my={1}>
                            VEC
                        </Typography>
                    }
                >
                    {VECFilters.map((vec) => {
                        return (
                            <Box key={vec} display="flex" alignItems="center">
                                <Checkbox />
                                <Typography>{vec.replace('PrimaryPartType_', '')}</Typography>
                            </Box>
                        );
                    })}
                </TreeItem>
            </SimpleTreeView>
            <ProductCategoryFilter productCategoryFilters={transformProductCategories(productCategoryFilters)} onFilterChanged={onFilterChanged}/>
        </>
    );
}
