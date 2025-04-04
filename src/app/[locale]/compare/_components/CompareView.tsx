import { Box, Typography } from '@mui/material';
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
import { useTranslations } from 'next-intl';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';

export function CompareView() {
    const { compareAas, addSeveralAas, deleteAas, addAas } = useCompareAasContext();
    const [isLoadingAas, setIsLoadingAas] = useState(false);
    const searchParams = useSearchParams();
    const aasIds = searchParams.getAll('aasId').map((aasId) => {
        return decodeURIComponent(aasId);
    });
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { showError } = useShowError();
    const t = useTranslations('pages.compare');

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
        if (!isSuccess) throw new LocalizedError('validation.errors.unexpectedError');

        if (!result.aas) {
            throw new LocalizedError('pages.compare.errors.moreAasFound');
        }

        const aasExists = compareAas.find((compareAas) => compareAas.aas.id === result.aas!.id);
        if (aasExists) {
            throw new LocalizedError('pages.compare.errors.aasAlreadyAdded');
        }

        try {
            await addAas(result.aas, result.aasData);
        } catch {
            throw new LocalizedError('pages.compare.errors.aasAddError');
        }

        setAddModalOpen(false);
    };

    return (
        <>
            <Box width="90%" maxWidth="1125px" margin="0 auto">
                <Typography variant="h2" textAlign="left" marginBottom="30px">
                    {t('title')}
                </Typography>
                {compareAas.length !== 0 || isLoadingAas ? (
                    <Box display="flex" flexDirection="column" gap="20px">
                        <Box display="flex" flexDirection="row" gap="20px">
                            {compareAas.map((compareAas, index) => (
                                <Box position="relative" key={index} width={1 / 3} data-testid={`compare-aas-${index}`}>
                                    <DialogCloseButton
                                        handleClose={() => handleDeleteAas(compareAas.aas.id)}
                                        dataTestId={`delete-compare-aas-${index}`}
                                    />
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
