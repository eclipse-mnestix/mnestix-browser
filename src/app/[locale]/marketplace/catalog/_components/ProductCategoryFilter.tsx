import { useEffect, useState } from 'react';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, Typography } from '@mui/material';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';

interface ProductDesignation {
    name: string;
    value: boolean;
}

interface ProductFamily {
    name: string;
    value: boolean;
    ProductDesignations: ProductDesignation[];
}

interface ProductRoot {
    name: string;
    value: boolean;
    ProductFamilies: ProductFamily[];
}

interface ProductCategory {
    ProductRoot: ProductRoot;
}

export function ProductCategoryFilter(props: {
    productCategoryFilters: ProductCategory[];
    onFilterChanged(query: FilterQuery[]): void;
    resetFilters: boolean;
    defaultOpen: boolean;
}) {
    const [filters, setFilters] = useState<ProductCategory[]>(props.productCategoryFilters);

    useEffect(() => {
        // Collect all selected product roots, families, and designations
        const selected: FilterQuery[] = [];
        filters.forEach((category) => {
            if (category.ProductRoot.value) {
                selected.push({ key: 'PRODUCT_ROOT', value: category.ProductRoot.name });
            }
            category.ProductRoot.ProductFamilies.forEach((family) => {
                if (family.value) {
                    selected.push({ key: 'PRODUCT_FAMILY', value: family.name });
                }
                family.ProductDesignations.forEach((designation) => {
                    if (designation.value) {
                        selected.push({ key: 'PRODUCT_DESIGNATION', value: designation.name });
                    }
                });
            });
        });
        props.onFilterChanged(selected);
    }, [filters]);

    useEffect(() => {
        const resetFilters = props.productCategoryFilters.map((category) => ({
            ProductRoot: {
                ...category.ProductRoot,
                value: false,
                ProductFamilies: category.ProductRoot.ProductFamilies.map((family) => ({
                    ...family,
                    value: false,
                    ProductDesignations: family.ProductDesignations.map((designation) => ({
                        ...designation,
                        value: false,
                    })),
                })),
            },
        }));
        setFilters(resetFilters);
    }, [props.resetFilters]);

    function updateActiveFilters(
        prevFilters: ProductCategory[],
        node: ProductRoot | ProductFamily | ProductDesignation,
        isChecked: boolean,
        rootName?: string,
    ) {
        return prevFilters.map((category) => {
            // By default, all categories retain their previous state.
            // If a family or designation name matches in the root name,
            // it is marked as checked accordingly.
            // Therefore, we verify if the selected family or designation name matches the root name being checked.
            if (rootName !== undefined && category.ProductRoot.name !== rootName) {
                return category;
            }

            const isRootNode = category.ProductRoot.name === node.name;
            const updatedRoot = { ...category.ProductRoot };

            const updatedFamilies = updatedRoot.ProductFamilies.map((family) => {
                const isFamilyNode = family.name === node.name;

                if (isRootNode) {
                    return {
                        ...family,
                        value: isChecked,
                        ProductDesignations: family.ProductDesignations.map((designation) => ({
                            ...designation,
                            value: isChecked,
                        })),
                    };
                }

                if (isFamilyNode) {
                    return {
                        ...family,
                        value: isChecked,
                        ProductDesignations: family.ProductDesignations.map((designation) => ({
                            ...designation,
                            value: isChecked,
                        })),
                    };
                }

                const updatedDesignations = family.ProductDesignations.map((designation) => ({
                    ...designation,
                    value: designation.name === node.name ? isChecked : designation.value,
                }));

                const updatedFamily = {
                    ...family,
                    value: updatedDesignations.every((d) => d.value),
                    ProductDesignations: updatedDesignations,
                };

                return updatedFamily;
            });

            updatedRoot.value = updatedFamilies.every((family) => family.value);

            const categories = {
                ProductRoot: {
                    ...updatedRoot,
                    ProductFamilies: updatedFamilies,
                },
            };
            console.log(categories);

            return categories;
        });
    }

    function updateCheckboxState(
        node: ProductRoot | ProductFamily | ProductDesignation,
        isChecked: boolean,
        rootName?: string,
    ) {
        setFilters((prevFilters) => {
            const updatedFilters = updateActiveFilters(prevFilters, node, isChecked, rootName);
            return updatedFilters;
        });
    }

    return (
        <SimpleTreeView defaultExpandedItems={props.defaultOpen ? ['root'] : []}>
            <TreeItem
                itemId="root"
                label={
                    <Typography variant="h5" my={1}>
                        Product Root, Family and Designation
                    </Typography>
                }
            >
                {filters.map((productCategory) => {
                    return (
                        <TreeItem
                            key={productCategory.ProductRoot.name}
                            itemId={productCategory.ProductRoot.name}
                            label={
                                productCategory.ProductRoot.name.toLowerCase().startsWith('unknown') ? (
                                    <Box display="flex" alignItems="center" ml={5}>
                                        <Typography>{productCategory.ProductRoot.name}</Typography>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            onClick={(event) => event.stopPropagation()}
                                            checked={productCategory.ProductRoot.value}
                                            onChange={(event) =>
                                                updateCheckboxState(productCategory.ProductRoot, event.target.checked)
                                            }
                                            sx={{ padding: '4px' }}
                                        />
                                        {productCategory.ProductRoot.name}
                                    </Box>
                                )
                            }
                        >
                            {productCategory.ProductRoot.ProductFamilies.map((productFamily) => {
                                return (
                                    <TreeItem
                                        key={productCategory.ProductRoot.name + productFamily.name}
                                        itemId={productCategory.ProductRoot.name + productFamily.name}
                                        label={
                                            productFamily.name.toLowerCase().startsWith('unknown') ? (
                                                <Box display="flex" alignItems="center" ml={5}>
                                                    <Typography>{productFamily.name}</Typography>
                                                </Box>
                                            ) : (
                                                <Box display="flex" alignItems="center">
                                                    <Checkbox
                                                        onClick={(event) => event.stopPropagation()}
                                                        checked={productFamily.value}
                                                        onChange={(event) =>
                                                            updateCheckboxState(
                                                                productFamily,
                                                                event.target.checked,
                                                                productCategory.ProductRoot.name,
                                                            )
                                                        }
                                                        sx={{ padding: '4px' }}
                                                    />
                                                    {productFamily.name}
                                                </Box>
                                            )
                                        }
                                    >
                                        {productFamily.ProductDesignations.map((productDesignation) => {
                                            return (
                                                <Box
                                                    key={productFamily.name + productDesignation.name}
                                                    display="flex"
                                                    alignItems="center"
                                                    ml={4}
                                                >
                                                    <Checkbox
                                                        checked={productDesignation.value}
                                                        onChange={(event) =>
                                                            updateCheckboxState(
                                                                productDesignation,
                                                                event.target.checked,
                                                                productCategory.ProductRoot.name,
                                                            )
                                                        }
                                                        sx={{ padding: '6px' }}
                                                    />
                                                    <Typography>{productDesignation.name}</Typography>
                                                </Box>
                                            );
                                        })}
                                    </TreeItem>
                                );
                            })}
                        </TreeItem>
                    );
                })}
            </TreeItem>
        </SimpleTreeView>
    );
}
