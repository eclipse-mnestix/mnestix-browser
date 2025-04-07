import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { GenericAasListEntry } from 'app/[locale]/viewer/discovery/_components/GenericAasListEntry';
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
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-aasId"
                                    >
                                        {t('aasId')}
                                    </Typography>
                                </TableCell>
                            )}
                            {config.showAssetId && (
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-assetId"
                                    >
                                        {t('assetId')}
                                    </Typography>
                                </TableCell>
                            )}
                            {config.showAasEndpoint && (
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-aasEndpoint"
                                    >
                                        {t('aasEndpoint')}
                                    </Typography>
                                </TableCell>
                            )}
                            {config.showRepositoryUrl && (
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-repositoryUrl"
                                    >
                                        {t('repositoryUrl')}
                                    </Typography>
                                </TableCell>
                            )}
                            {config.showDiscoveryUrl && (
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-discoveryUrl"
                                    >
                                        {t('discoveryUrl')}
                                    </Typography>
                                </TableCell>
                            )}
                            {config.showRegistryUrl && (
                                <TableCell>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        letterSpacing={0.16}
                                        fontWeight={700}
                                        data-testid="list-header-registryUrl"
                                    >
                                        {t('registryUrl')}
                                    </Typography>
                                </TableCell>
                            )}
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
