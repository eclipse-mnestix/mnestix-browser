import { AasListDto, ListEntityDto } from 'lib/services/list-service/ListService';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAasListEntities } from 'lib/services/list-service/aasListApiActions';
import { useShowError } from 'lib/hooks/UseShowError';
import { useState } from 'react';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import AasList from './AasList';
import { useEnv } from 'app/EnvProvider';
import { AasListComparisonHeader } from './AasListComparisonHeader';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SelectListSource } from './filter/SelectListSource';
import { useTranslations } from 'next-intl';
import { ApiResponseWrapperError } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

type AasListDataWrapperProps = {
    repositoryUrl?: string;
    hideRepoSelection?: boolean;
};

export default function AasListDataWrapper({ hideRepoSelection }: AasListDataWrapperProps) {
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [aasList, setAasList] = useState<AasListDto>();
    const [, setAasListFiltered] = useState<ListEntityDto[]>();
    const [selectedAasList, setSelectedAasList] = useState<string[]>();
    const [selectedRepository, setSelectedRepository] = useState<RepositoryWithInfrastructure | null | undefined>();
    const [selectedType, setSelectedType] = useState<'repository' | 'registry' | undefined>();
    const env = useEnv();
    const t = useTranslations('pages.aasList');
    const { showError } = useShowError();

    //Pagination
    const [currentCursor, setCurrentCursor] = useState<string>();
    const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    //Authentication
    const [needAuthentication, setNeedAuthentication] = useState<boolean>(false);

    const clearResults = () => {
        setAasList(undefined);
        setCurrentCursor(undefined);
        setNeedAuthentication(false);
    };

    useAsyncEffect(async () => {
        resetPagination();
        await fetchListData();
    }, [selectedRepository]);

    const fetchListData = async (newCursor?: string | undefined, isNext = true) => {
        if (!selectedRepository) return;

        setIsLoadingList(true);
        clearResults();
        const response = await getAasListEntities(selectedRepository, 10, newCursor, selectedType);

        if (response.success) {
            setAasList(response);
            setAasListFiltered(response.entities);
            setCurrentCursor(response.cursor);

            if (isNext) {
                setCursorHistory((prevHistory) => [...prevHistory, newCursor]);
            }
        } else {
            if ((response.error as ApiResponseWrapperError<AasListDto>).errorCode == ApiResultStatus.UNAUTHORIZED) {
                setNeedAuthentication(true);
            } else {
                showError(response.error);
            }
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

    const pagination = (
        <Box display="flex" justifyContent="flex-end" alignItems="center" marginTop={0}>
            <Typography paddingRight="1.625rem" fontSize="0.75rem">
                {t('page') + ' ' + (currentPage + 1)}
            </Typography>
            <IconButton onClick={handleGoBack} disabled={currentPage === 0} data-testid="list-back-button">
                <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleNextPage} disabled={!currentCursor} data-testid="list-next-button">
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    const ListContent = (props: { selectedRepository: RepositoryWithInfrastructure | null | undefined }) => {
        const selectedRepository = props.selectedRepository;
        if (!selectedRepository) {
            return (
                <Box>
                    <Typography data-testid="select-repository-text">{t('selectListSource')}</Typography>
                </Box>
            );
        }

        if (needAuthentication) {
            return <AuthenticationPrompt isDefaultRepo={selectedRepository?.isDefault} />;
        }

        return (
            <>
                <AasList
                    data-testid="aas-list"
                    repositoryUrl={selectedRepository}
                    connectionType={selectedType}
                    shells={aasList}
                    selectedAasList={selectedAasList}
                    updateSelectedAasList={updateSelectedAasList}
                    comparisonFeatureFlag={env.COMPARISON_FEATURE_FLAG}
                ></AasList>
                {pagination}
            </>
        );
    };

    return (
        <Card>
            <CardContent sx={{ paddingX: 0, paddingY: '1.625rem', '&:last-child': { paddingBottom: '0' } }}>
                {!hideRepoSelection && (
                    <Box display="flex" justifyContent="space-between" marginBottom="1.625rem" paddingX="1rem">
                        <Box display="flex" gap={4}>
                            <SelectListSource
                                onSelectedRepositoryChanged={setSelectedRepository}
                                onSelectedTypeChanged={setSelectedType}
                            />
                        </Box>
                        {env.COMPARISON_FEATURE_FLAG && (
                            <AasListComparisonHeader
                                selectedAasList={selectedAasList}
                                updateSelectedAasList={updateSelectedAasList}
                            />
                        )}
                    </Box>
                )}
                {isLoadingList ? (
                    <CenteredLoadingSpinner sx={{ my: 10 }} />
                ) : (
                    <ListContent selectedRepository={selectedRepository} />
                )}
            </CardContent>
        </Card>
    );
}
