import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { useEffect, useState } from 'react';
import { CheckboxFilterState } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, Typography } from '@mui/material';

export function GenericClassificationFilter(props: {
    filterSystem: string;
    filters: string[];
    onFilterChanged(query: FilterQuery[]): void;
    resetFilters: boolean;
    defaultOpen: boolean;
}) {
    const [selectedFilters, setSelectedFilters] = useState<CheckboxFilterState>(() => {
        const initialState: Record<string, boolean> = {};
        props.filters.forEach((filter) => {
            initialState[filter] = false;
        });
        return initialState;
    });

    useEffect(() => {
        const selectedOptions = Object.keys(selectedFilters).filter((opt) => selectedFilters[opt]);
        props.onFilterChanged(selectedOptions.map((opt) => ({ key: props.filterSystem, value: opt })));
    }, [selectedFilters]);

    useEffect(() => {
        const resetState: CheckboxFilterState = {};
        props.filters.forEach((filter) => {
            resetState[filter] = false;
        });
        setSelectedFilters(resetState);
    }, [props.resetFilters]);

    function onFilterChange(opt: string, checked: boolean) {
        setSelectedFilters((prevState) => ({
            ...prevState,
            [opt]: checked,
        }));
    }

    return (
        <SimpleTreeView defaultExpandedItems={props.defaultOpen ? [props.filterSystem] : []}>
            <TreeItem
                itemId={props.filterSystem}
                label={
                    <Typography variant="h5" my={1}>
                        {props.filterSystem}
                    </Typography>
                }
            >
                {props.filters.map((opt) => {
                    return (
                        <Box key={opt} display="flex" alignItems="center">
                            <Checkbox
                                checked={selectedFilters[opt] || false}
                                onChange={(event) => onFilterChange(opt, event.target.checked)}
                                sx={{ padding: '6px' }}
                            />
                            <Typography>{opt.replace('PrimaryPartType_', '')}</Typography>
                        </Box>
                    );
                })}
            </TreeItem>
        </SimpleTreeView>
    );
}
