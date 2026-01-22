import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { GenericAasListEntry } from 'components/basics/listBasics/GenericAasListEntry';
import { AasListConfig, AasListEntry } from 'lib/types/AasListEntry';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

type AasListProps = {
    data: AasListEntry[];
} & AasListConfig;

const tableHeaderText = {
    variant: 'h5',
    color: 'secondary',
    letterSpacing: 0.16,
    fontWeight: 700,
};

export default function GenericAasList({ data, ...config }: AasListProps) {
    const t = useTranslations('pages.aasList.listHeader');
    const [orderBy, setOrderBy] = useState<string | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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

    return (
        <>
            <TableContainer>
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
                        {sortedData.map((aasListEntry) => (
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
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
