import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { EClassFilter } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { ProductCategoryFilter } from 'app/[locale]/marketplace/catalog/_components/ProductCategoryFilter';
import { useState } from 'react';
import { GenericClassificationFilter } from 'app/[locale]/marketplace/catalog/_components/GenericClassificationFilter';
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
    GENERIC: Record<string, Set<string>>;
    PRODUCT_ROOT: ProductRoot[];
};

export function FilterContainer(props: { onFilterChanged(query: FilterQuery[]): void; aasSearcherUrl: string }) {
    const t = useTranslations('pages.catalog');
    const [activeFilters, setActiveFilters] = useState<FilterQuery[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>();
    const [resetTrigger, setResetTrigger] = useState(false);
    const { showError } = useShowError();
    const params = useParams();
    const locale = params?.locale as string;

    useAsyncEffect(async () => {
        setLoading(true);
        const results = await searchProducts(undefined, props.aasSearcherUrl);

        if (results.isSuccess) {
            const products = results.result;
            const eclassSet = new Set<string>();
            const genericSet: Record<string, Set<string>> = {};
            const productRoot: ProductRoot[] = [];

            products.forEach((product) => {
                product.productClassifications.forEach((classification) => {
                    if (classification.system === 'ECLASS' && classification.productId) {
                        eclassSet.add(classification.productId);
                    }
                    if (classification.system !== 'ECLASS' && classification.productId) {
                        if (!genericSet[classification.system]) {
                            genericSet[classification.system] = new Set<string>();
                        }
                        genericSet[classification.system].add(classification.productId);
                    }
                });
            });
            products.forEach((product) => {
                let rootName = product.productRoot?.mlValues.find((value) => value.language === locale)?.text;
                if (!rootName) {
                    if (product.productRoot?.mlValues?.length) {
                        // Fallback to the first available language if the specified locale is not found
                        rootName = product.productRoot.mlValues[0].text || 'Unknown Root';
                    } else {
                        rootName = 'Unknown Root';
                    }
                }
                let root = productRoot.find((r) => r.name === rootName);
                if (!root) {
                    root = { name: rootName, ProductFamilies: [] };
                    productRoot.push(root);
                }
                let familyName = product.productFamily?.mlValues.find((family) => family.language === locale)?.text;
                if (!familyName) {
                    if (product.productFamily?.mlValues?.length) {
                        // Fallback to the first available language if the specified locale is not found
                        familyName = product.productFamily.mlValues[0].text || 'Unknown Family';
                    } else {
                        familyName = 'Unknown Family';
                    }
                }
                let familyItem = root.ProductFamilies.find((f) => f.name === familyName);
                if (!familyItem) {
                    familyItem = { name: familyName, ProductDesignations: [] };
                    root.ProductFamilies.push(familyItem);
                }
                let designationName = product.productDesignation?.mlValues.find(
                    (des) => des.language === (locale ?? 'en'),
                )?.text;
                if (!designationName) {
                    if (product.productDesignation?.mlValues?.length) {
                        // Fallback to the first available language if the specified locale is not found
                        designationName = product.productDesignation.mlValues[0].text || 'Unknown Designation';
                    } else {
                        designationName = 'Unknown Designation';
                    }
                }
                let desItem = familyItem.ProductDesignations.find((f) => f.name === designationName);
                if (!desItem) {
                    desItem = { name: designationName };
                    familyItem.ProductDesignations.push(desItem);
                }
            });

            setFilterOptions({
                ECLASS: eclassSet,
                GENERIC: genericSet,
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
    const GenericFilters = filterOptions?.GENERIC
        ? Object.fromEntries(
              Object.entries(filterOptions?.GENERIC).map(([key, valueSet]) => [key, Array.from(valueSet)]),
          )
        : [];

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
                    filter.key !== 'PRODUCT_DESIGNATION',
            );
            return [...filtered, ...query];
        });
    }

    function applyFilter(reset = false) {
        console.log(activeFilters);
        if (reset) {
            setActiveFilters([]);
            props.onFilterChanged([]);
        } else {
            props.onFilterChanged(activeFilters);
        }
    }

    return (
        <Box>
            {loading ? (
                <CenteredLoadingSpinner />
            ) : (
                <>
                    <Box display="flex" gap={1} justifyContent="space-between">
                        <Typography variant="h4" fontWeight={600} mb={1}>
                            {t('filter')}
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Button variant="contained" type="button" onClick={() => applyFilter()}>
                                Apply
                            </Button>
                            <Button
                                variant="outlined"
                                type="button"
                                onClick={() => {
                                    setResetTrigger((prev) => !prev);
                                    applyFilter(true);
                                }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Box>
                    {eClassFilters.length > 0 && (
                        <EClassFilter
                            eClassFilters={eClassFilters}
                            defaultOpen={true}
                            onFilterChanged={(values) =>
                                onFilterChangedByCategory(
                                    'ECLASS',
                                    values.map((f) => f.value),
                                )
                            }
                            resetFilters={resetTrigger}
                        />
                    )}
                    {GenericFilters &&
                        Object.keys(GenericFilters).length > 0 &&
                        Object.entries(GenericFilters).map(([key, values]) => (
                            <GenericClassificationFilter
                                key={key}
                                filterSystem={key}
                                filters={values}
                                onFilterChanged={(values) =>
                                    onFilterChangedByCategory(
                                        key,
                                        values.map((f) => f.value),
                                    )
                                }
                                resetFilters={resetTrigger}
                                defaultOpen={true}
                            />
                        ))}
                    <ProductCategoryFilter
                        productCategoryFilters={transformProductCategories(productCategoryFilters)}
                        onFilterChanged={(values) => onFilterClassificationChangedCategory(values)}
                        resetFilters={resetTrigger}
                        defaultOpen={true}
                    />
                </>
            )}
        </Box>
    );
}
