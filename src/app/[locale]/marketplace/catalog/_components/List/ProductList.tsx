import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useLocale, useTranslations } from 'next-intl';
import { SearchResponseEntry } from 'lib/api/graphql/catalogQueries';
import { ProductListTableRow } from 'app/[locale]/marketplace/catalog/_components/List/ProductListTableRow';
import { useMemo, useState } from 'react';
import { translateListText } from 'lib/util/SubmodelResolverUtil';

type AasListProps = {
    repositoryUrl: string;
    shells: SearchResponseEntry[] | undefined;
    comparisonFeatureFlag?: boolean;
    selectedAasList?: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

type SortOrder = 'asc' | 'desc';
type SortableColumn = 'manufacturer' | 'productDesignation';

export default function ProductList(props: AasListProps) {
    const { repositoryUrl, shells, selectedAasList, updateSelectedAasList, comparisonFeatureFlag } = props;
    const t = useTranslations('pages.aasList');
    const MAX_SELECTED_ITEMS = 3;
    const locale = useLocale();

    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const tableHeaders = [
        { label: t('listHeader.picture'), sortable: false, key: null },
        { label: t('listHeader.manufacturer'), sortable: true, key: 'manufacturer' as SortableColumn },
        { label: t('listHeader.productDesignation'), sortable: true, key: 'productDesignation' as SortableColumn },
        '',
    ];

    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortedShells = useMemo(() => {
        if (!shells || !sortColumn) return shells;

        return [...shells].sort((a, b) => {
            let aValue = '';
            let bValue = '';

            if (sortColumn === 'manufacturer') {
                aValue = translateListText(a.manufacturerName?.mlValues, locale) || '';
                bValue = translateListText(b.manufacturerName?.mlValues, locale) || '';
            } else if (sortColumn === 'productDesignation') {
                aValue = translateListText(a.productDesignation?.mlValues, locale) || '';
                bValue = translateListText(b.productDesignation?.mlValues, locale) || '';
            }

            const comparison = aValue.localeCompare(bValue);
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [shells, sortColumn, sortOrder]);

    /**
     * Decides if the current checkbox should be disabled or not.
     */
    const checkBoxDisabled = (aasId: string | undefined) => {
        if (!aasId) return false;
        return selectedAasList && selectedAasList.length >= MAX_SELECTED_ITEMS && !selectedAasList.includes(aasId);
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {comparisonFeatureFlag && (
                                <TableCell align="center" width="50px">
                                    <Tooltip title={t('compare')} arrow>
                                        <CompareArrowsIcon
                                            color="secondary"
                                            sx={{
                                                width: '35px',
                                                height: '35px',
                                                verticalAlign: 'middle',
                                            }}
                                        />
                                    </Tooltip>
                                </TableCell>
                            )}
                            {!!tableHeaders &&
                                tableHeaders.map(
                                    (header: { label: string; sortable: boolean; key: SortableColumn }, index) => (
                                        <TableCell key={index}>
                                            {header.sortable && header.key ? (
                                                <TableSortLabel
                                                    active={sortColumn === header.key}
                                                    direction={sortColumn === header.key ? sortOrder : 'asc'}
                                                    onClick={() => handleSort(header.key as SortableColumn)}
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        color="secondary"
                                                        letterSpacing={0.16}
                                                        fontWeight={700}
                                                    >
                                                        {header.label}
                                                    </Typography>
                                                </TableSortLabel>
                                            ) : (
                                                <Typography
                                                    variant="h5"
                                                    color="secondary"
                                                    letterSpacing={0.16}
                                                    fontWeight={700}
                                                >
                                                    {header.label}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ),
                                )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedShells &&
                            sortedShells.map((aasListEntry) => (
                                <TableRow key={aasListEntry.id} data-testid={`list-row-${aasListEntry.id}`}>
                                    <ProductListTableRow
                                        repositoryUrl={repositoryUrl}
                                        aasListEntry={aasListEntry}
                                        comparisonFeatureFlag={comparisonFeatureFlag}
                                        checkBoxDisabled={checkBoxDisabled}
                                        selectedAasList={selectedAasList}
                                        updateSelectedAasList={updateSelectedAasList}
                                    />
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
