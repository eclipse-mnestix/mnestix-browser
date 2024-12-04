import { Box, Button, IconButton, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { tooltipText } from 'lib/util/ToolTipText';

type CompareAasListBarType = {
    selectedAasList: string[] | undefined;
    updateSelectedAasList: (isChecked: boolean, aasId: string | undefined) => void;
};

export const AasListComparisonHeader = (props: CompareAasListBarType) => {
    const { selectedAasList, updateSelectedAasList } = props;

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
            <Typography marginBottom={3}>
                <FormattedMessage {...messages.mnestix.aasList.subtitle} />
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
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
                    <FormattedMessage {...messages.mnestix.aasList.goToCompare} />
                </Button>
            </Box>
        </>
    );
};
