import { Typography } from '@mui/material';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';
import { CO2Unit } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/CarbonFootprintVisualizations';

export function CO2Equivalents(props: { totalCO2Equivalents: number; unit: CO2Unit }) {
    return (
        <Typography
            sx={{ color: 'primary.main', fontSize: [72, 96], fontWeight: 'bold', lineHeight: 1 }}
            data-testid="co2-equivalents"
        >
            {`${cutDecimalPlaces(props.totalCO2Equivalents, 3)} ${props.unit}`}
        </Typography>
    );
}
