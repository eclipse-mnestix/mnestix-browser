import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { GenericAasListTableRow } from './GenericAasListTableRow';
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

export default function GenericAasList(props: AasListProps) {
    const t = useTranslations('pages.aasList.listHeader');

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHeaderText} data-testid="list-header-picture">
                                {t('picture')}
                            </TableCell>
                            {props.showAasId && (
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
                            {props.showAssetId && (
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
                            {props.showAasEndpoint && (
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
                            {props.showRepositoryUrl && (
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
                            {props.showDiscoveryUrl && (
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
                            {props.showRegistryUrl && (
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
                        {props.data.map((aasListEntry, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                }}
                                data-testid={`list-row-${aasListEntry.aasId}`}
                            >
                                <GenericAasListTableRow aasListEntry={aasListEntry} {...props} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
