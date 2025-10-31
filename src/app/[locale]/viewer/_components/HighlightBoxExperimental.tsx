import { Box } from '@mui/system';
import { Qualifiable } from 'lib/api/aas/models';

const getHighlighting = (qualifiable: Qualifiable) => {
    const noHighlight = {
        highlight: false,
        highlightColor: '',
    };
    if (!qualifiable?.qualifiers) {
        return noHighlight;
    }

    const qualifier = qualifiable.qualifiers.find((qualifiable) => {
        return qualifiable.type == 'HighlightColor';
    });

    if (!qualifier || !qualifier.value) {
        return noHighlight;
    }
    return {
        highlight: true,
        highlightColor: qualifier.value,
    };
};

export const renderHighlight = (highlightData: boolean, property: Qualifiable | undefined) => {
    return (
        highlightData &&
        property &&
        getHighlighting(property).highlight && (
            // EXPERIMENTAL FEATURE
            <Box
                sx={{
                    width: '8px',
                    borderRadius: '2px',
                    backgroundColor: getHighlighting(property).highlightColor,
                    marginRight: '12px',
                    height: '1.5em',
                    flexShrink: 0,
                }}
            />
            // ----
        )
    );
};
