import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GenericAasListEntry } from 'components/basics/listBasics/GenericAasListEntry';
import { AasListConfig, AasListEntry } from 'lib/types/AasListEntry';
import { useTranslations } from 'next-intl';

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

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {config.showThumbnail && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-picture">
                                    {t('picture')}
                                </TableCell>
                            )}
                            {config.showAasId && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-aasId">
                                    {t('aasId')}
                                </TableCell>
                            )}
                            {config.showAssetId && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-assetId">
                                    {t('assetId')}
                                </TableCell>
                            )}
                            {config.showAasEndpoint && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-aasEndpoint">
                                    {t('aasEndpoint')}
                                </TableCell>
                            )}
                            {config.showRepositoryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-repositoryUrl">
                                    {t('repositoryUrl')}
                                </TableCell>
                            )}
                            {config.showInfrastructureName && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-infrastructureName">
                                    {t('infrastructureName')}
                                </TableCell>
                            )}
                            {config.showDiscoveryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-discoveryUrl">
                                    {t('discoveryUrl')}
                                </TableCell>
                            )}
                            {config.showRegistryUrl && (
                                <TableCell sx={tableHeaderText} data-testid="list-header-registryUrl">
                                    {t('registryUrl')}
                                </TableCell>
                            )}
                            <TableCell sx={tableHeaderText} data-testid="list-header-viewAASButton">
                                {t('viewAASButton')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((aasListEntry, index) => (
                            <TableRow
                                key={index}
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
