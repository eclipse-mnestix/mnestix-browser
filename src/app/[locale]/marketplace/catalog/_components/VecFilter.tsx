import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { useState } from 'react';
import { CheckboxFilterState } from 'app/[locale]/marketplace/catalog/_components/EClassFilter';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, Typography } from '@mui/material';

export function VecFilter(props: { vecFilters: string[]; onFilterChanged(query: FilterQuery[]): void }) {
    const [selectedFilters, setSelectedFilters] = useState<CheckboxFilterState>(() => {
        const initialState: Record<string, boolean> = {};
        props.vecFilters.forEach((filter) => {
            initialState[filter] = false;
        });
        return initialState;
    });

    function onFilterChange(vec: string, checked: boolean) {
        setSelectedFilters((prevState) => {
            const updatedFilters = {
                ...prevState,
                [vec]: checked,
            };
            const selectedVecs = Object.keys(updatedFilters).filter((key) => updatedFilters[key]);
            props.onFilterChanged(selectedVecs.map(vec => ({ key: 'VEC', value: vec })));
            return updatedFilters;
        });
    }

    return (
        <SimpleTreeView>
            <TreeItem
                itemId="vec"
                label={
                    <Typography variant="h5" my={1}>
                        VEC
                    </Typography>
                }
            >
                {props.vecFilters.map((vec) => {
                    return (
                        <Box key={vec} display="flex" alignItems="center">
                            <Checkbox
                                checked={selectedFilters[vec] || false}
                                onChange={(event) => onFilterChange(vec, event.target.checked)}/>
                            <Typography>{vec.replace('PrimaryPartType_', '')}</Typography>
                        </Box>
                    );
                })}
            </TreeItem>
        </SimpleTreeView>
    );
}