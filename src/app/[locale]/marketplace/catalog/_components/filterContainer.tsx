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
        '44-05-01-91',
    ];
    const VECFilters = ['PrimaryPartType_Wire', 'PrimaryPartType_PluggableTerminal'];

    /**
     * Creates a hierarchy of ECLASS filters for the tree view for the first two numbers.
     * @param eClassFilters
     */
    const prepareEclassHierarchy = (eClassFilters: string[]) => {
        return Object.entries(
            eClassFilters.reduce(
                (acc, eClass) => {
                    const group = eClass.slice(0, 2);
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    acc[group].push(eClass);
                    return acc;
                },
                {} as Record<string, string[]>,
            ),
        ).map(([group, eClasses]) => (
            <TreeItem
                key={group}
                itemId={group}
                label={resolveEclassLabel(group)}
            >
                {eClasses.map((eClass) => (
                    <Box key={eClass} display="flex" alignItems="center">
                        <Checkbox />
                        <Typography>{eClass}</Typography>
                    </Box>
                ))}
            </TreeItem>
        ));
    };

    const resolveEclassLabel = (eClass: string) => {
        switch (eClass) {
            case '27':
                return 'Elektro-, Automatisierungs- und Prozessleittechnik';
            case '44':
                return 'Fahrzeugtechnik, Fahrzeugkomponente';
            default:
                return 'Kategorie ' + eClass;
        }
    }

    return (
        <>
            <Typography variant="h4" fontWeight={600} mb={1}>
                {t('filter')}
            </Typography>
            <SimpleTreeView>
                <TreeItem itemId="eclass" label="ECLASS">
                    {prepareEclassHierarchy(eClassFilters)}
                </TreeItem>
            </SimpleTreeView>
            <SimpleTreeView>
                <TreeItem itemId="vec" label="VEC">
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
                <TreeItem itemId="root" label="Product Root, Family and Designation">
                    {productCategoryFilters.map((productCategory) => {
                        return (
                            <TreeItem
                                itemId={productCategory.ProductRoot}
                                label={
                                    <Box>
                                        <Checkbox onClick={(event) => event.stopPropagation()} />
                                        {productCategory.ProductRoot}
                                    </Box>
                                }
                            >
                                {productCategory.ProductFamilies.map((productFamily) => {
                                    return (
                                        <TreeItem
                                            itemId={productFamily.ProductFamily}
                                            label={
                                                <Box>
                                                    <Checkbox onClick={(event) => event.stopPropagation()} />
                                                    {productFamily.ProductFamily}
                                                </Box>
                                            }
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
                                                        <Typography>{productDesignation.ProductDesignation}</Typography>
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
