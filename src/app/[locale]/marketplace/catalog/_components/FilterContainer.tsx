import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { EClassFilter } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { ProductCategoryFilter } from 'app/[locale]/marketplace/catalog/_components/ProductCategoryFilter';
import { useState } from 'react';
import { VecFilter } from 'app/[locale]/marketplace/catalog/_components/VecFilter';

export interface FilterQuery {
    key: string;
    value: string;
}

export function FilterContainer(props: { onFilterChanged(query: FilterQuery[]): void }) {
    const t = useTranslations('pages.catalog');
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
        '44-04-01-92',
    ];
    const VECFilters = ['PrimaryPartType_Wire', 'PrimaryPartType_PluggableTerminal'];

    // process productCategoryFilters to match the expected structure
    function addBooleanValues<T extends { name: string }>(item: T): T & { value: boolean } {
        return {
            ...item,
            value: false,
        };
    }

    function transformProductCategories(categories: typeof productCategoryFilters) {
        return categories.map((category) => ({
            ProductRoot: {
                ...addBooleanValues(category.ProductRoot),
                ProductFamilies: category.ProductRoot.ProductFamilies.map((family) => ({
                    ...addBooleanValues(family),
                    ProductDesignations: family.ProductDesignations.map((designation) => addBooleanValues(designation)),
                })),
            },
        }));
    }

    async function onFilterChanged(queries: FilterQuery[]) {
        const updatedFilters = activeFilters
            .filter((filter) => queries.some((query) => query.key === filter.key))
            .concat(queries);
        setActiveFilters(updatedFilters);
    }

    function applyFilter() {
        console.log(activeFilters)
        props.onFilterChanged(activeFilters);
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight={600} mb={1}>
                {t('filter')}
            </Typography>
            <EClassFilter eClassFilters={eClassFilters} onFilterChanged={onFilterChanged} />
            <VecFilter vecFilters={VECFilters} onFilterChanged={onFilterChanged}/>
            <ProductCategoryFilter
                productCategoryFilters={transformProductCategories(productCategoryFilters)}
                onFilterChanged={onFilterChanged}
            />
            <Button sx={{ mt: 3 }} variant="contained" onClick={applyFilter}>Apply Filter</Button>
        </Box>
    );
}
