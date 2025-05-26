import { Box, Checkbox, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useState } from 'react';
import { EClassFilter } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';

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

export function FilterContainer() {
    const t = useTranslations('pages.catalog');

    const productCategoryFilters = [
        {
            ProductRoot: {
                name: 'Coroflex High-Voltage Cable',
                value: false,
                ProductFamilies: [
                    {
                        name: 'Shielded Single-Core Cable',
                        value: false,
                        ProductDesignations: [
                            { name: 'Coroflex High-Voltage Cable 1x120mm²', value: false },
                            { name: 'Coroflex High-Voltage Cable 1x240mm²', value: false },
                            { name: 'Coroflex High-Voltage Cable 1x400mm²', value: false },
                            { name: 'Coroflex High-Voltage Cable 1x630mm²', value: false },
                            { name: 'Coroflex High-Voltage Cable 1x800mm²', value: false },
                            { name: 'Coroflex High-Voltage Cable 1x1000mm²', value: false },
                        ],
                    },
                    {
                        name: 'Shielded Multi-Core Cable',
                        value: false,
                        ProductDesignations: [{ name: 'Coroflex High-Voltage Cable 3x120mm²', value: false }],
                    },
                ],
            },
        },
        {
            ProductRoot: {
                name: 'CONNECT_TERMINALS',
                value: false,
                ProductFamilies: [
                    {
                        name: 'DLK 1,2',
                        value: false,
                        ProductDesignations: [{ name: 'DLK 1,2', value: false }],
                    },
                ],
            },
        },
    ];
    const [filters, setFilters] = useState<ProductCategory[]>(productCategoryFilters);

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
    }

    return (
        <>
            <Typography variant="h4" fontWeight={600} mb={1}>
                {t('filter')}
            </Typography>
            <EClassFilter eClassFilters={eClassFilters}/>
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
            <SimpleTreeView>
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
        </>
    );
}
