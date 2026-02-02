import { Box, Typography } from '@mui/material';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';

export interface CustomTooltipWithUnitProps {
    active?: boolean;
    payload?: Array<{ color: string; name: string; value: string }>;
    label?: string | number;
    unit: string;
}

export function CustomTooltipWithUnit({ active, payload, label, unit }: CustomTooltipWithUnitProps) {
    if (payload && payload.length) {
        return (
            <Box sx={{ bgcolor: 'white', visibility: !active ? 'hidden' : undefined, padding: '10px' }}>
                <Typography>{label}</Typography>
                {[...payload]
                    .sort((a, b) => Number.parseFloat(a.value) - Number.parseFloat(b.value))
                    .map((p, index) => (
                        <Box key={index} sx={{ color: p.color, paddingY: '4px' }}>{`${p.name} : ${cutDecimalPlaces(
                            Number.parseFloat(p.value),
                            3,
                        )} ${unit} CO2e`}</Box>
                    ))}
            </Box>
        );
    }
    return null;
}
