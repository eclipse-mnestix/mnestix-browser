import { Box } from '@mui/system';
import { Qualifiable } from 'lib/api/aas/models';

/**
 * Retrieves highlighting information from a qualifiable object.
 * 
 * @param qualifiable - The qualifiable object to extract highlighting information from
 *      Qualifier needs to be of type "HighlightColor"
 * @returns An object containing:
 *   - `highlight`: Boolean indicating whether highlighting should be applied
 *   - `highlightColor`: The color value for highlighting, or empty string if no highlighting
 * 
 * @remarks
 * Searches for a qualifier with type 'HighlightColor' in the qualifiable's qualifiers array.
 * If no qualifiers exist or no matching qualifier is found, returns default non-highlight values.
 */
const getHighlighting = (qualifiable: Qualifiable) => {
    const noHighlight = {
        highlight: false,
        highlightColor: '',
    };
    if (!qualifiable?.qualifiers) {
        return noHighlight;
    }

    const qualifier = qualifiable.qualifiers.find((qualifiable) => {
        return qualifiable.type === 'HighlightColor';
    });

    if (!qualifier || !qualifier.value) {
        return noHighlight;
    }
    return {
        highlight: true,
        highlightColor: qualifier.value,
    };
};

/**
 * Renders a colored highlight box based on qualifier data.
 * 
 * @param highlightData - Boolean flag to enable/disable highlight rendering
 * @param property - The qualifiable property containing potential highlight qualifier information
 * @returns A JSX element with a colored box if highlighting is enabled and valid, otherwise null
 * 
 * @remarks
 * This is an experimental feature that displays a vertical colored bar (8px wide, 1.5em high)
 * when all conditions are met: highlightData is true, property is defined, and a valid
 * HighlightColor qualifier exists.
 */
export const renderHighlight = (highlightData: boolean, property: Qualifiable | undefined) => {
    const highlighting = property ? getHighlighting(property) : { highlight: false, highlightColor: '' };
    return (
        highlightData &&
        property &&
        highlighting.highlight && (
            // EXPERIMENTAL FEATURE
            <Box
                sx={{
                    width: '8px',
                    borderRadius: '2px',
                    backgroundColor: highlighting.highlightColor,
                    marginRight: '12px',
                    height: '1.5em',
                    flexShrink: 0,
                }}
            />
            // ----
        )
    );
};
