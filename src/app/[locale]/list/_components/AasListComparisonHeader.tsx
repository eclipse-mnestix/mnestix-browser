import { Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { tooltipText } from 'lib/util/ToolTipText';
import { useTranslations } from 'next-intl';

type CompareAasListBarType = {
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

export const AasListComparisonHeader = (props: CompareAasListBarType) => {
    const { selectedAasList, updateSelectedAasList } = props;
    const t = useTranslations('pages.aasList');

    const navigate = useRouter();
    const navigateToCompare = () => {
        const encodedAasList = selectedAasList?.map((aasId) => {
            return encodeURIComponent(aasId);
        });
        const searchString = encodedAasList?.join('&aasId=');
        navigate.push(`/compare?aasId=${searchString}`);
    };

    return (
        <>
            <Box display="flex" gap={2} alignItems="center" justifyContent="flex-end">
                {selectedAasList?.map((selectedAas) => (
                    <Box display="flex" flexDirection="row" alignItems="center" key={selectedAas}>
                        <Typography data-testid={`selected-${selectedAas}`}>{tooltipText(selectedAas, 15)}</Typography>
                        <IconButton onClick={() => updateSelectedAasList(false, selectedAas)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ))}
                <Button
                    variant="contained"
                    onClick={navigateToCompare}
                    disabled={!selectedAasList || selectedAasList.length < 1}
                    data-testid="compare-button"
                >
                    {t('compare')}
                </Button>
            </Box>
        </>
    );
};
