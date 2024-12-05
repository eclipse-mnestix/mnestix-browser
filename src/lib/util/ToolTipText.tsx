import { Box, Tooltip } from '@mui/material';

/**
 * Shortens the property text and provides the full text in a tooltip.
 */
export function tooltipText(property: string | undefined, maxChars: number) {
    if (!property) return '';
    else {
        return property.length > maxChars ? (
            <Tooltip title={property} arrow>
                <Box component="span">{`${property.slice(0, maxChars)}(...)`}</Box>
            </Tooltip>
        ) : (
            <>{property}</>
        );
    }
}
