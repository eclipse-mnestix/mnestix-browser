import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, Typography } from '@mui/material';
import { useState } from 'react';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';

interface CheckboxFilterState {
    [key: string]: boolean;
}

export function EClassFilter(props: { eClassFilters: string[]; onFilterChanged(query: FilterQuery[]): void }) {
    const [selectedFilters, setSelectedFilters] = useState<CheckboxFilterState>(() => {
        const initialState: CheckboxFilterState = {};
        props.eClassFilters.forEach((filter) => {
            initialState[filter] = false;
        });
        return initialState;
    });

    function onFilterChange(eClass: string, checked: boolean) {
        setSelectedFilters((prevState) => {
            const updatedFilters = {
                ...prevState,
                [eClass]: checked,
            };

            // Collect all selected filters
            const selectedEClasses = Object.keys(updatedFilters).filter((key) => updatedFilters[key]);

            // Send the updated list of selected filters to the parent component
            props.onFilterChanged(selectedEClasses.map(eclass => {return { key: 'ECLASS', value: eclass }}));

            return updatedFilters;
        });
    }

    const resolveEclassLabel = (eClass: string) => {
        switch (eClass) {
            case '27':
                return 'Elektro-, Automatisierungs- und Prozessleittechnik';
            case '44':
                return 'Fahrzeugtechnik, Fahrzeugkomponente';
            default:
                return 'Kategorie ' + eClass;
        }
    };

    function prepareEclassHierarchy(eClassFilters: string[]) {
        const groupedFilters = eClassFilters.reduce(
            (acc, eClass) => {
                const group = eClass.slice(0, 2);
                if (!acc[group]) {
                    acc[group] = [];
                }
                acc[group].push(eClass);
                return acc;
            },
            {} as Record<string, string[]>,
        );

        return Object.entries(groupedFilters).map(([group, eClasses]) => {
            const isGroupChecked = eClasses.every((eClass) => selectedFilters[eClass]);
            return (
                <TreeItem
                    key={group}
                    itemId={group}
                    label={
                        <Box display="flex" alignItems="center">
                            <Checkbox
                                checked={isGroupChecked}
                                onChange={(event) =>
                                    eClasses.forEach((eClass) => onFilterChange(eClass, event.target.checked))
                                }
                                onClick={(event) => event.stopPropagation()}
                            />
                            {resolveEclassLabel(group)}
                        </Box>
                    }
                >
                    {eClasses.map((eClass) => (
                        <Box key={eClass} display="flex" alignItems="center" ml={4}>
                            <Checkbox
                                checked={selectedFilters[eClass] || false}
                                onChange={(event) => onFilterChange(eClass, event.target.checked)}
                            />
                            <Typography>{eClass}</Typography>
                        </Box>
                    ))}
                </TreeItem>
            );
        });
    }
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
                {prepareEclassHierarchy(props.eClassFilters)}
            </TreeItem>
        </SimpleTreeView>
    );
}
