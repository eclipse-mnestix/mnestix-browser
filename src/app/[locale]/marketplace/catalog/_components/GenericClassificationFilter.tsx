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
        const selectedVecs = Object.keys(selectedFilters).filter((key) => selectedFilters[key]);
        props.onFilterChanged(selectedVecs.map((vec) => ({ key: 'VEC', value: vec })));
    }, [selectedFilters]);

    useEffect(() => {
        const resetState: CheckboxFilterState = {};
        props.filters.forEach((filter) => {
            resetState[filter] = false;
        });
        setSelectedFilters(resetState);
    }, [props.resetFilters]);

    function onFilterChange(vec: string, checked: boolean) {
        setSelectedFilters((prevState) => ({
            ...prevState,
            [vec]: checked,
        }));
    }

    return (
        <SimpleTreeView defaultExpandedItems={props.defaultOpen ? ['vec'] : []}>
            <TreeItem
                itemId="vec"
                label={
                    <Typography variant="h5" my={1}>
                        {props.filterSystem}
                    </Typography>
                }
            >
                {props.filters.map((vec) => {
                    return (
                        <Box key={vec} display="flex" alignItems="center">
                            <Checkbox
                                checked={selectedFilters[vec] || false}
                                onChange={(event) => onFilterChange(vec, event.target.checked)}
                                sx={{ padding: '6px' }}
                            />
                            <Typography>{vec.replace('PrimaryPartType_', '')}</Typography>
                        </Box>
                    );
                })}
            </TreeItem>
        </SimpleTreeView>
    );
}
