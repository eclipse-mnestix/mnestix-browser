import { Box, Checkbox, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

export function FilterContainer() {
    const t = useTranslations('pages.catalog');

    const productCategoryFilters = [
        {
            ProductRoot: 'Coroflex High-Voltage Cable',
            ProductFamilies: [
                {
                    ProductFamily: 'Shielded Single-Core Cable',
                    ProductDesignations: [
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x120mm²' },
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x240mm²' },
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x400mm²' },
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x630mm²' },
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x800mm²' },
                        { ProductDesignation: 'Coroflex High-Voltage Cable 1x1000mm²' },
                    ],
                },
                {
                    ProductFamily: 'Shielded Multi-Core Cable', // add checkbox for root and family
                    ProductDesignations: [
                        {
                            ProductDesignation: 'Coroflex High-Voltage Cable 3x120mm²',
                        },
                    ],
                },
            ],
        },
        {
            ProductRoot: 'CONNECT_TERMINALS',
            ProductFamilies: [
                {
                    ProductFamily: 'DLK 1,2',
                    ProductDesignations: [{ ProductDesignation: 'DLK 1,2' }],
                },
            ],
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
    ];
    // dropdown for first 2 numbers, resolve 27 and 44
    const VECFilters = ['PrimaryPartType_Wire', 'PrimaryPartType_PluggableTerminal'];
    // remove PrimaryPartType_

    return (
        <>
            <Typography variant="h6" fontWeight={600}>
                {t('filter')}
            </Typography>
            <SimpleTreeView>
                <TreeItem itemId="eclass" label="ECLASS">
                    {eClassFilters.map((eClass) => {
                        return (
                            <Box key={eClass} display="flex" alignItems="center">
                                <Checkbox />
                                <Typography color="text.secondary">{eClass}</Typography>
                            </Box>
                        );
                    })}
                </TreeItem>
            </SimpleTreeView>
            <SimpleTreeView>
                <TreeItem itemId="vec" label="VEC">
                    {VECFilters.map((vec) => {
                        return (
                            <Box key={vec} display="flex" alignItems="center">
                                <Checkbox />
                                <Typography color="text.secondary">{vec.replace('PrimaryPartType_', '')}</Typography>
                            </Box>
                        );
                    })}
                </TreeItem>
            </SimpleTreeView>
            <SimpleTreeView>
                <TreeItem itemId="root" label="Product Root, Family and Designation">
                    {productCategoryFilters.map((productCategory) => {
                        return (
                            <TreeItem itemId={productCategory.ProductRoot} label={<Box><Checkbox onClick={(event) => event.stopPropagation()}/>{productCategory.ProductRoot}</Box>}>
                                {productCategory.ProductFamilies.map((productFamily) => {
                                    return (
                                        <TreeItem
                                            itemId={productFamily.ProductFamily}
                                            label={<Box><Checkbox onClick={(event) => event.stopPropagation()}/>{productFamily.ProductFamily}</Box>}
                                        >
                                            {productFamily.ProductDesignations.map((productDesignation) => {
                                                return (
                                                    <Box
                                                        key={productDesignation.ProductDesignation}
                                                        display="flex"
                                                        alignItems="center"
                                                        ml={4}
                                                    >
                                                        <Checkbox />
                                                        <Typography color="text.secondary">
                                                            {productDesignation.ProductDesignation}
                                                        </Typography>
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
