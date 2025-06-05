import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { EClassFilter } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { ProductCategoryFilter } from 'app/[locale]/marketplace/catalog/_components/ProductCategoryFilter';
import { useState } from 'react';
import { VecFilter } from 'app/[locale]/marketplace/catalog/_components/VecFilter';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { searchProducts } from 'lib/api/graphql/catalogActions';
import { useShowError } from 'lib/hooks/UseShowError';
import { useParams } from 'next/navigation';

export interface FilterQuery {
    key: string;
    value: string;
}

type ProductDesignation = {
    name: string;
};

type ProductFamily = {
    name: string;
    ProductDesignations: ProductDesignation[];
};

type ProductRoot = {
    name: string;
    ProductFamilies: ProductFamily[];
};

type FilterOptions = {
    ECLASS: Set<string>;
    VEC: Set<string>;
    PRODUCT_ROOT: ProductRoot[];
};

export function FilterContainer(props: { onFilterChanged(query: FilterQuery[]): void }) {
    const t = useTranslations('pages.catalog');
    const [activeFilters, setActiveFilters] = useState<FilterQuery[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>();
    const { showError } = useShowError();
    const params = useParams();
    const locale = params?.locale as string;

    useAsyncEffect(async () => {
        setLoading(true);
        const results = await searchProducts();

        if (results.isSuccess) {
            const products = results.result;
            const eclassSet = new Set<string>();
            const vecSet = new Set<string>();
            const productRoot: ProductRoot[] = [];

            products.forEach((product) => {
                product.productClassifications.forEach((classification) => {
                    if (classification.system === 'ECLASS' && classification.productId) {
                        eclassSet.add(classification.productId);
                    }
                    if (classification.system === 'VEC' && classification.productId) {
                        vecSet.add(classification.productId);
                    }
                });
            });
            products.forEach((product) => {
                const rootName =
                    product.productRoot?.mlValues.find((value) => value.language === (locale ?? 'en'))?.text ||
                    'Unknown Root';
                let root = productRoot.find((r) => r.name === rootName);
                if (!root) {
                    root = { name: rootName, ProductFamilies: [] };
                    productRoot.push(root);
                }
                const familyName =
                    product.productFamily?.mlValues.find((family) => family.language === (locale ?? 'en'))?.text ||
                    'Unknown Family';
                let familyItem = root.ProductFamilies.find((f) => f.name === familyName);
                if (!familyItem) {
                    familyItem = { name: familyName, ProductDesignations: [] };
                    root.ProductFamilies.push(familyItem);
                }
                const designationName =
                    product.productDesignation?.mlValues.find((des) => des.language === (locale ?? 'en'))?.text ||
                    'Unknown Designation';
                let desItem = familyItem.ProductDesignations.find((f) => f.name === designationName);
                if (!desItem) {
                    desItem = { name: designationName };
                    familyItem.ProductDesignations.push(desItem);
                }
            });

            setFilterOptions({
                ECLASS: eclassSet,
                VEC: vecSet,
                PRODUCT_ROOT: productRoot,
            });
            // Initialize active filters with ECLASS and VEC options
        } else {
            showError(results.message);
        }
        setLoading(false);
    }, []);

    const productCategoryFilters =
        filterOptions?.PRODUCT_ROOT?.map((root) => ({
            ProductRoot: {
                name: root.name,
                ProductFamilies: root.ProductFamilies.map((family) => ({
                    name: family.name,
                    ProductDesignations: family.ProductDesignations.map((designation) => ({
                        name: designation.name,
                    })).sort((a, b) => a.name.localeCompare(b.name)),
                })).sort((a, b) => a.name.localeCompare(b.name)),
            },
        })).sort((a, b) => a.ProductRoot.name.localeCompare(b.ProductRoot.name)) ?? [];
    const eClassFilters = filterOptions?.ECLASS ? Array.from(filterOptions.ECLASS) : [];
    const VECFilters = filterOptions?.VEC ? Array.from(filterOptions.VEC) : [];

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

    function onFilterChangedByCategory(key: string, values: string[]) {
        setActiveFilters((prevFilters) => {
            const filtered = prevFilters.filter((filter) => filter.key !== key);

            const newFilters = values.map((value) => ({ key, value }));
            return [...filtered, ...newFilters];
        });
    }

    function onFilterClassificationChangedCategory(query: FilterQuery[]) {
        setActiveFilters((prevFilters) => {
            const filtered = prevFilters.filter(
                (filter) =>
                    filter.key !== 'PRODUCT_ROOT' &&
                    filter.key !== 'PRODUCT_FAMILY' &&
                    filter.key !== 'PRODUCT_DESIGNATION'
            );
            return [...filtered, ...query];
        });    }

    function applyFilter() {
        console.log(activeFilters);
        props.onFilterChanged(activeFilters);
    }

    return (
        <Box>
            {loading ? (
                <CenteredLoadingSpinner />
            ) : (
                <>
                    <Typography variant="h4" fontWeight={600} mb={1}>
                        {t('filter')}
                    </Typography>
                    <EClassFilter
                        eClassFilters={eClassFilters}
                        onFilterChanged={(values) =>
                            onFilterChangedByCategory(
                                'ECLASS',
                                values.map((f) => f.value),
                            )
                        }
                    />
                    <VecFilter
                        vecFilters={VECFilters}
                        onFilterChanged={(values) =>
                            onFilterChangedByCategory(
                                'VEC',
                                values.map((f) => f.value),
                            )
                        }
                    />
                    <ProductCategoryFilter
                        productCategoryFilters={transformProductCategories(productCategoryFilters)}
                        onFilterChanged={(values) => onFilterClassificationChangedCategory(values)}
                    />
                    <Button sx={{ mt: 3 }} variant="contained" onClick={applyFilter}>
                        Apply Filter
                    </Button>
                </>
            )}
        </Box>
    );
}
