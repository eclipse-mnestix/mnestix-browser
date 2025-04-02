import { Box, Typography } from '@mui/material';
import Tree from 'assets/tree-icon.svg';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';
import { useTranslations } from 'next-intl';

// Taken from https://www.co2online.de/service/klima-orakel/beitrag/wie-viele-baeume-braucht-es-um-eine-tonne-co2-zu-binden-10658/
const YearlyCarbonStorageOfBeechTree = 12.5;

enum TimeUnit {
    YEAR = 'year',
    MONTH = 'month',
}

function determineTimePeriod(co2Equivalents: number) {
    const numberOfYears = co2Equivalents / YearlyCarbonStorageOfBeechTree;
    if (numberOfYears > 1) return { value: cutDecimalPlaces(numberOfYears, 1), unit: TimeUnit.YEAR };
    return { value: cutDecimalPlaces(numberOfYears * 12, 1), unit: TimeUnit.MONTH };
}

export function Comparison(props: { co2Equivalents: number }) {
    const t = useTranslations('components.carbon');
    const { value: timePeriod, unit: unitOfTimePeriod } = determineTimePeriod(props.co2Equivalents);

    return (
        <Box data-testid="co2-comparison-box">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Tree alt="Tree" data-testid="co2-comparison-tree" />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: [28, 36], color: 'primary.main', fontWeight: 'bold' }}>
                        {t('beech')}
                    </Typography>
                    <Typography sx={{ fontSize: [18, 26], color: 'primary.main', fontWeight: 'bold' }}>
                        {t('comparisonNeeds')}
                    </Typography>
                    <Typography
                        sx={{ fontSize: [28, 36], color: 'primary.main', fontWeight: 'bold' }}
                        data-testid="co2-comparison-value"
                    >
                        {t(`timeunit.${unitOfTimePeriod}`, { count: timePeriod })}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Typography variant="caption" data-testid="co2-comparison-assumption">
                    {t('comparisonAssumption')}
                </Typography>
            </Box>
        </Box>
    );
}
