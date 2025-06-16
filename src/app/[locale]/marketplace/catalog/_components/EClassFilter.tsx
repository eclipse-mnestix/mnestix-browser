import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { useTranslations } from 'next-intl';

export interface CheckboxFilterState {
    [key: string]: boolean;
}

export function EClassFilter(props: {
    eClassFilters: string[];
    onFilterChanged(query: FilterQuery[]): void;
    resetFilters: boolean;
}) {
    const t = useTranslations('pages.catalog');
    const [selectedFilters, setSelectedFilters] = useState<CheckboxFilterState>(() => {
        const initialState: CheckboxFilterState = {};
        props.eClassFilters.forEach((filter) => {
            initialState[filter] = false;
        });
        return initialState;
    });

    useEffect(() => {
        const selectedEClasses = Object.keys(selectedFilters).filter((key) => selectedFilters[key]);
        props.onFilterChanged(
            selectedEClasses.map((eclass) => {
                return { key: 'ECLASS', value: eclass };
            }),
        );
    }, [selectedFilters]);

    useEffect(() => {
        const resetState: CheckboxFilterState = {};
        props.eClassFilters.forEach((filter) => {
            resetState[filter] = false;
        });
        setSelectedFilters(resetState);
    }, [props.resetFilters]);

    function onFilterChange(eClass: string, checked: boolean) {
        setSelectedFilters((prevState) => ({
            ...prevState,
            [eClass]: checked,
        }));
    }

    const eClassUrl = (eClass: string) =>
        `https://eclass.eu/eclass-standard/content-suche/show?tx_eclasssearch_ecsearch%5Bdischarge%5D=0&tx_eclasssearch_ecsearch%5Bid%5D=${eClass.replaceAll('-', '')}&tx_eclasssearch_ecsearch%5Blanguage%5D=0`;

    return (
        <SimpleTreeView>
            <TreeItem
                itemId="eclass"
                label={
                    <Typography variant="h5" my={1}>
                        ECLASS
                    </Typography>
                }
            >
                {props.eClassFilters.map((eClass) => (
                    <Box key={eClass} display="flex" alignItems="center">
                        <Checkbox
                            checked={selectedFilters[eClass] || false}
                            onChange={(event) => onFilterChange(eClass, event.target.checked)}
                            sx={{ padding: '6px' }}
                        />
                        <Typography>{eClass}</Typography>
                        <Tooltip title={t('eclassDocumentationLink')}>
                            <IconButton href={eClassUrl(eClass)} target="_blank">
                                <OpenInNew />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}
            </TreeItem>
        </SimpleTreeView>
    );
}
