import { Box, Checkbox, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

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
            <Typography color="text.secondary" marginTop={'1rem'}>
                ECLASS
                {eClassFilters.map((eClass) => {
                    return (
                        <Box key={eClass} ml={1} display="flex" alignItems="center">
                            <Checkbox />
                            <Typography color="text.secondary" marginTop={'1rem'}>
                                {eClass}
                            </Typography>
                        </Box>
                    );
                })}
            </Typography>
            <Typography color="text.secondary" marginTop={'1rem'}>
                VEC
                {VECFilters.map((vec) => {
                    return (
                        <Box key={vec} ml={1} display="flex" alignItems="center">
                            <Checkbox />
                            <Typography color="text.secondary" marginTop={'1rem'}>
                                {vec}
                            </Typography>
                        </Box>
                    );
                })}
            </Typography>
            <Typography color="text.secondary" marginTop={'1rem'}>
                Manufacturer Product Family and Designation
                {productCategoryFilters.map((productCategory) => {
                    return (
                        <Box key={productCategory.ProductRoot} ml={1}>
                            <Typography color="text.secondary" marginTop={'1rem'}>
                                {productCategory.ProductRoot}
                            </Typography>
                            {productCategory.ProductFamilies.map((productFamily) => {
                                return (
                                    <Box key={productFamily.ProductFamily} ml={1}>
                                        <Typography color="text.secondary" marginTop={'1rem'}>
                                            {productFamily.ProductFamily}
                                        </Typography>
                                        {productFamily.ProductDesignations.map((productDesignation) => {
                                            return (
                                                <Box
                                                    key={productDesignation.ProductDesignation}
                                                    ml={1}
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <Checkbox />
                                                    <Typography color="text.secondary" marginTop={'1rem'}>
                                                        {productDesignation.ProductDesignation}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                })}
            </Typography>
        </>
    );
}
