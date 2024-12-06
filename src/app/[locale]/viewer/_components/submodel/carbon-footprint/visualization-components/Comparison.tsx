import { Box, Typography } from '@mui/material';
import { messages } from 'lib/i18n/localization';
import { useIntl } from 'react-intl';
import Tree from 'assets/tree-icon.svg';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';

// Taken from https://www.co2online.de/service/klima-orakel/beitrag/wie-viele-baeume-braucht-es-um-eine-tonne-co2-zu-binden-10658/
const YearlyCarbonStorageOfBeechTree = 12.5;

function determineTimePeriod(co2Equivalents: number) {
    const numberOfYears = co2Equivalents / YearlyCarbonStorageOfBeechTree;
    if (numberOfYears > 1) return { value: cutDecimalPlaces(numberOfYears, 1), unit: 'years' };
    return { value: cutDecimalPlaces(numberOfYears * 12, 1), unit: 'months' };
}

export function Comparison(props: { co2Equivalents: number }) {
    const intl = useIntl();
    const { value: timePeriod, unit: unitOfTimePeriod } = determineTimePeriod(props.co2Equivalents);

    return (
        <Box data-testid="co2-comparison-box">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Tree alt="Tree" data-testid="co2-comparison-tree" />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: [28, 36], color: 'primary.main', fontWeight: 'bold' }}>
                        1 {intl.formatMessage(messages.mnestix.productCarbonFootprint.beech)}
                    </Typography>
                    <Typography
                        sx={{ fontSize: [28, 36], color: 'primary.main', fontWeight: 'bold' }}
                        data-testid="co2-comparison-value"
                    >
                        {timePeriod} {intl.formatMessage(messages.mnestix.productCarbonFootprint[unitOfTimePeriod])}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Typography variant="caption" data-testid="co2-comparison-assumption">
                    {intl.formatMessage(messages.mnestix.productCarbonFootprint.comparisonAssumption)}
                </Typography>
            </Box>
        </Box>
    );
}
