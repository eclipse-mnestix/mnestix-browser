import { Typography } from '@mui/material';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';

const unit = 'kg';

export function CO2Equivalents(props: { totalCO2Equivalents: number }) {
    return (
        <Typography
            sx={{ color: 'primary.main', fontSize: [72, 96], fontWeight: 'bold', lineHeight: 1 }}
            data-testid="co2-equivalents"
        >
            {`${cutDecimalPlaces(props.totalCO2Equivalents, 3)} ${unit}`}
        </Typography>
    );
}
