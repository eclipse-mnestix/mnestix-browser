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
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { AasListDto } from 'lib/services/list-service/ListService';
import { getNameplateValuesForAAS } from 'lib/services/list-service/aasListApiActions';
import { MultiLanguageValueOnly } from 'lib/api/basyx-v3/types';
import { useTranslations, useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { translateListText } from 'lib/util/SubmodelResolverUtil';
import {
    sortAasList,
    sortableColumns,
    SortableAasListEntity,
    SortableColumn,
    SortOrder,
} from 'app/[locale]/list/_components/AasListSorting';

type AasListProps = {
    repositoryUrl: string;
    shells: AasListDto | undefined;
    comparisonFeatureFlag?: boolean;
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
    initialSortOrder?: {
        column: SortableColumn;
        order: SortOrder;
    };
    columnSortUpdateCallback: (column: SortableColumn, order: SortOrder) => void;
};

type EnrichedListEntity = SortableAasListEntity & {
    thumbnail?: string;
};

export default function AasList(props: AasListProps) {
    const { repositoryUrl, shells, selectedAasList, updateSelectedAasList, comparisonFeatureFlag } = props;
    const t = useTranslations('pages.aasList');
    const locale = useLocale();
    const MAX_SELECTED_ITEMS = 3;

    // Set initial state for sorting based on url params
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(
        props.initialSortOrder ? props.initialSortOrder.column : null,
    );
    const [sortOrder, setSortOrder] = useState<SortOrder>(
        props.initialSortOrder ? props.initialSortOrder.order : 'asc',
    );

    // Fetch nameplate data for all shells
    const { data: nameplateData, isLoading: isNameplateLoading } = useSWR(
        shells?.entities ? [repositoryUrl, shells.entities.map((e) => e.aasId)] : null,
        async ([url, aasIds]) => {
            const results = await Promise.allSettled(
                aasIds.map(async (aasId: string) => {
                    const nameplate = await getNameplateValuesForAAS(url, aasId);
                    return { aasId, nameplate };
                }),
            );
            return results.reduce(
                (acc, result, index) => {
                    if (result.status === 'fulfilled') {
                        const nameplate = result.value.nameplate;

                        function toLangTextArray(prop?: MultiLanguageValueOnly) {
                            if (!prop) return [];
                            return prop.flatMap((entry) =>
                                Object.entries(entry).map(([language, text]) => ({
                                    language,
                                    text,
                                })),
                            );
                        }
                        acc[aasIds[index]] = {
                            manufacturerName: toLangTextArray(nameplate?.manufacturerName),
                            manufacturerProductDesignation: toLangTextArray(nameplate?.manufacturerProductDesignation),
                        };
                    }
                    return acc;
                },
                {} as Record<
                    string,
                    {
                        manufacturerName?: { language: string; text: string }[];
                        manufacturerProductDesignation?: { language: string; text: string }[];
                    }
                >,
            );
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
        },
    );

    const enrichedShells = useMemo((): EnrichedListEntity[] => {
        if (!shells?.entities) return [];

        return shells.entities.map((entity) => ({
            aasId: entity.aasId,
            assetId: entity.assetId,
            thumbnail: entity.thumbnail,
            manufacturerName: nameplateData?.[entity.aasId]?.manufacturerName
                ? translateListText(nameplateData[entity.aasId].manufacturerName, locale)
                : '',
            productDesignation: nameplateData?.[entity.aasId]?.manufacturerProductDesignation
                ? translateListText(nameplateData[entity.aasId].manufacturerProductDesignation, locale)
                : '',
        }));
    }, [shells, nameplateData, locale]);

    const handleSort = (column: SortableColumn) => {
        const nextSortOrder = sortColumn === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

        setSortColumn(column);
        setSortOrder(nextSortOrder);
        props.columnSortUpdateCallback(column, nextSortOrder);
    };

    const tableHeaders = [
        { label: t('listHeader.picture') },
        { label: t('listHeader.manufacturer'), sortable: true, key: 'manufacturer' as SortableColumn },
        { label: t('listHeader.productDesignation'), sortable: true, key: 'productDesignation' as SortableColumn },
        { label: t('listHeader.assetId'), sortable: true, key: 'assetId' as SortableColumn },
        { label: t('listHeader.aasId'), sortable: true, key: 'aasId' as SortableColumn },
        '',
    ];

    const sortedShells = useMemo(
        () => sortAasList(enrichedShells, sortColumn, sortOrder),
        [enrichedShells, sortColumn, sortOrder],
    );

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
                            sortedShells.map((enrichedEntity) => (
                                <TableRow key={enrichedEntity.aasId} data-testid={`list-row-${enrichedEntity.aasId}`}>
                                    <AasListTableRow
                                        repositoryUrl={repositoryUrl}
                                        aasListEntry={{
                                            aasId: enrichedEntity.aasId,
                                            assetId: enrichedEntity.assetId,
                                            thumbnail: enrichedEntity.thumbnail || '',
                                        }}
                                        enrichedData={{
                                            manufacturerName: enrichedEntity.manufacturerName,
                                            productDesignation: enrichedEntity.productDesignation,
                                        }}
                                        enrichedDataLoading={isNameplateLoading}
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
