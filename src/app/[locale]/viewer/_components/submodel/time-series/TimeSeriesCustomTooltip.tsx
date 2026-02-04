import { Box, Typography } from '@mui/material';

interface TimeSeriesCustomTooltipProps {
    active?: boolean;
    payload?: Array<{ color: string; name: string; value: string }>;
    label?: string;
    formatDate: (dateString: string, onlyTime: boolean) => string;
    onlyTime: boolean;
}

/**
 * Custom tooltip component for time series line chart
 * Displays timestamp and values for all data series at the hovered point
 */
export function TimeSeriesCustomTooltip({
    active,
    payload,
    label,
    formatDate,
    onlyTime,
}: TimeSeriesCustomTooltipProps) {
    if (payload && payload.length && label) {
        return (
            <Box
                sx={{
                    bgcolor: 'white',
                    border: '1px solid #CCCCCC',
                    visibility: !active ? 'hidden' : undefined,
                    padding: '10px',
                }}
            >
                <Typography>{formatDate(label, onlyTime)}</Typography>
                {payload.map((p, index) => (
                    <Box
                        key={index}
                        sx={{ fontSize: 11, color: p.color, paddingY: '4px' }}
                    >{`${p.name} : ${p.value} `}</Box>
                ))}
            </Box>
        );
    }
    return null;
}
