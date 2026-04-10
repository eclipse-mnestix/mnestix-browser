import { AasListDto, ListEntityDto } from 'lib/services/list-service/ListService';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getAasListEntities } from 'lib/services/list-service/aasListApiActions';
import { useShowError } from 'lib/hooks/UseShowError';
import { useState } from 'react';
import React from 'react';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import AasList from './AasList';
import { SortOrder, SortableColumn, sortableColumns } from './AasListSorting';
import { useEnv } from 'app/EnvProvider';
import { AasListComparisonHeader } from './AasListComparisonHeader';
import { Box, Card, CardContent, IconButton, MenuItem, Select, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SelectRepository } from './filter/SelectRepository';
import { SelectAssetKind } from './filter/SelectAssetKind';
import { useTranslations } from 'next-intl';
import { ApiResponseWrapperError } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { AuthenticationPrompt } from 'components/authentication/AuthenticationPrompt';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation'
import { AssetKind } from 'lib/api/aas/models';

type AasListDataWrapperProps = {
    repositoryUrl?: string;
    hideRepoSelection?: boolean;
};

const SEARCH_PARAM_SORT_BY_NAME: string = 'sortby';
const SEARCH_PARAM_ORDER_NAME: string = 'order';
const FETCH_LIMIT = 100; // Bulk fetch for caching

export default function AasListDataWrapper({ repositoryUrl, hideRepoSelection }: AasListDataWrapperProps) {
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [cachedAasList, setCachedAasList] = useState<AasListDto>();
    const [aasList, setAasList] = useState<AasListDto>();
    const [lastRepository, setLastRepository] = useState<string | undefined>();
    const [, setAasListFiltered] = useState<ListEntityDto[]>();
    const [selectedAasList, setSelectedAasList] = useState<string[]>();
    const searchParams = useSearchParams();
    const urlParam = searchParams?.get('url');
    const [selectedRepository, setSelectedRepository] = useState<string | null | undefined>(
        repositoryUrl ? repositoryUrl : urlParam,
    );
    const env = useEnv();
    const t = useTranslations('pages.aasList');
    const { showError } = useShowError();
    const router = useRouter();
    const pathname = usePathname();

    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [limit, setLimit] = useState(10);

    // Asset Kind Filter
    const [selectedAssetKinds, setSelectedAssetKinds] = useState<AssetKind[]>(['Type']); // Default to Type only

    //Authentication
    const [needAuthentication, setNeedAuthentication] = useState<boolean>(false);

    // checks the passed sorting params and returns an object if valid
    const checkSortingParams = () => {
        const sortBy = searchParams?.get(SEARCH_PARAM_SORT_BY_NAME);
        const sortOrder = searchParams?.get(SEARCH_PARAM_ORDER_NAME);
        // Check for valid data
        if (
            sortBy &&
            sortOrder &&
            sortableColumns.includes(sortBy as SortableColumn) &&
            ['asc', 'desc'].includes(sortOrder as SortOrder)
        ) {
            // Return valid props
            return {
                column: sortBy as SortableColumn,
                order: sortOrder as SortOrder,
            };
        } else {
            // invalid data
            return undefined;
        }
    };

    /// Updates the sorting parameters in the url based on user selection
    const updateSortingParams = (column: SortableColumn, order: SortOrder) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set(SEARCH_PARAM_SORT_BY_NAME, column);
        params.set(SEARCH_PARAM_ORDER_NAME, order);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const clearResults = () => {
        setAasList(undefined);
        setCachedAasList(undefined);
        setNeedAuthentication(false);
    };

    /**
     * If the selected repository changes,
     * the list just needs to be reloaded and shows the first page.
     */
    useAsyncEffect(async () => {
        resetPagination();
        await fetchListData();
    }, [selectedRepository]);

    // Reapply filters and pagination when filters/page/limit change
    React.useEffect(() => {
        if (cachedAasList) {
            applyFiltersAndPagination(cachedAasList);
        }
    }, [selectedAssetKinds, currentPage, cachedAasList, limit]);

    const fetchListData = async () => {
        if (!selectedRepository) return;

        // if the same repo is selected and we already have cached data, do not refetch from backend
        if (selectedRepository === lastRepository && cachedAasList) {
            applyFiltersAndPagination(cachedAasList);
            return;
        }

        setIsLoadingList(true);
        clearResults();

        // Load a large batch of data for caching
        const response = await getAasListEntities(selectedRepository!, FETCH_LIMIT);

        if (response.success) {
            setCachedAasList(response);
            setLastRepository(selectedRepository || undefined);
            applyFiltersAndPagination(response);
        } else {
            if ((response.error as ApiResponseWrapperError<AasListDto>).errorCode == ApiResultStatus.UNAUTHORIZED) {
                setNeedAuthentication(true);
            } else {
                showError(response.error);
            }
        }
        setIsLoadingList(false);
    };

    const applyFiltersAndPagination = (data: AasListDto) => {
        if (!data.entities) return;

        // Filter by selected asset kinds
        const filteredEntities = data.entities.filter(entity =>
            selectedAssetKinds.includes(entity.assetKind)
        );

        // Apply client-side pagination (page size can be changed by user)
        const startIndex = currentPage * limit;
        const endIndex = startIndex + limit;
        const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

        const hasNextPage = endIndex < filteredEntities.length;

        const paginatedData: AasListDto = {
            ...data,
            entities: paginatedEntities,
            cursor: hasNextPage ? 'next' : undefined
        };

        setAasList(paginatedData);
        setAasListFiltered(paginatedEntities);
    };

    const handleNextPage = async () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    /**
     * Handle a click on the back button.
     */
    const handleGoBack = async () => {
        setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
    };

    const resetPagination = () => {
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
            <Typography fontSize="0.75rem" paddingRight={0.5}>
                Rows per page:
            </Typography>
            <Select
                disableUnderline
                variant="standard"
                value={limit}
                onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(0);
                }}
                sx={{ fontSize: '0.75rem' }}
            >
                {[10, 20, 50].map((value) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
            </Select>
            <Typography paddingX="1.625rem" fontSize="0.75rem">
                {t('page') + ': ' + (currentPage + 1)}
            </Typography>
            <IconButton onClick={handleGoBack} disabled={currentPage === 0} data-testid="list-back-button">
                <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleNextPage} disabled={!aasList?.cursor} data-testid="list-next-button">
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    const ListContent = (props: { selectedRepository: string | null | undefined }) => {
        const selectedRepository = props.selectedRepository;
        if (!selectedRepository) {
            return (
                <Box>
                    <Typography data-testid="select-repository-text">{t('selectRepository')}</Typography>
                </Box>
            );
        }

        if (needAuthentication) {
            return <AuthenticationPrompt />;
        }

        return (
            <>
                <AasList
                    data-testid="aas-list"
                    repositoryUrl={selectedRepository}
                    shells={aasList}
                    selectedAasList={selectedAasList}
                    updateSelectedAasList={updateSelectedAasList}
                    comparisonFeatureFlag={env.COMPARISON_FEATURE_FLAG}
                    initialSortOrder={checkSortingParams()}
                    columnSortUpdateCallback={updateSortingParams}
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
                            <SelectRepository onSelectedRepositoryChanged={setSelectedRepository} />
                            <SelectAssetKind
                                selectedAssetKinds={selectedAssetKinds}
                                onSelectedAssetKindsChanged={setSelectedAssetKinds}
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
