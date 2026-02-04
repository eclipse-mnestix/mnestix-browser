import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { AasListTableRow } from 'app/[locale]/list/_components/AasListTableRow';
import { AasListDto } from 'lib/services/list-service/ListService';
import { useTranslations } from 'next-intl';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

type AasListProps = {
    repositoryUrl: RepositoryWithInfrastructure;
    connectionType?: 'repository' | 'registry';
    shells: AasListDto | undefined;
    comparisonFeatureFlag?: boolean;
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

export default function AasList(props: AasListProps) {
    const { repositoryUrl, connectionType, shells, selectedAasList, updateSelectedAasList, comparisonFeatureFlag } =
        props;
    const t = useTranslations('pages.aasList');
    const MAX_SELECTED_ITEMS = 3;

    const tableHeaders = [
        { label: t('listHeader.picture') },
        { label: t('listHeader.manufacturer') },
        { label: t('listHeader.productDesignation') },
        { label: t('listHeader.assetId') },
        { label: t('listHeader.aasId') },
        '',
    ];

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
                                tableHeaders.map((header: { label: string }, index) => (
                                    <TableCell key={index}>
                                        <Typography
                                            variant="h5"
                                            color="secondary"
                                            letterSpacing={0.16}
                                            fontWeight={700}
                                        >
                                            {header.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shells &&
                            shells.entities?.map((aasListEntry) => (
                                <TableRow key={aasListEntry.aasId} data-testid={`list-row-${aasListEntry.aasId}`}>
                                    <AasListTableRow
                                        repository={repositoryUrl}
                                        connectionType={connectionType}
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
