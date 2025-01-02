import { AasListDto, ListEntityDto } from 'lib/services/list-service/ListService';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAasListEntities } from 'lib/services/list-service/aasListApiActions';
import { showError } from 'lib/util/ErrorHandlerUtil';
import { useState } from 'react';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import AasList from './AasList';
import { useEnv } from 'app/env/provider';
import { AasListComparisonHeader } from './AasListComparisonHeader';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SelectRepository } from './filter/SelectRepository';
import { useTranslations } from 'next-intl';

export default function AasListDataWrapper() {
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [aasList, setAasList] = useState<AasListDto>();
    const [, setAasListFiltered] = useState<ListEntityDto[]>();
    const [selectedAasList, setSelectedAasList] = useState<string[]>();
    const notificationSpawner = useNotificationSpawner();
    const [selectedRepository, setSelectedRepository] = useState<string | undefined>();
    const env = useEnv();
    const t = useTranslations('aas-list');

    //Pagination
    const [currentCursor, setCurrentCursor] = useState<string>();
    const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    useAsyncEffect(async () => {
        resetPagination();
        await fetchListData();
    }, [selectedRepository]);

    const fetchListData = async (newCursor?: string | undefined, isNext = true) => {
        if (!selectedRepository) return;

        setIsLoadingList(true);
        const response = await getAasListEntities(selectedRepository!, 10, newCursor);

        if (response.success) {
            setAasList(response);
            setAasListFiltered(response.entities);
            setCurrentCursor(response.cursor);

            if (isNext) {
                setCursorHistory((prevHistory) => [...prevHistory, newCursor]);
            }
        } else {
            showError(response.error, notificationSpawner);
        }
        setIsLoadingList(false);
    };

    const handleNextPage = async () => {
        await fetchListData(currentCursor, true);
        setCurrentPage((prevPage) => prevPage + 1);
    };

    /**
     * Handle a click on the back button.
     * To load the page one step back, we need to use the cursor from two pages back.
     */
    const handleGoBack = async () => {
        const previousCursor = cursorHistory[currentPage - 2] ?? undefined;
        await fetchListData(previousCursor, false);
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const resetPagination = () => {
        setCursorHistory([]);
        setCurrentPage(0);
    };

    /**
     * Update the list of currently selected aas
     */
    const updateSelectedAasList = (isChecked: boolean, aasId: string | undefined) => {
        if (!aasId) return;
        let selected: string[] = [];

        if (isChecked) {
            selected = selected.concat(selectedAasList ? selectedAasList : [], [aasId]);
            selected = [...new Set(selected)];
        } else if (!isChecked && selectedAasList) {
            selected = selectedAasList.filter((aas) => {
                return aas !== aasId;
            });
        } else {
            return;
        }

        setSelectedAasList(selected);
    };

    return (
        <>
            <Typography marginBottom={2} marginTop={-1}>
                {t('subHeader')}
            </Typography>

            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Box display="flex" gap={4}>
                    <SelectRepository onSelectedRepositoryChanged={setSelectedRepository} />
                </Box>
                {env.COMPARISON_FEATURE_FLAG && (
                    <AasListComparisonHeader
                        selectedAasList={selectedAasList}
                        updateSelectedAasList={updateSelectedAasList}
                    />
                )}
            </Box>
            {isLoadingList ? (
                <CenteredLoadingSpinner sx={{ mt: 10 }} />
            ) : (
                <>
                    {selectedRepository ? (
                        <>
                            <AasList
                                data-testid="aas-list"
                                repositoryUrl={selectedRepository}
                                shells={aasList}
                                selectedAasList={selectedAasList}
                                updateSelectedAasList={updateSelectedAasList}
                                comparisonFeatureFlag={env.COMPARISON_FEATURE_FLAG}
                            ></AasList>
                            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={4} marginTop={2}>
                                <IconButton
                                    onClick={handleGoBack}
                                    disabled={currentPage === 0}
                                    data-testid="list-back-button"
                                >
                                    <ArrowBackIosNewIcon />
                                </IconButton>
                                <Typography>{t('page') + ' ' + (currentPage + 1)}</Typography>
                                <IconButton
                                    onClick={handleNextPage}
                                    disabled={!currentCursor}
                                    data-testid="list-next-button"
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <Typography data-testid="select-repository-text">{t('selectRepository')}</Typography>
                        </Box>
                    )}
                </>
            )}
        </>
    );
}
