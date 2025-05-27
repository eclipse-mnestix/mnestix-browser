import { useState } from 'react';
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

export function ProductCategoryFilter(props: {productCategoryFilters: ProductCategory[], onFilterChanged(query: FilterQuery[]): void}) {
    const [filters, setFilters] = useState<ProductCategory[]>(props.productCategoryFilters);

    function updateCheckboxState(node: ProductRoot | ProductFamily | ProductDesignation, isChecked: boolean) {
        setFilters((prevFilters) => {
            return prevFilters.map((category) => {
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

                    // Behandlung von ProductDesignation-Änderungen
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

                // Update Root basierend auf Families
                updatedRoot.value = updatedFamilies.every((family) => family.value);

                return {
                    ProductRoot: {
                        ...updatedRoot,
                        ProductFamilies: updatedFamilies,
                    },
                };
            });
        });

        // TODO build query and send event to parent component to trigger new search
        props.onFilterChanged([{ key: node.name, value: node.name }]);
    }

    return ( <SimpleTreeView>
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
                            <Box display="flex" alignItems="center">
                                <Checkbox
                                    onClick={(event) => event.stopPropagation()}
                                    checked={productCategory.ProductRoot.value}
                                    onChange={(event) =>
                                        updateCheckboxState(productCategory.ProductRoot, event.target.checked)
                                    }
                                />
                                {productCategory.ProductRoot.name}
                            </Box>
                        }
                    >
                        {productCategory.ProductRoot.ProductFamilies.map((productFamily) => {
                            return (
                                <TreeItem
                                    key={productFamily.name}
                                    itemId={productFamily.name}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <Checkbox
                                                onClick={(event) => event.stopPropagation()}
                                                checked={productFamily.value}
                                                onChange={(event) =>
                                                    updateCheckboxState(productFamily, event.target.checked)
                                                }
                                            />
                                            {productFamily.name}
                                        </Box>
                                    }
                                >
                                    {productFamily.ProductDesignations.map((productDesignation) => {
                                        return (
                                            <Box
                                                key={productDesignation.name}
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
                                                        )
                                                    }
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