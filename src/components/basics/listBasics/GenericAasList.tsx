import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { GenericAasListEntry } from 'components/basics/listBasics/GenericAasListEntry';
import { AasListConfig, AasListEntry } from 'lib/types/AasListEntry';
import { useTranslations } from 'next-intl';
import { UIEvent, useEffect, useMemo, useRef, useState } from 'react';

type AasListProps = {
    data: AasListEntry[];
} & AasListConfig;

const tableHeaderText = {
    variant: 'h5',
    color: 'secondary',
    letterSpacing: 0.16,
    fontWeight: 700,
};

const VIRTUAL_ROW_HEIGHT = 116;
const VIRTUAL_TABLE_HEIGHT = 720;
const OVERSCAN_ROWS = 5;

export default function GenericAasList({ data, ...config }: AasListProps) {
    const t = useTranslations('pages.aasList.listHeader');
    const [orderBy, setOrderBy] = useState<string | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(VIRTUAL_TABLE_HEIGHT);
    const tableContainerRef = useRef<HTMLDivElement | null>(null);

    const handleRequestSort = (property: string) => {
        if (orderBy === property) {
            setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrderBy(property);
            setOrder('asc');
        }
    };

    const getValue = (entry: AasListEntry, property: string) => {
        switch (property) {
            case 'picture':
                return entry.thumbnailUrl ?? '';
            case 'aasId':
                return entry.aasId ?? '';
            case 'assetId':
                return entry.assetId ?? '';
            case 'aasEndpoint':
                return entry.aasEndpoint ?? '';
            case 'repositoryUrl':
                return entry.repositoryUrl ?? '';
            case 'discoveryUrl':
                return entry.discoveryUrl ?? '';
            case 'registryUrl':
                return entry.registryUrl ?? '';
            default:
                return '';
        }
    };

    const sortedData = useMemo(() => {
        if (!orderBy) return data;
        const sorted = [...data].sort((a, b) => {
            const av = getValue(a, orderBy).toString();
            const bv = getValue(b, orderBy).toString();
            return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return sorted;
    }, [data, orderBy, order]);

    const columnCount = useMemo(() => {
        let count = 1;
        if (config.showThumbnail) count += 1;
        if (config.showAasId) count += 1;
        if (config.showAssetId) count += 1;
        if (config.showAasEndpoint) count += 1;
        if (config.showRepositoryUrl) count += 1;
        if (config.showDiscoveryUrl) count += 1;
        if (config.showRegistryUrl) count += 1;
        return count;
    }, [
        config.showAasEndpoint,
        config.showAasId,
        config.showAssetId,
        config.showDiscoveryUrl,
        config.showRegistryUrl,
        config.showRepositoryUrl,
        config.showThumbnail,
    ]);

    const totalRows = sortedData.length;
    const visibleRowCount = Math.ceil(containerHeight / VIRTUAL_ROW_HEIGHT);
    const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - OVERSCAN_ROWS);
    const endIndex = Math.min(totalRows, startIndex + visibleRowCount + OVERSCAN_ROWS * 2);
    const topSpacerHeight = startIndex * VIRTUAL_ROW_HEIGHT;
    const bottomSpacerHeight = Math.max(0, (totalRows - endIndex) * VIRTUAL_ROW_HEIGHT);
    const visibleRows = sortedData.slice(startIndex, endIndex);

    useEffect(() => {
        const element = tableContainerRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(() => {
            setContainerHeight(element.clientHeight || VIRTUAL_TABLE_HEIGHT);
        });

        resizeObserver.observe(element);
        setContainerHeight(element.clientHeight || VIRTUAL_TABLE_HEIGHT);

        return () => resizeObserver.disconnect();
    }, []);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    };

    return (
        <>
            <TableContainer
                ref={tableContainerRef}
                onScroll={handleScroll}
                sx={{ maxHeight: VIRTUAL_TABLE_HEIGHT, overflowY: 'auto' }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            {config.showThumbnail && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-picture">
                                    <TableSortLabel
                                        active={orderBy === 'picture'}
                                        direction={orderBy === 'picture' ? order : 'asc'}
                                        onClick={() => handleRequestSort('picture')}
                                    >
                                        {t('picture')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showAasId && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-aasId">
                                    <TableSortLabel
                                        active={orderBy === 'aasId'}
                                        direction={orderBy === 'aasId' ? order : 'asc'}
                                        onClick={() => handleRequestSort('aasId')}
                                    >
                                        {t('aasId')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showAssetId && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-assetId">
                                    <TableSortLabel
                                        active={orderBy === 'assetId'}
                                        direction={orderBy === 'assetId' ? order : 'asc'}
                                        onClick={() => handleRequestSort('assetId')}
                                    >
                                        {t('assetId')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showAasEndpoint && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-aasEndpoint">
                                    <TableSortLabel
                                        active={orderBy === 'aasEndpoint'}
                                        direction={orderBy === 'aasEndpoint' ? order : 'asc'}
                                        onClick={() => handleRequestSort('aasEndpoint')}
                                    >
                                        {t('aasEndpoint')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showRepositoryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-repositoryUrl">
                                    <TableSortLabel
                                        active={orderBy === 'repositoryUrl'}
                                        direction={orderBy === 'repositoryUrl' ? order : 'asc'}
                                        onClick={() => handleRequestSort('repositoryUrl')}
                                    >
                                        {t('repositoryUrl')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showDiscoveryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-discoveryUrl">
                                    <TableSortLabel
                                        active={orderBy === 'discoveryUrl'}
                                        direction={orderBy === 'discoveryUrl' ? order : 'asc'}
                                        onClick={() => handleRequestSort('discoveryUrl')}
                                    >
                                        {t('discoveryUrl')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            {config.showRegistryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-registryUrl">
                                    <TableSortLabel
                                        active={orderBy === 'registryUrl'}
                                        direction={orderBy === 'registryUrl' ? order : 'asc'}
                                        onClick={() => handleRequestSort('registryUrl')}
                                    >
                                        {t('registryUrl')}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                            <TableCell sx={tableHeaderText} data-testid="list-header-viewAASButton">
                                {t('viewAASButton')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topSpacerHeight > 0 && (
                            <TableRow aria-hidden="true">
                                <TableCell colSpan={columnCount} sx={{ p: 0, border: 0, height: topSpacerHeight }} />
                            </TableRow>
                        )}
                        {visibleRows.map((aasListEntry) => (
                            <TableRow
                                key={aasListEntry.aasId}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                }}
                                data-testid={`list-row-${aasListEntry.aasId}`}
                            >
                                <GenericAasListEntry aasListEntry={aasListEntry} {...config} />
                            </TableRow>
                        ))}
                        {bottomSpacerHeight > 0 && (
                            <TableRow aria-hidden="true">
                                <TableCell colSpan={columnCount} sx={{ p: 0, border: 0, height: bottomSpacerHeight }} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
