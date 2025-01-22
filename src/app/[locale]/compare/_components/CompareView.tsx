import { Box, IconButton, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import CloseIcon from '@mui/icons-material/Close';
import { AASOverviewCard } from 'app/[locale]/viewer/_components/AASOverviewCard';
import { AddAasToCompareCard } from 'app/[locale]/compare/_components/add-aas/AddAasToCompareCard';
import { CompareSubmodelsAccordion } from 'app/[locale]/compare/_components/CompareSubmodelsAccordion';
import { CompareAasAddDialog } from 'app/[locale]/compare/_components/add-aas/CompareAasAddDialog';
import { useCompareAasContext } from 'components/contexts/CompareAasContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LocalizedError } from 'lib/util/LocalizedError';
import { performFullAasSearch } from 'lib/services/search-actions/searchActions';
import { useShowError } from 'lib/hooks/UseShowError';

export function CompareView() {
    const { compareAas, addSeveralAas, deleteAas, addAas } = useCompareAasContext();
    const [isLoadingAas, setIsLoadingAas] = useState(false);
    const searchParams = useSearchParams();
    const aasIds = searchParams.getAll('aasId').map((aasId) => {
        return decodeURIComponent(aasId);
    });
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { showError } = useShowError();

    useEffect(() => {
        async function _fetchAas() {
            try {
                setIsLoadingAas(true);
                if (aasIds) {
                    addSeveralAas(aasIds);
                }
            } catch (e) {
                showError(e);
            } finally {
                setIsLoadingAas(false);
            }
        }

        _fetchAas().catch((reason) => {
            showError(reason);
        });
    }, []);

    const handleDetailsModalOpen = () => {
        setAddModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setAddModalOpen(false);
    };

    const handleDeleteAas = (aasId: string) => {
        deleteAas(aasId);
    };

    const handleAddAas = async (aasId: string) => {
        const { isSuccess, result } = await performFullAasSearch(aasId);
        if (!isSuccess) throw new LocalizedError('errors.url-not-found');

        if (!result.aas) {
            throw new LocalizedError('errors.compare-error.more-aas-found');
        }

        const aasExists = compareAas.find((compareAas) => compareAas.aas.id === result.aas!.id);
        if (aasExists) {
            throw new LocalizedError('errors.compare-error.aas-already-added');
        }

        try {
            await addAas(result.aas, result.aasData);
        } catch (e) {
            throw new LocalizedError('errors.compare-error.aas-add-error');
        }

        setAddModalOpen(false);
    };

    return (
        <>
            <Box width="90%" maxWidth="1125px" margin="0 auto">
                <Typography variant="h2" textAlign="left" marginBottom="30px">
                    <FormattedMessage {...messages.mnestix.compare.title} />
                </Typography>
                {compareAas.length !== 0 || isLoadingAas ? (
                    <Box display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" flexDirection="row" gap="20px">
                            {compareAas.map((compareAas, index) => (
                                <Box position="relative" key={index} width={1 / 3} data-testid={`compare-aas-${index}`}>
                                    <IconButton
                                        aria-label="close"
                                        onClick={() => handleDeleteAas(compareAas.aas.id)}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                            zIndex: 5,
                                        }}
                                        data-testid={`delete-compare-aas-${index}`}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <AASOverviewCard
                                        key={index}
                                        aas={compareAas.aas ?? null}
                                        productImage={compareAas.aas?.assetInformation?.defaultThumbnail?.path}
                                        isLoading={isLoadingAas}
                                        isAccordion={true}
                                        imageLinksToDetail={true}
                                        repositoryURL={compareAas.aasOrigin}
                                    />
                                </Box>
                            ))}
                            {compareAas.length < 3 && <AddAasToCompareCard onClick={handleDetailsModalOpen} />}
                        </Box>
                        <Box width={compareAas.length / 3}>
                            <CompareSubmodelsAccordion />
                        </Box>
                    </Box>
                ) : (
                    <>
                        <AddAasToCompareCard onClick={handleDetailsModalOpen} isFirst={true} />
                    </>
                )}
            </Box>
            <CompareAasAddDialog open={addModalOpen} onSubmit={handleAddAas} onClose={handleDetailsModalClose} />
        </>
    );
}
